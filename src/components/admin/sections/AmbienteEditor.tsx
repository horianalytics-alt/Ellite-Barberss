import React, { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  AlertCircle,
  Loader2,
  ImagePlus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Save,
  Sparkles,
} from "lucide-react";
import {
  uploadAmbienteImage,
  saveSiteConfig,
} from "../../../lib/supabase-db";
import { useSiteData } from "../../../context/SiteDataContext";
import { isSupabaseConfigured } from "../../../lib/supabase";

export function AmbienteEditor() {
  const { siteConfig, updateSiteConfigLocal, refreshSiteConfig } = useSiteData();
  const [images, setImages] = useState<string[]>(
    siteConfig.aboutImages && siteConfig.aboutImages.length > 0
      ? siteConfig.aboutImages
      : [
          "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
        ]
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (siteConfig.aboutImages && siteConfig.aboutImages.length > 0) {
      setImages(siteConfig.aboutImages);
    }
  }, [siteConfig.aboutImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setUploadError(null);

    try {
      const newUrls: string[] = [];

      for (const file of files) {
        let url = URL.createObjectURL(file);

        if (isSupabaseConfigured) {
          try {
            const tempId = `amb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            url = await uploadAmbienteImage(file, tempId);
          } catch (uploadErr: any) {
            console.warn("Upload falhou no Storage, usando URL local:", uploadErr);
          }
        }

        newUrls.push(url);
      }

      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      updateSiteConfigLocal({ aboutImages: updatedImages });

      if (isSupabaseConfigured) {
        await saveSiteConfig({ aboutImages: updatedImages });
        await refreshSiteConfig();
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error(err);
      setUploadError(err?.message || "Erro no upload das fotos.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (index: number) => {
    if (images.length <= 1) {
      alert("Mantenha pelo menos 1 foto para a seção Ambiente Exclusivo.");
      return;
    }
    if (!confirm("Remover esta foto do Ambiente?")) return;

    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
    updateSiteConfigLocal({ aboutImages: updatedImages });

    if (isSupabaseConfigured) {
      try {
        await saveSiteConfig({ aboutImages: updatedImages });
        await refreshSiteConfig();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMove = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const next = [...images];
    const item = next.splice(fromIndex, 1)[0];
    next.splice(toIndex, 0, item);

    setImages(next);
    updateSiteConfigLocal({ aboutImages: next });

    if (isSupabaseConfigured) {
      try {
        await saveSiteConfig({ aboutImages: next });
        await refreshSiteConfig();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      updateSiteConfigLocal({ aboutImages: images });
      if (isSupabaseConfigured) {
        await saveSiteConfig({ aboutImages: images });
        await refreshSiteConfig();
      }
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Supabase não configurado — as fotos do ambiente estão salvas localmente neste navegador.
          </p>
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{uploadError}</p>
        </div>
      )}

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/20 text-xs text-gray-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span>
            As fotos abaixo passam automaticamente na seção <strong>Sobre Nós (Ambiente Exclusivo)</strong> a cada <strong>6 segundos</strong>.
          </span>
        </div>
        <button
          onClick={handleManualSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A84C] text-black font-bold text-xs hover:bg-[#E0C068] disabled:opacity-60 transition-all shrink-0"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Salvar Ordem
        </button>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] bg-[#141414] hover:bg-[#1a1a1a] cursor-pointer transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {uploading ? (
          <>
            <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin" />
            <p className="text-sm text-gray-300">Fazendo upload das fotos do ambiente...</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-all">
              <ImagePlus className="w-7 h-7 text-[#C9A84C]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Adicionar Fotos do Ambiente Exclusivo</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — Você pode selecionar várias imagens</p>
            </div>
          </>
        )}
      </div>

      {/* Photos Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-300">
            {images.length} foto(s) cadastradas no carrossel
          </p>
          {status === "success" && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com sucesso!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-[#141414] border border-white/10 hover:border-[#C9A84C]/50 transition-all"
            >
              <img
                src={url}
                alt={`Ambiente ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Index Badge */}
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-[#E0C068]">
                Foto {idx + 1}
              </div>

              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx > 0 && (
                  <button
                    onClick={() => handleMove(idx, idx - 1)}
                    title="Mover para a esquerda"
                    className="p-2 rounded-xl bg-black/80 text-white hover:text-[#C9A84C] border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(idx)}
                  title="Excluir foto"
                  className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {idx < images.length - 1 && (
                  <button
                    onClick={() => handleMove(idx, idx + 1)}
                    title="Mover para a direita"
                    className="p-2 rounded-xl bg-black/80 text-white hover:text-[#C9A84C] border border-white/10"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
