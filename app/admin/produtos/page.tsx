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

    // Form states
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
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestão de Produtos</h1>
                    <p className="text-slate-500 font-medium">Catálogo completo de balões e kits ({produtos.length})</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduto(null);
                        setFormData({ nome: "", descricao: "", preco: 0, categoria: "Arranjo", imagem_url: "", ativo: true });
                        setIsModalOpen(true);
                    }}
                    className="bg-primary text-white font-black px-8 py-5 rounded-[1.5rem] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
                >
                    Novo Produto
                    <span className="material-symbols-outlined font-black">add_circle</span>
                </button>
            </header>

            {/* List Table/Cards */}
            {loading && produtos.length === 0 ? (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produtos.map((p) => (
                        <motion.div
                            layoutId={p.id}
                            key={p.id}
                            className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all ${!p.ativo && 'opacity-60'}`}
                        >
                            <div className="aspect-video bg-slate-50 relative overflow-hidden">
                                {p.imagem_url ? (
                                    <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <span className="material-symbols-outlined text-6xl italic">image</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm border border-slate-100">
                                        {p.categoria}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-slate-900 leading-tight line-clamp-1">{p.nome}</h3>
                                    <p className="font-black text-primary text-lg">R$ {p.preco}</p>
                                </div>
                                <p className="text-xs font-medium text-slate-400 line-clamp-2 mb-6 h-8">{p.descricao || 'Sem descrição cadastrada.'}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="flex-1 bg-slate-50 text-slate-600 font-bold py-3.5 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Editar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await (supabase.from('produtos' as any) as any).update({ ativo: !p.ativo }).eq('id', p.id);
                                            fetchProdutos();
                                        }}
                                        className={`w-14 rounded-2xl flex items-center justify-center transition-all ${p.ativo ? 'text-slate-400 bg-slate-50 hover:bg-slate-100' : 'text-green-500 bg-green-50'}`}
                                    >
                                        <span className="material-symbols-outlined">{p.ativo ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal - Simplified */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10">
                                <header className="flex justify-between items-start mb-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900">
                                            {editingProduto ? 'Editar Produto' : 'Novo Produto'}
                                        </h2>
                                        <p className="text-sm font-medium text-slate-400">Preencha os dados técnicos</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome do Item</label>
                                            <input
                                                type="text" required
                                                value={formData.nome}
                                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                                className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary transition-all font-bold bg-slate-50/50"
                                                placeholder="Ex: Chrome Gold Balloon Set"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Preço (R$)</label>
                                            <input
                                                type="number" required step="0.01"
                                                value={formData.preco}
                                                onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                                                className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary transition-all font-bold bg-slate-50/50"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                                            <select
                                                value={formData.categoria}
                                                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                                className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary transition-all font-bold bg-slate-50/50 appearance-none"
                                            >
                                                <option>Arranjo</option>
                                                <option>Bouquet</option>
                                                <option>Personalizado</option>
                                                <option>Acessório</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL da Imagem</label>
                                        <input
                                            type="text"
                                            value={formData.imagem_url}
                                            onChange={e => setFormData({ ...formData, imagem_url: e.target.value })}
                                            className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary transition-all font-bold bg-slate-50/50"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição</label>
                                        <textarea
                                            rows={2}
                                            value={formData.descricao}
                                            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                            className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary transition-all font-bold bg-slate-50/50 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl transition-all hover:bg-slate-800 flex items-center justify-center gap-3"
                                    >
                                        {loading ? 'Salvando...' : (editingProduto ? 'Atualizar Produto' : 'Cadastrar Produto')}
                                        <span className="material-symbols-outlined font-black">save</span>
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
