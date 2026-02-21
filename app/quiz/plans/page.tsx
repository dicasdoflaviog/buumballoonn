"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

const PLANS = [
    {
        id: "essencial",
        name: "ESSENCIAL",
        price: 89,
        desc: "O básico que encanta.",
        features: ["Guirlanda de 2 metros", "Cores personalizadas", "Suporte de balões", "Desmontagem inclusa"],
        image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "premium",
        name: "PREMIUM",
        price: 159,
        desc: "A experiência completa.",
        features: ["Guirlanda de 4 metros", "Balões metalizados", "Painel circular", "Montagem luxo", "Mesa decorativa"],
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop"
    }
];

export default function PlansPage() {
    const router = useRouter();
    const { state, setPlanoSelecionado } = useOrder();
    const [selected, setSelected] = useState(state.planoSelecionado || "");
    const [mounted, setMounted] = useState(false);
    const [pathPrefix, setPathPrefix] = useState("/quiz");

    useEffect(() => {
        setMounted(true);
        const isSubdomain = window.location.hostname === 'quiz.buumballoon.com.br';
        setPathPrefix(isSubdomain ? "" : "/quiz");

        // Recomendação automática
        if (!state.planoSelecionado && !selected) {
            const lowerTipo = state.tipoEvento?.toLowerCase() || "";
            if (lowerTipo.includes("infantil") || lowerTipo.includes("casamento") || lowerTipo.includes("corporativo")) {
                setSelected("PREMIUM");
            } else if (state.tipoEvento) {
                setSelected("ESSENCIAL");
            }
        }
    }, [state.tipoEvento, state.planoSelecionado]);

    const handleConfirm = () => {
        const plan = PLANS.find(p => p.name === selected);
        if (plan) {
            setPlanoSelecionado(plan.name, plan.price);
            router.push(`${pathPrefix}/checkout`);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden">
            <Header progress={90} onBack={() => router.push(`${pathPrefix}/step4`)} />

            <main className="flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-40">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                        {selected ? "O kit ideal para você!" : "Escolha o seu plano"}
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        {selected
                            ? `Baseado no seu evento de ${state.tipoEvento || 'festa'}, selecionamos o plano ${selected}.`
                            : "Temos a opção ideal para o tamanho da sua festa."}
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelected(plan.name)}
                            className={`relative overflow-hidden rounded-3xl border-2 transition-all cursor-pointer ${selected === plan.name
                                ? "border-primary bg-white shadow-xl shadow-primary/10"
                                : "border-slate-100 bg-white/50 grayscale hover:grayscale-0 hover:border-primary/30"
                                }`}
                        >
                            <div className="h-44 relative">
                                <img
                                    src={plan.image}
                                    className="w-full h-full object-cover"
                                    alt={plan.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                {plan.name === "PREMIUM" && (
                                    <div className="absolute top-4 left-4 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <span className="material-symbols-outlined text-[12px]">star</span>
                                        RECOMENDADO
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight">{plan.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Valor do kit</p>
                                        <p className="text-2xl font-black text-primary leading-none">R$ {plan.price}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {plan.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <span className="material-symbols-outlined text-sm text-green-500 font-bold">check_circle</span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selected === plan.name && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-4 right-4 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-lg font-black">check</span>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer Container */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleConfirm}
                        disabled={!selected}
                        className={`w-full text-lg font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${selected
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                    >
                        Confirmar Escolha
                        <span className="material-symbols-outlined font-bold">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
