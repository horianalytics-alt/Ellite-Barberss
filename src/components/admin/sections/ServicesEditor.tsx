import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Flame,
} from "lucide-react";
import {
  updateService,
  deleteService,
  saveService,
  reorderServices,
  type ServiceItem,
} from "../../../lib/supabase-db";
import { useSiteData } from "../../../context/SiteDataContext";
import { isSupabaseConfigured } from "../../../lib/supabase";

// ─── Sortable Row ─────────────────────────────────────────────────────────────

function SortableServiceRow({
  service,
  onEdit,
  onDelete,
}: {
  service: ServiceItem;
  onEdit: (svc: ServiceItem) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-xl bg-[#141414] border border-white/8 hover:border-[#C9A84C]/40 transition-all group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-500 hover:text-[#C9A84C] cursor-grab active:cursor-grabbing shrink-0 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {service.imageUrl && (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#C9A84C]/30 shrink-0">
          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-serif font-bold text-white text-sm">{service.name}</span>
          {service.popular && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A84C]/20 text-[10px] font-bold text-[#C9A84C] uppercase">
              <Flame className="w-3 h-3" /> Destaque
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/8">
            {service.category === "cabelo" ? "Cabelo de Ellite" : "Outros"}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {service.price} · {service.time}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(service)}
          className="p-2 rounded-lg text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Service Form Modal ───────────────────────────────────────────────────────

interface ServiceFormProps {
  initial?: Partial<ServiceItem>;
  onSave: (data: Omit<ServiceItem, "id" | "order">) => Promise<void>;
  onCancel: () => void;
}

function ServiceForm({ initial, onSave, onCancel }: ServiceFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<"cabelo" | "outros">(initial?.category ?? "outros");
  const [popular, setPopular] = useState(initial?.popular ?? false);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { uploadServiceImage } = await import("../../../lib/supabase-db");
      const id = initial?.id ?? `new-${Date.now()}`;
      const url = await uploadServiceImage(file, id);
      setImageUrl(url);
    } catch(err) {
      console.error("Erro no upload", err);
      alert("Erro ao fazer upload da imagem. Verifique se o Supabase está configurado corretamente.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!name || !price || !time) return;
    setSaving(true);
    await onSave({ name, price, time, description, category, popular, imageUrl });
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-[#141414] border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl my-auto">
        <h3 className="font-serif text-lg font-bold text-white mb-5">
          {initial?.name ? "Editar Serviço" : "Novo Serviço"}
        </h3>
        
        {/* Imagem do Serviço */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
            Foto do Serviço (Opcional)
          </label>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#C9A84C]/40">
                <img src={imageUrl} alt="Serviço" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center text-gray-500">
                {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : "1:1"}
              </div>
            )}
            <div className="flex-1">
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-300 cursor-pointer hover:bg-white/10 transition-all w-full text-center">
                {uploadingImage ? "Enviando..." : (imageUrl ? "Trocar Foto" : "Escolher Foto")}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploadingImage} />
              </label>
              <p className="text-[10px] text-gray-500 mt-1.5">JPG/PNG. 1:1 recomendado. Aparecerá no card e modal.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input placeholder="Nome do serviço" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          <input placeholder="Preço (ex: R$ 50,00)" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
          <input placeholder="Duração (ex: 30min)" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
          <textarea placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass + " resize-none"} />
          <select value={category} onChange={(e) => setCategory(e.target.value as "cabelo" | "outros")} className={inputClass}>
            <option value="cabelo">Cabelo de Ellite</option>
            <option value="outros">Outros Serviços</option>
          </select>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} className="w-4 h-4 accent-[#C9A84C]" />
            <span className="text-sm text-gray-200">Marcar como Destaque</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving || !name || !price || !time} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C9A84C] text-black font-bold text-sm disabled:opacity-50 transition-all hover:bg-[#E0C068]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/5 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Editor ─────────────────────────────────────────────────────────────

export function ServicesEditor() {
  const { services, updateServicesLocal, refreshServices } = useSiteData();
  const [localServices, setLocalServices] = useState<ServiceItem[]>(services);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  React.useEffect(() => {
    setLocalServices(services);
  }, [services]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localServices.findIndex((s) => s.id === active.id);
    const newIndex = localServices.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(localServices, oldIndex, newIndex).map((s, idx) => ({
      ...s,
      order: idx,
    }));
    setLocalServices(reordered);
    updateServicesLocal(reordered);

    if (isSupabaseConfigured) {
      setSavingOrder(true);
      try {
        await reorderServices(reordered);
        await refreshServices();
      } catch (err) {
        console.error(err);
      } finally {
        setSavingOrder(false);
      }
    }
  };

  const handleSaveEdit = async (data: Omit<ServiceItem, "id" | "order">) => {
    if (!editingService) return;
    const updated = { ...editingService, ...data };
    const nextServices = localServices.map((s) => (s.id === editingService.id ? updated : s));
    setLocalServices(nextServices);
    updateServicesLocal(nextServices);

    if (isSupabaseConfigured) {
      try {
        await updateService(editingService.id, data);
        await refreshServices();
      } catch (err) {
        console.error(err);
      }
    }
    setEditingService(null);
  };

  const handleSaveNew = async (data: Omit<ServiceItem, "id" | "order">) => {
    const newOrder = localServices.length;
    const tempId = `svc-${Date.now()}`;
    const newItem: ServiceItem = { ...data, id: tempId, order: newOrder };
    const nextServices = [...localServices, newItem];
    setLocalServices(nextServices);
    updateServicesLocal(nextServices);

    if (isSupabaseConfigured) {
      try {
        await saveService({ ...data, order: newOrder });
        await refreshServices();
      } catch (err) {
        console.error(err);
      }
    }
    setAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este serviço?")) return;
    const nextServices = localServices.filter((s) => s.id !== id);
    setLocalServices(nextServices);
    updateServicesLocal(nextServices);

    if (isSupabaseConfigured) {
      try {
        await deleteService(id);
        await refreshServices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Supabase não configurado — alterações estão salvas localmente neste navegador.</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {localServices.length} serviço(s) · Arraste para reordenar
          {savingOrder && <span className="ml-2 text-[#C9A84C]">Salvando ordem...</span>}
        </p>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A84C] text-black font-bold text-sm hover:bg-[#E0C068] transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localServices.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {localServices.map((svc) => (
              <SortableServiceRow
                key={svc.id}
                service={svc}
                onEdit={setEditingService}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingService && (
        <ServiceForm
          initial={editingService}
          onSave={handleSaveEdit}
          onCancel={() => setEditingService(null)}
        />
      )}
      {addingNew && (
        <ServiceForm onSave={handleSaveNew} onCancel={() => setAddingNew(false)} />
      )}
    </div>
  );
}
