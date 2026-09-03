import React, { useState, useRef, useCallback } from "react";
import {
  Trash2,
  AlertCircle,
  Loader2,
  ImagePlus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Save,
  Sparkles,
  Link as LinkIcon,
  X,
} from "lucide-react";
import {
  uploadAmbienteImage,
  saveSiteConfig,
} from "../../../lib/supabase-db";
import { useSiteData } from "../../../context/SiteDataContext";
import { isSupabaseConfigured } from "../../../lib/supabase";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function AmbienteEditor() {
  const { siteConfig, updateSiteConfigLocal } = useSiteData();

  // Initialize ONCE from context — do NOT re-sync from context on every render.
  // We are the sole owner of this state while the editor is mounted.
  const [images, setImages] = useState<string[]>(() => {
    if (siteConfig.aboutImages && siteConfig.aboutImages.length > 0) {
      return [...siteConfig.aboutImages];
    }
    return [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
    ];
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist to localStorage + Supabase, WITHOUT calling refreshSiteConfig (that causes the revert)
  const persistImages = useCallback(async (imgs: string[]) => {
    // 1. Immediately write to context & localStorage
    updateSiteConfigLocal({ aboutImages: imgs });

    // 2. Try Supabase — but never refresh/reload back from it
    if (isSupabaseConfigured) {
      try {
        await saveSiteConfig({ aboutImages: imgs });
      } catch (err) {
        console.warn("Supabase save failed (changes still kept locally):", err);
      }
    }
  }, [updateSiteConfigLocal]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setUploadError(null);

    try {
      const newUrls: string[] = [];

      for (const file of files) {
        // Convert to base64 first — guaranteed to work without network
        let finalUrl = await fileToBase64(file);

        // Try cloud upload if Supabase is available
        if (isSupabaseConfigured) {
          try {
            const tempId = `amb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            const cloudUrl = await uploadAmbienteImage(file, tempId);
            if (cloudUrl) finalUrl = cloudUrl;
          } catch (uploadErr) {
            console.warn("Cloud upload failed, keeping base64:", uploadErr);
          }
        }

        newUrls.push(finalUrl);
      }

      const next = [...images, ...newUrls];
      setImages(next);
      await persistImages(next);
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

  const handleAddCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = customUrl.trim();
    if (!url) return;

    const next = [...images, url];
    setImages(next);
    setCustomUrl("");
    setShowUrlInput(false);
    await persistImages(next);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const confirmDelete = async () => {
    if (deletingIndex === null) return;
    const index = deletingIndex;
    setDeletingIndex(null);

    // Always keep at least 1 photo
    let next = images.filter((_, idx) => idx !== index);
    if (next.length === 0) {
      next = [
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
      ];
    }

    setImages(next);
    await persistImages(next);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleMove = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const next = [...images];
    const item = next.splice(fromIndex, 1)[0];
    if (item === undefined) return;
    next.splice(toIndex, 0, item);
    setImages(next);
    await persistImages(next);
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await persistImages(images);
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

      {/* Info Card + Actions */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/20 text-xs text-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span>
            As fotos abaixo passam automaticamente na seção{" "}
            <strong>Sobre Nós (Ambiente Exclusivo)</strong> a cada{" "}
            <strong>6 segundos</strong>.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1f1f1f] text-gray-200 border border-white/10 hover:border-[#C9A84C] text-xs font-medium transition-all"
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#C9A84C]" />
            Adicionar por URL
          </button>
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A84C] text-black font-bold text-xs hover:bg-[#E0C068] disabled:opacity-60 transition-all"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Salvar Ordem
          </button>
        </div>
      </div>

      {/* URL Input Form */}
      {showUrlInput && (
        <form
          onSubmit={handleAddCustomUrl}
          className="p-4 rounded-2xl bg-[#101010] border border-[#C9A84C]/40 flex gap-2 items-center"
        >
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Cole o link direto da imagem (ex: https://images.unsplash.com/...)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#C9A84C] text-black font-bold text-xs hover:bg-[#E0C068]"
          >
            Adicionar
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

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
            <p className="text-sm text-gray-300">Processando e adicionando fotos...</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-all">
              <ImagePlus className="w-7 h-7 text-[#C9A84C]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                Adicionar Fotos do Ambiente Exclusivo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP — Clique para selecionar do seu dispositivo
              </p>
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
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com sucesso!
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" /> Erro ao salvar.
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((url, idx) => (
            <div
              key={`${idx}-${url.slice(0, 30)}`}
              className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-[#141414] border border-white/10 hover:border-[#C9A84C]/50 transition-all shadow-md"
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
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {idx > 0 && (
                  <button
                    onClick={() => handleMove(idx, idx - 1)}
                    title="Mover para a esquerda"
                    className="p-2.5 rounded-xl bg-black/80 text-white hover:text-[#C9A84C] border border-white/10 hover:scale-110 transition-transform"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setDeletingIndex(idx)}
                  title="Excluir foto"
                  className="p-2.5 rounded-xl bg-red-600/90 text-white hover:bg-red-500 hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {idx < images.length - 1 && (
                  <button
                    onClick={() => handleMove(idx, idx + 1)}
                    title="Mover para a direita"
                    className="p-2.5 rounded-xl bg-black/80 text-white hover:text-[#C9A84C] border border-white/10 hover:scale-110 transition-transform"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deletingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#141414] border border-[#C9A84C]/40 p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                Remover Foto {deletingIndex + 1}?
              </h3>
              <p className="text-xs text-gray-400">
                Esta imagem será excluída do carrossel do Ambiente Exclusivo.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingIndex(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#222] hover:bg-[#333] text-gray-200 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
