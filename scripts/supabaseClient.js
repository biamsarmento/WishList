import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Chave publishable do Supabase: é pública por design (protegida pelo
// RLS do banco), então pode ficar no código do front-end sem problema.
const SUPABASE_URL = "https://yrffgcpirtyergswlunn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_FpslZy_lV5jdM8_nZAg3Ww_Em3EceNp";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
