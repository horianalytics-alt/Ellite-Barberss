import React, { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Upload,
  Trash2,
  GripVertical,
  AlertCircle,
  Loader2,
  ImagePlus,
  Link as LinkIcon,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  uploadGalleryImage,
  saveGalleryItem,
  deleteGalleryItem,
  reorderGallery,
  type GalleryItem,
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

// ─── Sortable Photo Card ──────────────────────────────────────────────────────

function SortablePhoto({
  item,
  onDeleteRequest,
}: {
  item: GalleryItem;
  onDeleteRequest: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-2xl overflow-hidden aspect-square bg-[#141414] border border-white/10 shadow-md">
      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <button
          {...attributes}
          {...listeners}
          title="Arraste para reordenar"
          className="p-2.5 bg-black/80 rounded-xl text-white hover:text-[#C9A84C] cursor-grab active:cursor-grabbing touch-none border border-white/10"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onDeleteRequest(item.id)}
          title="Excluir foto"
          className="p-2.5 bg-red-600/90 rounded-xl text-white hover:bg-red-500 border border-white/10"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export function GalleryEditor() {
  const { gallery, updateGalleryLocal, refreshGallery } = useSiteData();
  const [localGallery, setLocalGallery] = useState<GalleryItem[]>(gallery);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Custom URL input
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setLocalGallery(gallery);
  }, [gallery]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localGallery.findIndex((g) => g.id === active.id);
    const newIndex = localGallery.findIndex((g) => g.id === over.id);
    const reordered = arrayMove(localGallery, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      order: idx,
    }));
    setLocalGallery(reordered);
    updateGalleryLocal(reordered);

    if (isSupabaseConfigured) {
      try {
        await reorderGallery(reordered);
        await refreshGallery();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setUploadError(null);

    try {
      let currentList = [...localGallery];

      for (const file of files) {
        const tempId = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        let finalUrl = await fileToBase64(file);

        if (isSupabaseConfigured) {
          try {
            const uploadedUrl = await uploadGalleryImage(file, tempId);
            if (uploadedUrl) finalUrl = uploadedUrl;
          } catch (uploadErr: any) {
            console.warn("Storage upload failed, keeping base64:", uploadErr);
          }
        }

        const newOrder = currentList.length;
        const newItem: GalleryItem = {
          id: tempId,
          url: finalUrl,
          title: file.name.replace(/\.[^.]+$/, ""),
          category: "Trabalhos",
          order: newOrder,
        };

        currentList = [...currentList, newItem];
        setLocalGallery(currentList);
        updateGalleryLocal(currentList);

        if (isSupabaseConfigured) {
          try {
            const savedId = await saveGalleryItem({
              url: newItem.url,
              title: newItem.title,
              category: newItem.category,
              order: newOrder,
            });
            newItem.id = savedId;
            await refreshGallery();
          } catch (dbErr) {
            console.warn(dbErr);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err?.message || "Erro no upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const tempId = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newOrder = localGallery.length;
    const newItem: GalleryItem = {
      id: tempId,
      url: customUrl.trim(),
      title: "Foto do Corte",
      category: "Trabalhos",
      order: newOrder,
    };

    const next = [...localGallery, newItem];
    setLocalGallery(next);
    updateGalleryLocal(next);
    setCustomUrl("");
    setShowUrlInput(false);

    if (isSupabaseConfigured) {
      try {
        const savedId = await saveGalleryItem({
          url: newItem.url,
          title: newItem.title,
          category: newItem.category,
          order: newOrder,
        });
        newItem.id = savedId;
        await refreshGallery();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    const id = deletingId;
    setDeletingId(null);

    const nextGallery = localGallery.filter((g) => g.id !== id);
    setLocalGallery(nextGallery);
    updateGalleryLocal(nextGallery);

    if (isSupabaseConfigured) {
      try {
        await deleteGalleryItem(id);
        await refreshGallery();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Supabase não configurado — fotos estão salvas localmente neste navegador.</p>
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{uploadError}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">{localGallery.length} foto(s) cadastradas · Arraste para reordenar</p>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] text-gray-300 border border-white/10 hover:border-[#C9A84C] text-xs font-medium transition-all"
        >
          <LinkIcon className="w-3.5 h-3.5 text-[#C9A84C]" />
          Adicionar por URL
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleAddCustomUrl} className="p-4 rounded-2xl bg-[#101010] border border-[#C9A84C]/40 flex gap-2 items-center">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Cole o link da imagem (ex: https://images.unsplash.com/...)"
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
        className="flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] bg-[#141414] hover:bg-[#1a1a1a] cursor-pointer transition-all group"
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
            <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-all">
              <ImagePlus className="w-8 h-8 text-[#C9A84C]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Clique para fazer upload de fotos dos cortes</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — Você pode selecionar várias imagens</p>
            </div>
          </>
        )}
      </div>

      {/* Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localGallery.map((g) => g.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {localGallery.map((item) => (
              <SortablePhoto key={item.id} item={item} onDeleteRequest={(id) => setDeletingId(id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Custom Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#141414] border border-[#C9A84C]/40 p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                Remover Foto da Galeria?
              </h3>
              <p className="text-xs text-gray-400">
                Esta imagem será excluída permanentemente da galeria.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#222] hover:bg-[#333] text-gray-200 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-lg"
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
