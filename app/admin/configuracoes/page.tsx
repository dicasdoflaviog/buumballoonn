"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Config {
    chave: string;
    valor: any;
}

export default function ConfigSettings() {
    const [configs, setConfigs] = useState<Config[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    async function fetchConfigs() {
        const { data, error } = await (supabase.from('configuracoes_gerais' as any) as any).select('*');
        if (!error && data) setConfigs(data);
        setLoading(false);
    }

    async function handleSave(chave: string, valor: any) {
        setSaving(chave);
        const { error } = await (supabase
            .from('configuracoes_gerais' as any) as any)
            .update({ valor, updated_at: new Date().toISOString() })
            .eq('chave', chave);

        if (!error) {
            // Sucesso
        }
        setSaving(null);
    }

    const updateValue = (chave: string, newValue: any) => {
        setConfigs(prev => prev.map(c => c.chave === chave ? { ...c, valor: newValue } : c));
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Sistema</h2>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Ajustes Globais</h1>
            </header>

            <div className="space-y-4">
                {configs.map((config) => (
                    <motion.div
                        key={config.chave}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm group"
                    >
                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    {config.chave.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Parâmetro de controle da operação</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={typeof config.valor === 'string' ? config.valor : JSON.stringify(config.valor)}
                                    onChange={(e) => updateValue(config.chave, e.target.value)}
                                    className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                                />
                                <button
                                    onClick={() => handleSave(config.chave, config.valor)}
                                    disabled={saving === config.chave}
                                    className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {saving === config.chave ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className="material-symbols-outlined font-black">save</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Info Card - Consistent with Stitch tips */}
            <div className="mt-8 p-6 rounded-3xl bg-primary/5 dark:bg-primary/10 border border-primary/10 flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined font-black">lock</span>
                </div>
                <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Zona Crítica</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        As variáveis acima controlam lógicas de negócio em tempo real. Certifique-se dos valores antes de salvar para evitar erros no fluxo do cliente.
                    </p>
                </div>
            </div>

            <footer className="pt-10 pb-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Buum Balloon Admin v2.0</p>
                <p className="text-[10px] font-bold text-slate-300 italic">Developed per Stitch structure.</p>
            </footer>
        </div>
    );
}
