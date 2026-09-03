import React, { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { saveSiteConfig } from "../../../lib/firestore";
import { useSiteData } from "../../../context/SiteDataContext";
import { isFirebaseConfigured } from "../../../lib/firebase";

export function StyleEditor() {
  const { siteConfig } = useSiteData();
  const [accentColor, setAccentColor] = useState(siteConfig.accentColor || "#C9A84C");
  const [backgroundColor, setBackgroundColor] = useState(siteConfig.backgroundColor || "#0a0a0a");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Apply preview in real-time as user picks colors
  useEffect(() => {
    document.documentElement.style.setProperty("--gold", accentColor);
  }, [accentColor]);

  useEffect(() => {
    document.documentElement.style.setProperty("--site-bg", backgroundColor);
  }, [backgroundColor]);

  const handleReset = () => {
    setAccentColor("#C9A84C");
    setBackgroundColor("#0a0a0a");
  };

  const handleSave = async () => {
    if (!isFirebaseConfigured) {
      setStatus("error");
      return;
    }
    setSaving(true);
    try {
      await saveSiteConfig({ accentColor, backgroundColor });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const ColorSwatch = ({ color }: { color: string }) => (
    <div
      className="w-8 h-8 rounded-full border-2 border-white/20 shadow-md shrink-0"
      style={{ backgroundColor: color }}
    />
  );

  return (
    <div className="space-y-6 max-w-xl">
      {!isFirebaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Firebase não configurado — alterações de cores são apenas para preview.</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Accent Color */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
          <div>
            <h3 className="font-serif font-bold text-white mb-1">Cor de Destaque</h3>
            <p className="text-xs text-gray-400">Usada em botões, bordas, títulos e elementos dourados.</p>
          </div>
          <div className="flex items-center gap-4">
            <ColorSwatch color={accentColor} />
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-16 h-12 rounded-xl border-0 bg-transparent cursor-pointer"
              title="Selecionar cor de destaque"
            />
            <div className="flex-1">
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                maxLength={7}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#C9A84C]/50"
                placeholder="#C9A84C"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["#C9A84C", "#D4AF37", "#B8860B", "#DAA520", "#FFD700", "#CD853F"].map((c) => (
              <button
                key={c}
                onClick={() => setAccentColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  accentColor === c ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
          <div>
            <h3 className="font-serif font-bold text-white mb-1">Cor de Fundo</h3>
            <p className="text-xs text-gray-400">Cor principal de fundo da página. Recomendado: tons escuros.</p>
          </div>
          <div className="flex items-center gap-4">
            <ColorSwatch color={backgroundColor} />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-16 h-12 rounded-xl border-0 bg-transparent cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                maxLength={7}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#C9A84C]/50"
                placeholder="#0a0a0a"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["#0a0a0a", "#0d0d0d", "#111111", "#1a1a1a", "#141414", "#0f172a"].map((c) => (
              <button
                key={c}
                onClick={() => setBackgroundColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  backgroundColor === c ? "border-white scale-110" : "border-[#C9A84C]/30"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Preview Strip */}
        <div
          className="p-5 rounded-2xl border-2 overflow-hidden"
          style={{ backgroundColor, borderColor: accentColor }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
            Preview em Tempo Real
          </p>
          <h3 className="font-serif text-xl font-bold text-white mb-2">ELLITE BARBERSS</h3>
          <p className="text-sm text-gray-300 mb-4">Tradição e estilo no mesmo lugar</p>
          <button
            className="px-5 py-2.5 rounded-full font-bold text-sm text-black"
            style={{ backgroundColor: accentColor }}
          >
            Agendar Agora
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A84C] text-black font-bold text-sm hover:bg-[#E0C068] disabled:opacity-60 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Salvando..." : "Salvar Cores"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Restaurar Padrão
        </button>

        {status === "success" && (
          <span className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Salvo!
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" /> Erro ao salvar.
          </span>
        )}
      </div>
    </div>
  );
}
