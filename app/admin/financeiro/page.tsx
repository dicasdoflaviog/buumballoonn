"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function FinanceiroPage() {
    const [loading, setLoading] = useState(true);
    const [isCustoModalOpen, setIsCustoModalOpen] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) return null;

    return (
        <div className="space-y-6">
            {/* Period Filter Card */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <select className="w-full h-12 px-4 bg-transparent rounded-xl text-sm font-black uppercase tracking-widest text-slate-700 dark:text-white outline-none appearance-none cursor-pointer">
                    <option>Este Mês (Fevereiro)</option>
                    <option>Janeiro 2026</option>
                    <option>Dezembro 2025</option>
                    <option>Total 2025</option>
                </select>
            </div>

            {/* Faturamento x Custos Card */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black mb-8 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-primary font-black">bar_chart</span>
                    Receita x Custos
                </h3>

                <div className="flex items-end justify-between h-40 gap-6 px-4">
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <motion.div initial={{ height: 0 }} animate={{ height: "100%" }} className="w-full bg-primary rounded-t-xl" />
                        <span className="text-[9px] font-black uppercase text-slate-400">Receita</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <motion.div initial={{ height: 0 }} animate={{ height: "38%" }} className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-xl" />
                        <span className="text-[9px] font-black uppercase text-slate-400">Custos</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <motion.div initial={{ height: 0 }} animate={{ height: "62%" }} className="w-full bg-green-400 rounded-t-xl" />
                        <span className="text-[9px] font-black uppercase text-slate-400">Lucro</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Saldo Atual</span>
                    <span className="font-black text-slate-900 dark:text-white text-lg">R$ 42.150,00</span>
                </div>
            </section>

            {/* Receivables/Donut Chart Placeholder */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black mb-6 text-slate-400 uppercase tracking-widest">Recebíveis</h3>
                <div className="flex items-center gap-8">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-slate-100 dark:text-slate-800" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8"></circle>
                            <circle className="text-green-500" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeDasharray="301" strokeDashoffset="45" strokeWidth="8" strokeLinecap="round"></circle>
                        </svg>
                        <div className="absolute text-center">
                            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">85%</p>
                            <p className="text-[8px] uppercase font-bold text-slate-400 mt-1">OK</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">RECEBIDO</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">R$ 20.825</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">A RECEBER</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">R$ 3.675</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 text-red-400">ATRASO</span>
                            <span className="text-xs font-black text-red-500">R$ 840</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Costs List */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Custos por Tipo</h3>
                    <button className="flex items-center gap-2 text-[10px] font-black text-primary border-2 border-primary/20 bg-primary/5 px-4 py-2 rounded-xl hover:bg-primary/10 transition-all">
                        <span className="material-symbols-outlined text-sm font-black">add</span>
                        LANÇAR CUSTO
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400">
                                <span className="material-symbols-outlined text-lg">inventory_2</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Variáveis</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Materiais</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">R$ 6.100</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400">
                                <span className="material-symbols-outlined text-lg">home_work</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Fixos</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Estrutura</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">R$ 3.100</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
