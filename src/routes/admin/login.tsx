import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { AuthProvider } from "../../context/AuthContext";
import { Scissors, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  return (
    <AuthProvider>
      <AdminLogin />
    </AuthProvider>
  );
}

function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // brief UX delay
    const success = login(username.trim(), password);
    if (success) {
      navigate({ to: "/admin/dashboard" });
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C9A84C]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-sm z-10">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-[#C9A84C] flex items-center justify-center bg-black shadow-[0_0_40px_rgba(201,168,76,0.3)] mb-4">
            <Scissors className="w-9 h-9 text-[#C9A84C]" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-widest text-white uppercase">
            Ellite Barberss
          </h1>
          <p className="text-sm text-[#C9A84C]/80 tracking-wider mt-1">Painel Administrativo</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d0d0d] border border-[#C9A84C]/25 rounded-2xl p-7 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h2 className="font-serif text-xl font-bold text-white mb-6 text-center">
            Acesso Restrito
          </h2>

          {error && (
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Usuário ou senha incorretos. Tente novamente.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                autoComplete="username"
                placeholder="ellite"
                className={`w-full px-4 py-3.5 rounded-xl bg-[#141414] border text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 transition-all ${
                  error ? "border-red-500/60" : "border-white/10 focus:border-[#C9A84C]/50"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 pr-12 rounded-xl bg-[#141414] border text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 transition-all ${
                    error ? "border-red-500/60" : "border-white/10 focus:border-[#C9A84C]/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full flex items-center justify-center gap-2 py-4 mt-2 rounded-xl bg-gradient-to-r from-[#C9A84C] via-[#E0C068] to-[#C9A84C] text-black font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(201,168,76,0.3)] hover:shadow-[0_0_35px_rgba(201,168,76,0.5)] disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          <a href="/" className="hover:text-[#C9A84C] transition-colors">
            ← Voltar para o site
          </a>
        </p>
      </div>
    </div>
  );
}
