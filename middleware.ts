import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const url = request.nextUrl.clone()
    const { pathname } = url

    // 1. Mapeamento de domínios (Rewrites e "Clean URLs")

    // quiz.buumballoon.com.br -> /quiz
    if (hostname === 'quiz.buumballoon.com.br') {
        // Se a URL contém o prefixo /quiz, redireciona para a versão limpa
        if (pathname.startsWith('/quiz')) {
            const newPath = pathname.replace(/^\/quiz/, '') || '/'
            return NextResponse.redirect(new URL(newPath, request.url))
        }
        // Internamente serve o conteúdo da pasta /quiz
        url.pathname = `/quiz${pathname}`
        return NextResponse.rewrite(url)
    }

    // appadmin.buumballoon.com.br -> /admin
    if (hostname === 'appadmin.buumballoon.com.br') {
        // Se a URL contém o prefixo /admin, redireciona para a versão limpa
        if (pathname.startsWith('/admin')) {
            const newPath = pathname.replace(/^\/admin/, '') || '/'
            return NextResponse.redirect(new URL(newPath, request.url))
        }
        // Mapeia internamente para /admin
        url.pathname = `/admin${pathname}`
    }

    // 2. Inicialização do Supabase e Gerenciamento de Cookies
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 3. Lógica de Autenticação e Redirecionamento
    // Usamos a URL mapeada internamente para as checagens
    const currentInternalPath = url.pathname

    // Proteção de rotas do dashboard
    if (currentInternalPath.startsWith('/admin/dashboard')) {
        if (!user) {
            // No subdomínio admin, a raiz "/" é a página de login (/admin)
            const loginPath = hostname === 'appadmin.buumballoon.com.br' ? '/' : '/admin'
            return NextResponse.redirect(new URL(loginPath, request.url))
        }
    }

    // Redirecionamento se já estiver logado (evita página de login)
    // No subdomínio admin, pathname "/" mapeia para internal "/admin"
    const isLoginPage = currentInternalPath === '/admin'
    if (isLoginPage && user) {
        const dashboardPath = hostname === 'appadmin.buumballoon.com.br' ? '/dashboard' : '/admin/dashboard'
        return NextResponse.redirect(new URL(dashboardPath, request.url))
    }

    // Se houve mapeamento interno para admin, aplica o rewrite final
    if (hostname === 'appadmin.buumballoon.com.br' && !pathname.startsWith('/admin')) {
        return NextResponse.rewrite(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Corresponde a todos os caminhos, exceto:
         * - api (rotas de API)
         * - _next/static (arquivos estáticos)
         * - _next/image (arquivos de otimização de imagem)
         * - favicon.ico (ícone do site)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}


