"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    imagem_url: string;
    ativo: boolean;
}

export default function GestaoProdutos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        preco: 0,
        categoria: "Arranjo",
        imagem_url: "",
        ativo: true
    });

    useEffect(() => {
        fetchProdutos();
    }, []);

    async function fetchProdutos() {
        setLoading(true);
        const { data, error } = await (supabase
            .from('produtos' as any) as any)
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setProdutos(data);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        if (editingProduto) {
            const { error } = await (supabase
                .from('produtos' as any) as any)
                .update(formData)
                .eq('id', editingProduto.id);
            if (!error) setIsModalOpen(false);
        } else {
            const { error } = await (supabase
                .from('produtos' as any) as any)
                .insert([formData]);
            if (!error) setIsModalOpen(false);
        }

        setEditingProduto(null);
        setFormData({ nome: "", descricao: "", preco: 0, categoria: "Arranjo", imagem_url: "", ativo: true });
        fetchProdutos();
    }

    const openEdit = (p: Produto) => {
        setEditingProduto(p);
        setFormData(p);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Catálogo</h2>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Seus Produtos</h1>
                </div>
                <button
                    onClick={() => {
                        setEditingProduto(null);
                        setFormData({ nome: "", descricao: "", preco: 0, categoria: "Arranjo", imagem_url: "", ativo: true });
                        setIsModalOpen(true);
                    }}
                    className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined font-black">add</span>
                </button>
            </header>

            {loading && produtos.length === 0 ? (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {produtos.map((p) => (
                        <motion.div
                            layoutId={p.id}
                            key={p.id}
                            className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group flex items-center p-4 gap-4 ${!p.ativo && 'opacity-60'}`}
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                                {p.imagem_url ? (
                                    <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <span className="material-symbols-outlined text-3xl italic">image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-black text-slate-900 dark:text-white truncate pr-2">{p.nome}</h3>
                                    <p className="font-black text-primary text-sm whitespace-nowrap">R$ {p.preco}</p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">{p.categoria}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Editar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await (supabase.from('produtos' as any) as any).update({ ativo: !p.ativo }).eq('id', p.id);
                                            fetchProdutos();
                                        }}
                                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${p.ativo ? 'text-slate-500 hover:text-amber-500' : 'text-green-500'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">{p.ativo ? 'visibility_off' : 'visibility'}</span>
                                        {p.ativo ? 'Pausar' : 'Ativar'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-end justify-center"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[2.5rem] shadow-2xl overflow-hidden pb-safe"
                        >
                            <div className="p-8">
                                <header className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Setup do Item</p>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                            {editingProduto ? 'Editar Produto' : 'Novo Produto'}
                                        </h2>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Título do Produto</label>
                                            <input
                                                type="text" required
                                                value={formData.nome}
                                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                                                placeholder="Ex: Combo Chrome Gold"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Preço (R$)</label>
                                                <input
                                                    type="number" required step="0.01"
                                                    value={formData.preco}
                                                    onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                                                <select
                                                    value={formData.categoria}
                                                    onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white appearance-none"
                                                >
                                                    <option>Arranjo</option>
                                                    <option>Bouquet</option>
                                                    <option>Personalizado</option>
                                                    <option>Acessório</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Link da Imagem</label>
                                            <input
                                                type="text"
                                                value={formData.imagem_url}
                                                onChange={e => setFormData({ ...formData, imagem_url: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white px-5"
                                                placeholder="https://..."
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição Breve</label>
                                            <textarea
                                                rows={2}
                                                value={formData.descricao}
                                                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white px-5 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <span className="material-symbols-outlined font-black">check_circle</span>
                                        {loading ? 'Salvando...' : (editingProduto ? 'Atualizar Produto' : 'Cadastrar Produto')}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
