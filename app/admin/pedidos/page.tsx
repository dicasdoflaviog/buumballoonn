"use client";

import { motion } from "framer-motion";

export default function PedidosPage() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestão de Pedidos</h1>
                <p className="text-slate-500 font-medium">Acompanhe e gerencie as solicitações vindas do Quiz.</p>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col items-center justify-center p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-slate-200 text-5xl italic">shopping_cart</span>
                </div>
                <h2 className="text-xl font-black text-slate-400 italic mb-2">Módulo em Desenvolvimento</h2>
                <p className="text-slate-400 font-medium italic max-w-xs">
                    Estamos integrando este módulo com a nova estrutura de banco de dados. Em breve você verá a lista completa aqui.
                </p>
            </div>
        </div>
    );
}
