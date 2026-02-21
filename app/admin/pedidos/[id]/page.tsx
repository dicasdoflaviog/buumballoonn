"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface OrderDetail {
    id: string;
    id_formatado: string;
    cliente_nome: string;
    email?: string;
    telefone?: string;
    status: string;
    data_evento: string;
    horario_evento?: string;
    local_evento?: string;
    valor_total: number;
    kit_nome: string;
    itens_extra?: { nome: string, preco: number }[];
}

export default function PedidoDetalhes() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch order by ID
        // setOrder(mockData);
        setTimeout(() => {
            setOrder({
                id: params.id as string,
                id_formatado: "BB-1024",
                cliente_nome: "João Paulo Silva",
                status: "Em Produção",
                data_evento: "15 de Maio, 2026",
                horario_evento: "14:00 - 15:30",
                local_evento: "Rua das Flores, 123, Jardim",
                valor_total: 530,
                kit_nome: "Kit Impacto",
                itens_extra: [
                    { nome: "Fio de LED Branco Quente", preco: 40 },
                    { nome: "Hélio Extra (5 balões)", preco: 40 }
                ]
            });
            setLoading(false);
        }, 500);
    }, [params.id]);

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (!order) return <div>Pedido não encontrado.</div>;

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4">
                <button onClick={() => router.back()} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Detalhes do</h2>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">Pedido #{order.id_formatado}</h1>
                </div>
            </header>

            {/* Status Card */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Atual</p>
                        <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                            {order.status}
                        </span>
                    </div>
                    <button className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cliente</p>
                            <p className="text-base font-black text-slate-900 dark:text-white">{order.cliente_nome}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined">calendar_today</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Data do Evento</p>
                            <p className="text-base font-black text-slate-900 dark:text-white">{order.data_evento}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Itens Card */}
            <section className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary font-black">inventory_2</span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Itens Reservados</h3>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    <div className="p-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-xl">celebration</span>
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{order.kit_nome}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kit Principal</p>
                            </div>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">R$ 450</span>
                    </div>
                    {order.itens_extra?.map((item, idx) => (
                        <div key={idx} className="p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">add_circle</span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-tighter">{item.nome}</p>
                            </div>
                            <span className="font-bold text-slate-500 italic">R$ {item.preco}</span>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-slate-50 dark:bg-[#151f2b] flex justify-between items-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Geral</span>
                    <span className="text-2xl font-black text-primary">R$ {order.valor_total.toLocaleString('pt-BR')}</span>
                </div>
            </section>

            {/* Logistics Card */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-primary font-black">local_shipping</span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Logística</h3>
                </div>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Local de Entrega</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{order.local_evento}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Janela de Horário</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{order.horario_evento}</p>
                    </div>
                </div>
            </section>

            <div className="flex gap-4">
                <button className="flex-1 bg-primary text-white font-black py-5 rounded-3xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-xl">chat</span>
                    WhatsApp
                </button>
                <button className="flex-1 bg-white border border-slate-100 dark:border-slate-800 text-slate-400 font-black py-5 rounded-3xl flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                    Recibo
                </button>
            </div>
        </div>
    );
}
