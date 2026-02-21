"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [pathPrefix, setPathPrefix] = useState("/admin");

    useEffect(() => {
        const isSubdomain = window.location.hostname === 'appadmin.buumballoon.com.br';
        setPathPrefix(isSubdomain ? "" : "/admin");

        // Se já houver uma sessão, tenta ir para o dashboard (backup do middleware)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push(isSubdomain ? "/dashboard" : "/admin/dashboard");
            }
        });
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const { error, data } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else if (data.session) {
                // Pequeno delay para garantir que o cookie seja processado pelo browser
                // antes da navegação que acionará o middleware
                setTimeout(() => {
                    const dashboardPath = pathPrefix === "" ? "/dashboard" : "/admin/dashboard";
                    router.push(dashboardPath);
                    // Não dar setLoading(false) aqui para manter o estado visual até trocar de página
                }, 500);
            } else {
                setLoading(false);
            }
        } catch (err: any) {
            setError("Ocorreu um erro inesperado.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl"
            >
                <div className="text-center mb-8">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVZ0QBEr29qXakr6OW-pFa53QnQkHCUjAT5R1IeMJjrRm5VYmvjuwk4kTqJTcIXHMvO6igWQ_Yzn1MAbOt6NPDKK75OSXz8VElJp8MnnZy0m6BBIN8jdm71B2MZzO72VSsQTw7KEgRZFUZ6uSDlblzQyS9Bx3J-0V0GO0Sa0MdKzO8yIToeDzaUUZgP2SSmqqxrQDG3CWtiVMyzpmLUQXSlbuvF3fXcMba43_qjEBqYIVWsRnK4EX6MfdJXniA5qpG_iajSroPpg"
                        className="h-12 mx-auto mb-4"
                        alt="Logo"
                    />
                    <h1 className="text-2xl font-black text-slate-900">Admin Buum Balloon</h1>
                    <p className="text-sm text-slate-500 font-medium">Faça login para gerenciar suas reservas</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-primary transition-all font-bold text-slate-800 bg-slate-50/50"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-primary transition-all font-bold text-slate-800 bg-slate-50/50"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 flex items-center justify-center gap-2 active:scale-95"
                    >
                        {loading ? "Entrando..." : "Acessar Painel"}
                        <span className="material-symbols-outlined font-black">login</span>
                    </button>

                    <p className="text-center text-xs text-slate-500 font-medium pt-2">
                        Novo por aqui?{" "}
                        <Link href={`${pathPrefix}/signup`} className="text-primary font-black hover:underline">
                            Crie sua conta Admin
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
