// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// 🔑 Pegue essas chaves no site do Supabase (Configurações -> API)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🔗 Cria o cliente Supabase para uso em todo o app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
