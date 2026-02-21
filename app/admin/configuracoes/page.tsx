"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface Config {
    chave: string;
    valor: any;
}

export default function ConfigSettings() {
    const [configs, setConfigs] = useState<Config[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    async function fetchConfigs() {
        const { data, error } = await supabase.from('configuracoes_gerais').select('*');
        if (!error && data) setConfigs(data);
        setLoading(false);
    }

    async function handleSave(chave: string, valor: any) {
        setSaving(true);
        const { error } = await supabase
            .from('configuracoes_gerais')
            .update({ valor, updated_at: new Date().toISOString() })
            .eq('chave', chave);

        if (!error) {
            // Feedback visual ou log
        }
        setSaving(false);
    }

    const updateValue = (chave: string, newValue: any) => {
        setConfigs(prev => prev.map(c => c.chave === chave ? { ...c, valor: newValue } : c));
    };

    if (loading) return null;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ajustes do Sistema</h1>
                <p className="text-slate-500 font-medium">Controle variáveis globais da operação Buum Balloon.</p>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="space-y-10">
                    {configs.map((config) => (
                        <div key={config.chave} className="flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex-1">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">
                                    {config.chave.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-sm text-slate-400 font-medium">Define o parâmetro global para {config.chave.split('_').slice(-1)}.</p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <input
                                    type="text"
                                    value={typeof config.valor === 'string' ? config.valor : JSON.stringify(config.valor)}
                                    onChange={(e) => updateValue(config.chave, e.target.value)}
                                    className="px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary transition-all font-bold text-slate-800 flex-1 md:w-64"
                                />
                                <button
                                    onClick={() => handleSave(config.chave, config.valor)}
                                    disabled={saving}
                                    className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined font-black">save</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <section className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">info</span>
                    <div>
                        <h4 className="font-black text-slate-900 mb-1">Dica de Segurança</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            Alterações feitas aqui impactam o cálculo de datas no Quiz e as informações de contato do site em tempo real. Tenha certeza dos valores antes de salvar.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
