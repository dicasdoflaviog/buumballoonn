"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalReservas: 0,
        receitaTotal: 0,
        clientesNovos: 0,
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin");
                return;
            }

            // Check if user is admin via is_admin function (optional client-side check)
            const { data: isAdmin, error } = await supabase.rpc('is_admin');

            if (!isAdmin || error) {
                router.push("/admin");
                return;
            }

            // Fetch stats from the new financial cache
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
            const { data: dashboardData } = await supabase
                .from('dashboard_financeiro_cache')
                .select('*')
                .eq('mes', currentMonth)
                .single();

            const { count: reservCount } = await supabase
                .from('reservas')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'confirmado');

            setStats({
                totalReservas: reservCount || 0,
                receitaTotal: dashboardData?.faturamento || 0,
                clientesNovos: 0, // Pode ser implementado depois
            });

            setLoading(false);
        };

        checkUser();
    }, [router]);

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

    return (
        <div className="min-h-screen bg-background-light p-6 font-display">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
                    <p className="text-sm font-medium text-slate-500">Gestão Buum Balloon</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                    Sair
                    <span className="material-symbols-outlined text-sm">logout</span>
                </button>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Reservas</p>
                    <p className="text-4xl font-black text-slate-800">{stats.totalReservas}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Receita Total</p>
                    <p className="text-4xl font-black text-primary">R$ {stats.receitaTotal}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status do Sistema</p>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-xl font-bold text-slate-700">Online</p>
                    </div>
                </div>
            </main>

            <section className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-slate-800">Reservas Recentes</h2>
                    <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Ver todas</button>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-slate-200 text-6xl mb-4 italic">inbox</span>
                        <p className="text-slate-400 font-medium italic">Nenhuma reserva confirmada recentemente.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
