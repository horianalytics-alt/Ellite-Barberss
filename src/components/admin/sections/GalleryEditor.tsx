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
} from "lucide-react";
import {
  uploadGalleryImage,
  saveGalleryItem,
  deleteGalleryItem,
  reorderGallery,
  type GalleryItem,
} from "../../../lib/firestore";
import { useSiteData } from "../../../context/SiteDataContext";
import { isFirebaseConfigured } from "../../../lib/firebase";

// ─── Sortable Photo Card ──────────────────────────────────────────────────────

function SortablePhoto({
  item,
  onDelete,
}: {
  item: GalleryItem;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-xl overflow-hidden aspect-square bg-[#141414] border border-white/10">
      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-black/60 rounded-lg text-white cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <p className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black text-xs text-white font-medium truncate">
        {item.title}
      </p>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export function GalleryEditor() {
  const { gallery } = useSiteData();
  const [localGallery, setLocalGallery] = useState<GalleryItem[]>(gallery);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
    const reordered = arrayMove(localGallery, oldIndex, newIndex);
    setLocalGallery(reordered);
    if (isFirebaseConfigured) {
      await reorderGallery(reordered).catch(console.error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (!isFirebaseConfigured) {
      setUploadError("Firebase não configurado. Não é possível fazer upload.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      for (const file of files) {
        const tempId = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const url = await uploadGalleryImage(file, tempId);
        const newOrder = localGallery.length;
        const newItem: GalleryItem = {
          id: tempId,
          url,
          title: file.name.replace(/\.[^.]+$/, ""),
          category: "Trabalhos",
          order: newOrder,
        };
        const savedId = await saveGalleryItem({ url, title: newItem.title, category: newItem.category, order: newOrder });
        setLocalGallery((prev) => [...prev, { ...newItem, id: savedId }]);
      }
    } catch (err) {
      setUploadError("Erro no upload. Verifique as permissões do Firebase Storage.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta foto da galeria?")) return;
    setLocalGallery((prev) => prev.filter((g) => g.id !== id));
    if (isFirebaseConfigured) {
      await deleteGalleryItem(id).catch(console.error);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {!isFirebaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Firebase não configurado — upload de imagens requer Firebase Storage configurado.</p>
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{uploadError}</p>
        </div>
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
            <p className="text-sm text-gray-300">Fazendo upload...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-all">
              <ImagePlus className="w-8 h-8 text-[#C9A84C]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Clique para fazer upload de fotos</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — Múltiplas seleções permitidas</p>
            </div>
          </>
        )}
      </div>

      {/* Grid */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{localGallery.length} foto(s) · Arraste para reordenar</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localGallery.map((g) => g.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {localGallery.map((item) => (
              <SortablePhoto key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
