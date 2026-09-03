import { supabase as generatedClient } from "@/integrations/supabase/client";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && supabaseUrl.startsWith("http") && supabaseKey.length > 10,
);

export const supabase = isSupabaseConfigured ? generatedClient : null;
