"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Se estiver na página de login ou signup, permite
                if (pathname === "/admin" || pathname === "/admin/signup") {
                    setLoading(false);
                    return;
                }
                router.push("/admin");
                return;
            }

            // Check admin role
            const { data: isAdmin } = await supabase.rpc('is_admin');
            if (!isAdmin) {
                if (pathname !== "/admin" && pathname !== "/admin/signup") {
                    router.push("/admin");
                    return;
                }
            }

            setUser(session.user);
            setLoading(false);
        };

        checkUser();
    }, [router, pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full"
                />
            </div>
        );
    }

    // Não mostra o layout nas páginas de login/cadastro
    if (pathname === "/admin" || pathname === "/admin/signup") {
        return <>{children}</>;
    }

    const menuItems = [
        { name: "Início", path: "/admin/dashboard", icon: "dashboard" },
        { name: "Produtos", path: "/admin/produtos", icon: "inventory_2" },
        { name: "Pedidos", path: "/admin/pedidos", icon: "shopping_cart" },
        { name: "Ajustes", path: "/admin/configuracoes", icon: "settings" },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col p-6 sticky top-0 h-screen">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-xl">rocket_launch</span>
                    </div>
                    <div>
                        <h2 className="font-black text-slate-900 leading-tight">Buum Admin</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painel de Gestão</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${pathname === item.path
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Sair do Painel
                    </button>
                </div>
            </aside>

            {/* Bottom Nav Mobile */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl flex justify-around p-3 z-50">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${pathname === item.path ? "text-primary scale-110" : "text-slate-400"
                            }`}
                    >
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Conteúdo Principal */}
            <main className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
