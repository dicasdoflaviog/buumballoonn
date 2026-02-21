"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        faturamento: 24500,
        custos: 9200,
        lucro: 15300,
        margem: 62.4,
        ticketMedio: 345,
        pedidosHoje: 8,
        metaPedidos: 12
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const { data: dashboardData } = await (supabase
                .from('dashboard_financeiro_cache' as any) as any)
                .select('*')
                .eq('mes', currentMonth)
                .single();

            const { count: reservCount } = await (supabase
                .from('reservas' as any) as any)
                .select('*', { count: 'exact', head: true })
                .eq('status', 'confirmado');

            if (dashboardData) {
                setStats(prev => ({
                    ...prev,
                    faturamento: dashboardData.faturamento || 24500,
                    custos: (dashboardData.custos_fixos || 0) + (dashboardData.custos_variaveis || 0) || 9200,
                    lucro: dashboardData.lucro_liquido || 15300,
                    margem: dashboardData.margem_operacional || 62.4,
                    pedidosHoje: reservCount || 8
                }));
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Faturamento</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                        R$ {stats.faturamento.toLocaleString('pt-BR')}
                    </p>
                    <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5 mt-1">
                        <span className="material-symbols-outlined text-xs font-black">trending_up</span> +12%
                    </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Custos Totais</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                        R$ {stats.custos.toLocaleString('pt-BR')}
                    </p>
                    <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5 mt-1">
                        <span className="material-symbols-outlined text-xs font-black">trending_up</span> +4%
                    </span>
                </div>

                <div className="col-span-2 bg-green-50 dark:bg-green-900/10 p-5 rounded-[1.5rem] border border-green-100 dark:border-green-900/30 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-green-800 dark:text-green-400 mb-1">Lucro Líquido</p>
                        <p className="text-3xl font-black text-green-700 dark:text-green-500">
                            R$ {stats.lucro.toLocaleString('pt-BR')}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined font-black">verified</span>
                    </div>
                </div>
            </div>

            {/* Operational Status */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status de Hoje</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Fluxo Normal</h3>
                        <p className="text-xs font-medium text-slate-500">{stats.pedidosHoje} pedidos em produção agora</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
                        <span className="text-[10px] font-black text-primary italic">KPI</span>
                    </div>
                </div>
                {/* Decorative background circle as in Stitch */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            </section>

            {/* Goals - Inspired by Stitch */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black mb-6 flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-widest">
                    <span className="material-symbols-outlined text-primary font-black">flag</span>
                    Metas do Mês
                </h3>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500">Faturamento</span>
                            <span className="text-xs font-black text-primary">81%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "81%" }}
                                className="bg-primary h-full"
                            />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">R$ {stats.faturamento.toLocaleString('pt-BR')}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase italic">Meta: R$ 30.000</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500">Pedidos Concluídos</span>
                            <span className="text-xs font-black text-green-500">75%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                className="bg-green-500 h-full"
                            />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{stats.pedidosHoje} REALIZADOS</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase italic">ALVO: 50</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Cards */}
            <div className="grid grid-cols-2 gap-4">
                <button className="bg-slate-900 text-white p-6 rounded-[2rem] text-left hover:scale-[1.02] transition-all">
                    <span className="material-symbols-outlined mb-2 text-primary">add_shopping_cart</span>
                    <p className="text-sm font-black leading-tight">Novo<br />Pedido</p>
                </button>
                <button className="bg-white border border-slate-100 p-6 rounded-[2rem] text-left hover:scale-[1.02] transition-all text-slate-900">
                    <span className="material-symbols-outlined mb-2 text-primary">inventory_2</span>
                    <p className="text-sm font-black leading-tight">Gestão<br />Estoque</p>
                </button>
            </div>
        </div>
    );
}
