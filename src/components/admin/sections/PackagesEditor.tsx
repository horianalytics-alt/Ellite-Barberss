import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Crown,
  GripVertical,
} from "lucide-react";
import {
  updatePackage,
  deletePackage,
  savePackage,
  type PackageItem,
} from "../../../lib/firestore";
import { useSiteData } from "../../../context/SiteDataContext";
import { isFirebaseConfigured } from "../../../lib/firebase";

// ─── Package Form Modal ───────────────────────────────────────────────────────

interface PackageFormProps {
  initial?: Partial<PackageItem>;
  onSave: (data: Omit<PackageItem, "id" | "order">) => Promise<void>;
  onCancel: () => void;
}

function PackageForm({ initial, onSave, onCancel }: PackageFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [benefits, setBenefits] = useState<string[]>(initial?.benefits ?? [""]);
  const [highlighted, setHighlighted] = useState(initial?.highlighted ?? false);
  const [badgeText, setBadgeText] = useState(initial?.badgeText ?? "");
  const [saving, setSaving] = useState(false);

  const addBenefit = () => setBenefits((b) => [...b, ""]);
  const updateBenefit = (i: number, val: string) =>
    setBenefits((b) => b.map((x, idx) => (idx === i ? val : x)));
  const removeBenefit = (i: number) =>
    setBenefits((b) => b.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!name || !price) return;
    setSaving(true);
    await onSave({
      name,
      price,
      description,
      benefits: benefits.filter(Boolean),
      highlighted,
      badgeText,
    });
    setSaving(false);
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141414] border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-serif text-lg font-bold text-white mb-5">
          {initial?.name ? "Editar Pacote" : "Novo Pacote"}
        </h3>
        <div className="space-y-4">
          <input placeholder="Nome do pacote" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          <input placeholder="Preço (ex: 149,99)" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
          <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass + " resize-none"} />

          {/* Benefits */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Benefícios incluídos
            </label>
            <div className="space-y-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={b}
                    onChange={(e) => updateBenefit(i, e.target.value)}
                    placeholder={`Benefício ${i + 1}`}
                    className={inputClass + " flex-1"}
                  />
                  <button onClick={() => removeBenefit(i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addBenefit} className="mt-2 flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#E0C068]">
              <Plus className="w-4 h-4" /> Adicionar benefício
            </button>
          </div>

          {/* Highlighted toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={highlighted} onChange={(e) => setHighlighted(e.target.checked)} className="w-4 h-4 accent-[#C9A84C]" />
            <span className="text-sm text-gray-200">Pacote em Destaque (VIP Dourado)</span>
          </label>

          {highlighted && (
            <input placeholder="Texto do badge (ex: Mais Vantajoso)" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} className={inputClass} />
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving || !name || !price} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C9A84C] text-black font-bold text-sm disabled:opacity-50 hover:bg-[#E0C068] transition-all">
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

// ─── Main Editor ──────────────────────────────────────────────────────────────

export function PackagesEditor() {
  const { packages } = useSiteData();
  const [localPackages, setLocalPackages] = useState<PackageItem[]>(packages);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  React.useEffect(() => {
    setLocalPackages(packages);
  }, [packages]);

  const handleSaveEdit = async (data: Omit<PackageItem, "id" | "order">) => {
    if (!editingPkg) return;
    const updated = { ...editingPkg, ...data };
    setLocalPackages((prev) => prev.map((p) => p.id === editingPkg.id ? updated : p));
    if (isFirebaseConfigured) {
      await updatePackage(editingPkg.id, data).catch(console.error);
    }
    setEditingPkg(null);
  };

  const handleSaveNew = async (data: Omit<PackageItem, "id" | "order">) => {
    const newItem: PackageItem = { ...data, id: `pkg-${Date.now()}`, order: localPackages.length };
    setLocalPackages((prev) => [...prev, newItem]);
    if (isFirebaseConfigured) {
      await savePackage({ ...data, order: localPackages.length }).catch(console.error);
    }
    setAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este pacote?")) return;
    setLocalPackages((prev) => prev.filter((p) => p.id !== id));
    if (isFirebaseConfigured) {
      await deletePackage(id).catch(console.error);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {!isFirebaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Firebase não configurado — alterações não serão persistidas.</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{localPackages.length} pacote(s)</p>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A84C] text-black font-bold text-sm hover:bg-[#E0C068] transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Pacote
        </button>
      </div>

      <div className="space-y-4">
        {localPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-5 rounded-2xl border transition-all ${
              pkg.highlighted
                ? "bg-gradient-to-b from-[#1c170b] to-[#141414] border-[#C9A84C]/60"
                : "bg-[#141414] border-white/10"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {pkg.highlighted && <Crown className="w-4 h-4 text-[#C9A84C]" />}
                  <h3 className="font-serif font-bold text-white">{pkg.name}</h3>
                </div>
                <p className="text-lg font-bold text-[#C9A84C]">R$ {pkg.price}<span className="text-sm text-gray-400 font-normal">/mês</span></p>
                <ul className="mt-2 space-y-1">
                  {pkg.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-[#C9A84C] rounded-full shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditingPkg(pkg)} className="p-2 rounded-lg text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(pkg.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPkg && <PackageForm initial={editingPkg} onSave={handleSaveEdit} onCancel={() => setEditingPkg(null)} />}
      {addingNew && <PackageForm onSave={handleSaveNew} onCancel={() => setAddingNew(false)} />}
    </div>
  );
}
