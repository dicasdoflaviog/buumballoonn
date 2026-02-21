"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalReservas: 0,
        receitaTotal: 0,
        clientesNovos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
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
                clientesNovos: 0,
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Operação Hoje</h1>
                <p className="text-slate-500 font-medium">Bem-vindo ao centro de comando Buum Balloon.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Meta do Mês</p>
                        <p className="text-5xl font-black text-primary transition-transform group-hover:scale-105 duration-500">
                            R$ {stats.receitaTotal.toLocaleString('pt-BR')}
                        </p>
                        <div className="mt-6 w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-primary"
                            />
                        </div>
                        <p className="mt-3 text-[11px] font-bold text-slate-400">65% da meta atingida</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group text-white"
                >
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Pedidos de Hoje</p>
                        <p className="text-5xl font-black transition-transform group-hover:scale-105 duration-500">
                            {stats.totalReservas}/12
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] font-bold text-slate-400">+8 aguardando</p>
                        </div>
                    </div>
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between"
                >
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Status Logístico</p>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                            <p className="text-2xl font-black text-slate-800 tracking-tight">Fluxo Normal</p>
                        </div>
                    </div>
                    <button className="w-full py-4 mt-8 bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                        Ver Log de Operações
                    </button>
                </motion.div>
            </div>

            {/* Sections Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Próximos Envios</h2>
                        <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline transition-all">Ver todos</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 5 }}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 text-sm group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                    #{1240 + i}
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900 leading-none mb-1">Arranjo Chrome Gold G</p>
                                    <p className="text-xs font-bold text-slate-400">São Bernardo do Campo, SP</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 mb-1">14:30</p>
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">Prepação</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Insights Rápidos</h2>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-slate-100 text-8xl mb-6 italic">insights</span>
                        <p className="text-slate-400 font-medium italic max-w-[240px]">Aguardando dados suficientes para gerar insights automáticos.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
