import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { saveSiteConfig, type SiteConfig } from "../../../lib/supabase-db";
import { useSiteData } from "../../../context/SiteDataContext";
import { isSupabaseConfigured } from "../../../lib/supabase";

const schema = z.object({
  barbershopName: z.string().min(1, "Obrigatório"),
  heroTitle: z.string().min(1, "Obrigatório"),
  heroSubtitle: z.string().min(1, "Obrigatório"),
  address: z.string().min(1, "Obrigatório"),
  hoursText: z.string().min(1, "Obrigatório"),
  booksyUrl: z.string().url("URL inválida"),
  whatsappUrl: z.string().url("URL inválida"),
});

type FormData = z.infer<typeof schema>;

export function GeneralInfoEditor() {
  const { siteConfig, updateSiteConfigLocal, refreshSiteConfig } = useSiteData();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      barbershopName: siteConfig.barbershopName,
      heroTitle: siteConfig.heroTitle,
      heroSubtitle: siteConfig.heroSubtitle,
      address: siteConfig.address,
      hoursText: siteConfig.hoursText,
      booksyUrl: siteConfig.booksyUrl,
      whatsappUrl: siteConfig.whatsappUrl,
    },
  });

  // Sync form values whenever siteConfig in context updates (e.g. tab switches, remote fetches)
  useEffect(() => {
    reset({
      barbershopName: siteConfig.barbershopName,
      heroTitle: siteConfig.heroTitle,
      heroSubtitle: siteConfig.heroSubtitle,
      address: siteConfig.address,
      hoursText: siteConfig.hoursText,
      booksyUrl: siteConfig.booksyUrl,
      whatsappUrl: siteConfig.whatsappUrl,
    });
  }, [siteConfig, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // 1. Update local state immediately so tabs switch without losing data
      updateSiteConfigLocal(data);

      // 2. Persist to Supabase if configured
      if (isSupabaseConfigured) {
        await saveSiteConfig(data);
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
    <div className="space-y-6 max-w-2xl">
      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Supabase não configurado — as alterações estão salvas localmente neste navegador. Para sincronizar na nuvem, configure as variáveis no seu <code className="text-amber-200">.env</code>.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {(
          [
            { name: "barbershopName", label: "Nome da Barbearia" },
            { name: "heroTitle", label: "Frase Principal (Hero)" },
            { name: "heroSubtitle", label: "Subfrase (Hero)" },
            { name: "address", label: "Endereço" },
            { name: "hoursText", label: "Horário de Funcionamento" },
            { name: "booksyUrl", label: "Link de Agendamento (Booksy)" },
            { name: "whatsappUrl", label: "Link do WhatsApp (wa.me/...)" },
          ] as const
        ).map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-semibold text-gray-200 mb-1.5">
              {label}
            </label>
            <input
              {...register(name)}
              className={`w-full px-4 py-3 rounded-xl bg-[#141414] border text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition-all ${
                errors[name] ? "border-red-500/60" : "border-white/10 focus:border-[#C9A84C]/50"
              }`}
            />
            {errors[name] && (
              <p className="text-xs text-red-400 mt-1">{errors[name]?.message}</p>
            )}
          </div>
        ))}

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A84C] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#E0C068] disabled:opacity-60 transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>

          {status === "success" && (
            <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso!
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4" /> Erro ao salvar.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
