import React, { useState, useRef } from "react";
import { Upload, Loader2, AlertCircle, CheckCircle2, ImagePlus, Scissors } from "lucide-react";
import { uploadLogo, saveSiteConfig } from "../../../lib/supabase-db";
import { useSiteData } from "../../../context/SiteDataContext";
import { isSupabaseConfigured } from "../../../lib/supabase";

export function LogoEditor() {
  const { siteConfig, updateSiteConfigLocal } = useSiteData();
  const [previewUrl, setPreviewUrl] = useState<string | null>(siteConfig.logoUrl || null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreviewUrl(siteConfig.logoUrl || null);
  }, [siteConfig.logoUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("png")) {
      setStatus("error");
      setErrorMsg("Por favor, selecione um arquivo PNG com fundo transparente.");
      return;
    }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus("idle");
  };

  const handleSave = async () => {
    if (!pendingFile && !previewUrl) return;
    setUploading(true);
    try {
      let finalUrl = previewUrl || "";

      if (pendingFile) {
        if (isSupabaseConfigured) {
          try {
            finalUrl = await uploadLogo(pendingFile);
          } catch (uploadErr: any) {
            console.warn("Storage upload failed, keeping local URL:", uploadErr);
          }
        }
      }

      updateSiteConfigLocal({ logoUrl: finalUrl });

      if (isSupabaseConfigured) {
        await saveSiteConfig({ logoUrl: finalUrl });
        // Note: do NOT call refreshSiteConfig() — it could overwrite saved data.
      }

      setPendingFile(null);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Erro ao salvar a logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Supabase não configurado — a logo está salva localmente neste navegador.</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10">
        <h3 className="font-serif text-base font-bold text-white mb-4">Preview da Logo</h3>

        {/* Preview Area */}
        <div className="flex items-center justify-center w-full h-48 rounded-xl bg-[#0a0a0a] border border-[#C9A84C]/20 mb-4 overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Logo preview"
              className="max-h-40 max-w-[280px] object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <div className="w-16 h-16 rounded-full border border-[#C9A84C]/30 flex items-center justify-center">
                <Scissors className="w-8 h-8 text-[#C9A84C]/50" />
              </div>
              <p className="text-sm">Nenhuma logo carregada</p>
              <p className="text-xs text-gray-600">Recomendado: PNG com fundo transparente</p>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-semibold hover:bg-[#C9A84C]/10 transition-all"
          >
            <ImagePlus className="w-4 h-4" />
            Selecionar PNG
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={handleFileSelect}
            className="hidden"
          />

          {pendingFile && (
            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C9A84C] text-black font-bold text-sm hover:bg-[#E0C068] disabled:opacity-60 transition-all"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Enviando..." : "Salvar Logo"}
            </button>
          )}
        </div>

        {status === "success" && (
          <p className="flex items-center gap-2 text-green-400 text-sm mt-3">
            <CheckCircle2 className="w-4 h-4" /> Logo salva com sucesso!
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-red-400 text-sm mt-3">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-[#141414] border border-white/8 text-xs text-gray-400 space-y-1">
        <p className="font-semibold text-gray-300">Recomendações para a logo:</p>
        <p>• Formato: PNG com fundo transparente</p>
        <p>• Tamanho ideal: 400×400px ou maior</p>
        <p>• Após o upload, a logo aparece automaticamente na landing page</p>
      </div>
    </div>
  );
}
