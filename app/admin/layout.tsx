"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
                if (pathname === "/admin" || pathname === "/admin/signup") {
                    setLoading(false);
                    return;
                }
                router.push("/admin");
                return;
            }

            const { data: isAdmin } = await (supabase.rpc('is_admin') as any);
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
            <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full"
                />
            </div>
        );
    }

    if (pathname === "/admin" || pathname === "/admin/signup") {
        return <>{children}</>;
    }

    const menuItems = [
        { name: "Início", path: "/admin/dashboard", icon: "dashboard" },
        { name: "Financeiro", path: "/admin/financeiro", icon: "query_stats" },
        { name: "Pedidos", path: "/admin/pedidos", icon: "shopping_bag" },
        { name: "Produtos", path: "/admin/produtos", icon: "inventory_2" },
        { name: "Ajustes", path: "/admin/configuracoes", icon: "settings" },
    ];

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922] font-sans antialiased flex flex-col items-center">
            {/* Wrapper for Mobile-First experience as per Stitch */}
            <div className="w-full max-w-lg bg-[#f6f7f8] dark:bg-[#101922] min-h-screen flex flex-col relative shadow-2xl shadow-slate-200/50">

                {/* Header dynamic title based on path */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-xl">
                                    {menuItems.find(i => pathname.includes(i.path))?.icon || "admin_panel_settings"}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {menuItems.find(i => pathname.includes(i.path))?.name || "Admin"}
                                </h1>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Buum Balloon</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 px-4 py-6 pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Bottom Navigation inspired by Stitch - Sticky at bottom of the max-width container */}
                <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/95 dark:bg-[#101922]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-4 z-[100] pb-safe">
                    <div className="flex justify-between items-center relative">
                        {menuItems.slice(0, 2).map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex flex-col items-center gap-1 transition-all ${pathname === item.path ? "text-primary scale-110" : "text-slate-400"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${pathname === item.path ? "font-fill" : ""}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
                            </Link>
                        ))}

                        {/* Center FAB for fast actions */}
                        <div className="relative -top-8">
                            <Link
                                href="/admin/produtos"
                                className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-[#101922]"
                            >
                                <span className="material-symbols-outlined text-3xl font-black">add</span>
                            </Link>
                        </div>

                        {menuItems.slice(2, 4).map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex flex-col items-center gap-1 transition-all ${pathname === item.path ? "text-primary scale-110" : "text-slate-400"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${pathname === item.path ? "font-fill" : ""}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>

            <style jsx global>{`
                .font-fill { font-variation-settings: 'FILL' 1; }
                .pb-safe { padding-bottom: max(env(safe-area-inset-bottom), 1rem); }
                body { background-color: #f6f7f8; }
                @media (prefers-color-scheme: dark) {
                    body { background-color: #101922; }
                }
            `}</style>
        </div>
    );
}
