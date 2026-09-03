import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as generatedClient } from "@/integrations/supabase/client";

const env = import.meta.env as Record<string, string | undefined>;

const supabaseUrl = env["VITE_SUPABASE_URL"] || "";
const supabaseKey =
  env["VITE_SUPABASE_PUBLISHABLE_KEY"] || env["VITE_SUPABASE_ANON_KEY"] || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && supabaseUrl.startsWith("http") && supabaseKey.length > 10,
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? (generatedClient as unknown as SupabaseClient)
  : null;
