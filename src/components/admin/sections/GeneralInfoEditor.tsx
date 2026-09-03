import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, AlertCircle, CheckCircle2, Loader2, MapPin, Clock, Phone, Sparkles } from "lucide-react";
import { saveSiteConfig, type SiteConfig } from "../../../lib/supabase-db";
import { useSiteData } from "../../../context/SiteDataContext";
import { isSupabaseConfigured } from "../../../lib/supabase";

const schema = z.object({
  barbershopName: z.string().min(1, "Obrigatório"),
  heroTitle: z.string().min(1, "Obrigatório"),
  heroSubtitle: z.string().min(1, "Obrigatório"),
  address: z.string().min(1, "Obrigatório"),
  addressComplement: z.string().optional().default(""),
  hoursText: z.string().min(1, "Obrigatório"),
  phoneText: z.string().optional().default(""),
  booksyUrl: z.string().min(1, "Obrigatório"),
  whatsappUrl: z.string().min(1, "Obrigatório"),
  googleMapsUrl: z.string().optional().default(""),
  googleMapsEmbedUrl: z.string().optional().default(""),
});

type FormData = z.infer<typeof schema>;

export function GeneralInfoEditor() {
  const { siteConfig, updateSiteConfigLocal } = useSiteData();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorDetails, setErrorDetails] = useState<string>("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      barbershopName: siteConfig.barbershopName,
      heroTitle: siteConfig.heroTitle,
      heroSubtitle: siteConfig.heroSubtitle,
      address: siteConfig.address,
      addressComplement: siteConfig.addressComplement || "",
      hoursText: siteConfig.hoursText,
      phoneText: siteConfig.phoneText || "",
      booksyUrl: siteConfig.booksyUrl,
      whatsappUrl: siteConfig.whatsappUrl,
      googleMapsUrl: siteConfig.googleMapsUrl || "",
      googleMapsEmbedUrl: siteConfig.googleMapsEmbedUrl || "",
    },
  });

  // Sync form values whenever siteConfig in context updates (e.g. tab switches, remote fetches)
  useEffect(() => {
    reset({
      barbershopName: siteConfig.barbershopName,
      heroTitle: siteConfig.heroTitle,
      heroSubtitle: siteConfig.heroSubtitle,
      address: siteConfig.address,
      addressComplement: siteConfig.addressComplement || "",
      hoursText: siteConfig.hoursText,
      phoneText: siteConfig.phoneText || "",
      booksyUrl: siteConfig.booksyUrl,
      whatsappUrl: siteConfig.whatsappUrl,
      googleMapsUrl: siteConfig.googleMapsUrl || "",
      googleMapsEmbedUrl: siteConfig.googleMapsEmbedUrl || "",
    });
  }, [siteConfig, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setErrorDetails("");
    try {
      const payload: Partial<SiteConfig> = {
        barbershopName: data.barbershopName,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        address: data.address,
        addressComplement: data.addressComplement || "",
        hoursText: data.hoursText,
        phoneText: data.phoneText || "",
        booksyUrl: data.booksyUrl,
        whatsappUrl: data.whatsappUrl,
        googleMapsUrl: data.googleMapsUrl || "",
        googleMapsEmbedUrl: data.googleMapsEmbedUrl || "",
      };

      // 1. Update local state immediately so tabs switch without losing data
      updateSiteConfigLocal(payload);

      // 2. Persist to Supabase if configured
      if (isSupabaseConfigured) {
        await saveSiteConfig(payload);
        // Note: do NOT call refreshSiteConfig() here — it could overwrite the
        // just-saved local state if Supabase columns are missing.
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setErrorDetails(err?.message || "Erro desconhecido ao salvar no banco.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C]/50 transition-all";

  return (
    <div className="space-y-6 max-w-3xl">
      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Supabase não configurado — as alterações estão salvas localmente neste navegador.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Bloco 1: Informações da Marca & Hero */}
        <div className="p-6 rounded-2xl bg-[#101010] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <h3 className="font-serif text-base font-bold text-white">Marca & Hero Principal</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Nome da Barbearia
            </label>
            <input {...register("barbershopName")} className={inputClass} placeholder="ELLITE BARBERSS" />
            {errors.barbershopName && <p className="text-xs text-red-400 mt-1">{errors.barbershopName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Frase Principal do Hero
            </label>
            <input {...register("heroTitle")} className={inputClass} placeholder="Tradição e estilo no mesmo lugar" />
            {errors.heroTitle && <p className="text-xs text-red-400 mt-1">{errors.heroTitle.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Subfrase do Hero
            </label>
            <input {...register("heroSubtitle")} className={inputClass} placeholder="Cortes masculinos e barba em Arujá-SP" />
            {errors.heroSubtitle && <p className="text-xs text-red-400 mt-1">{errors.heroSubtitle.message}</p>}
          </div>
        </div>

        {/* Bloco 2: Localização & Endereço */}
        <div className="p-6 rounded-2xl bg-[#101010] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <MapPin className="w-4 h-4 text-[#C9A84C]" />
            <h3 className="font-serif text-base font-bold text-white">Localização & Endereço</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Endereço Principal
            </label>
            <input {...register("address")} className={inputClass} placeholder="Rua Prudente de Moraes, N10, Arujá-SP" />
            {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Complemento / Ponto de Referência
            </label>
            <input {...register("addressComplement")} className={inputClass} placeholder="(Loja de frente para a rua)" />
            <p className="text-[11px] text-gray-500 mt-1">Texto exibido em destaque logo abaixo do endereço.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Link de Rota do Google Maps (Como Chegar)
            </label>
            <input {...register("googleMapsUrl")} className={inputClass} placeholder="https://maps.google.com/?q=..." />
            <p className="text-[11px] text-gray-500 mt-1">Link aberto quando o cliente clica no botão "Como Chegar" e "Abrir no Google Maps".</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              URL do Iframe do Google Maps (Embed)
            </label>
            <input {...register("googleMapsEmbedUrl")} className={inputClass} placeholder="https://www.google.com/maps/embed?pb=..." />
            <p className="text-[11px] text-gray-500 mt-1">Cole a URL do mapa interativo do Google Maps (src do iframe).</p>
          </div>
        </div>

        {/* Bloco 3: Horários de Atendimento */}
        <div className="p-6 rounded-2xl bg-[#101010] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Clock className="w-4 h-4 text-[#C9A84C]" />
            <h3 className="font-serif text-base font-bold text-white">Horários de Atendimento (Várias Linhas)</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Horários de Funcionamento (uma opção por linha)
            </label>
            <textarea
              {...register("hoursText")}
              rows={4}
              className={`${inputClass} resize-y font-sans`}
              placeholder={`Segunda a Sexta: 09h às 20h\nSábado: 09h às 19h\nDomingo: 10h às 15h`}
            />
            {errors.hoursText && <p className="text-xs text-red-400 mt-1">{errors.hoursText.message}</p>}
            <p className="text-[11px] text-gray-400 mt-1.5">
              💡 <strong>Dica:</strong> Pule uma linha (Enter) para cada dia ou período. Exemplo:
              <br />
              <code className="text-[#E0C068]">Segunda a Sexta: 09h às 20h</code>
              <br />
              <code className="text-[#E0C068]">Sábado: 09h às 19h</code>
              <br />
              <code className="text-[#E0C068]">Domingo: 10h às 15h</code>
            </p>
          </div>
        </div>

        {/* Bloco 4: Contato & Agendamento */}
        <div className="p-6 rounded-2xl bg-[#101010] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Phone className="w-4 h-4 text-[#C9A84C]" />
            <h3 className="font-serif text-base font-bold text-white">Contato & Agendamento</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Telefone / WhatsApp Exibido no Card
            </label>
            <input {...register("phoneText")} className={inputClass} placeholder="(11) 93470-6817" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Link Direto do WhatsApp (wa.me/...)
            </label>
            <input {...register("whatsappUrl")} className={inputClass} placeholder="https://wa.me/5511934706817?text=..." />
            {errors.whatsappUrl && <p className="text-xs text-red-400 mt-1">{errors.whatsappUrl.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Link de Agendamento do Booksy
            </label>
            <input {...register("booksyUrl")} className={inputClass} placeholder="https://booksy.com/widget-2024/..." />
            {errors.booksyUrl && <p className="text-xs text-red-400 mt-1">{errors.booksyUrl.message}</p>}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C9A84C] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#E0C068] disabled:opacity-60 transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Salvar Todas as Alterações"}
          </button>

          {status === "success" && (
            <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso!
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorDetails ? `Erro: ${errorDetails}` : "Erro ao salvar."}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
