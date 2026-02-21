import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Este cliente é para uso no Lado do Cliente (Browsers)
// Ele gerencia automaticamente o armazenamento da sessão em COOKIES
// para que o Middleware e o SSR consigam ler o usuário logado.
export const supabase = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
)
