import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Context Type ─────────────────────────────────────────────────────────────

interface AuthContextType {
  /** True only when there is a valid session AND the user has the admin role. */
  isAuthenticated: boolean;
  loading: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const evaluateSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setIsAuthenticated(false);
        setEmail(null);
        return;
      }
      // Authorization is verified server-side by the database (has_role +
      // row-level security), never by a client-side flag.
      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      setIsAuthenticated(!roleError && isAdmin === true);
      setEmail(data.user.email ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void evaluateSession();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setLoading(true);
        void evaluateSession();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [evaluateSession]);

  const login = useCallback(
    async (emailInput: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password,
      });
      if (error || !data.user) {
        return { ok: false, error: "E-mail ou senha incorretos." };
      }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      if (isAdmin !== true) {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        return { ok: false, error: "Esta conta não tem permissão de administrador." };
      }
      setIsAuthenticated(true);
      setEmail(data.user.email ?? null);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
