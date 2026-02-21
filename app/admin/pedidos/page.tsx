"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface Order {
    id: string;
    id_formatado: string;
    cliente_nome: string;
    status: string;
    data_evento: string;
    valor_total: number;
    kit_nome: string;
}

export default function PedidosPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Todos");

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        // Mocking for now as we don't have the table populated or fully defined with these fields
        // In reality, this would query public.reservas
        const { data, error } = await (supabase.from('reservas' as any) as any)
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Transform data if necessary
            // setOrders(data);
        }

        // Placeholder data to match Stitch Design
        setOrders([
            { id: "1", id_formatado: "BB-1024", cliente_nome: "João Paulo Silva", status: "Em Produção", data_evento: "15 Mai 2026", valor_total: 450, kit_nome: "Kit Impacto" },
            { id: "2", id_formatado: "BB-1025", cliente_nome: "Mariana Souza", status: "Pendente", data_evento: "18 Mai 2026", valor_total: 280, kit_nome: "Kit Celebra" },
            { id: "3", id_formatado: "BB-1023", cliente_nome: "Roberto Carlos", status: "Finalizado", data_evento: "12 Mai 2026", valor_total: 150, kit_nome: "Kit Essencial" },
            { id: "4", id_formatado: "BB-1026", cliente_nome: "Patrícia Lima", status: "Em Produção", data_evento: "20 Mai 2026", valor_total: 520, kit_nome: "Kit Impacto" },
        ]);

        setLoading(false);
    }

    const filters = ["Todos", "Pendente", "Em Produção", "Finalizado", "Cancelado"];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Em Produção": return "bg-primary/10 text-primary border-primary/20";
            case "Pendente": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Finalizado": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Cancelado": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Box */}
            <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm font-bold text-slate-900 dark:text-white"
                    placeholder="Buscar ID ou Cliente..."
                    type="text"
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-none px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === f
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : (
                    orders
                        .filter(o => filter === "Todos" || o.status === filter)
                        .map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{order.id_formatado}</span>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{order.cliente_nome}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="material-symbols-outlined text-base">calendar_today</span>
                                        <span className="text-xs font-bold">{order.data_evento}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="material-symbols-outlined text-base">inventory_2</span>
                                        <span className="text-xs font-bold">{order.kit_nome}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                    <div className="text-xl font-black text-primary">R$ {order.valor_total.toLocaleString('pt-BR')}</div>
                                    <button className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                                        Detalhes
                                        <span className="material-symbols-outlined text-base">chevron_right</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))
                )}
            </div>

            {/* Footer Copying Stitch */}
            <footer className="pt-10 pb-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">CNPJ 44.081.435/0001-83</p>
                <p className="text-[10px] font-bold text-slate-300 italic">© 2026 Buum Balloon. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
