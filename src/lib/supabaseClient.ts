import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Faltan credenciales de Supabase. El sistema funcionará en modo simulación.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
