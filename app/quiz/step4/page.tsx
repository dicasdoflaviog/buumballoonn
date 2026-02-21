"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Step4() {
    const router = useRouter();
    const { state, setLocal } = useOrder();
    const [localValue, setLocalValue] = useState(state.local || "");
    const [isExiting, setIsExiting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pathPrefix, setPathPrefix] = useState("/quiz");

    useEffect(() => {
        setMounted(true);
        const isSubdomain = typeof window !== 'undefined' && window.location.hostname === 'quiz.buumballoon.com.br';
        setPathPrefix(isSubdomain ? "" : "/quiz");
    }, []);

    const isButtonEnabled = localValue.length >= 5;

    const handleConfirm = () => {
        if (!isButtonEnabled) return;

        setIsExiting(true);
        setLocal(localValue);

        setTimeout(() => setShowSuccess(true), 300);
        setTimeout(() => router.push(`${pathPrefix}/plans`), 1200);
    };

    if (!mounted) return null;

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden">
            <Header progress={80} onBack={() => router.push(`${pathPrefix}/step3`)} />

            <main className="flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-40 relative">
                <div className="timeline-line"></div>

                {/* Header Section */}
                <div className="relative z-10 mb-10 pl-10">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm">location_on</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Logística</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">
                        Onde será a sua festa?
                    </h1>
                </div>

                <div className="relative z-10 pl-10">
                    <div className="space-y-6">
                        <div className="relative">
                            <motion.label
                                htmlFor="location-input"
                                animate={localValue.length > 0 ? { y: -20, scale: 0.8, opacity: 0.6 } : { y: 0, scale: 1, opacity: 1 }}
                                className="absolute left-4 top-4 text-slate-400 pointer-events-none font-medium text-sm"
                            >
                                Digite o endereço ou bairro...
                            </motion.label>
                            <textarea
                                id="location-input"
                                value={localValue}
                                onChange={(e) => setLocalValue(e.target.value)}
                                rows={3}
                                className="w-full bg-white border-2 border-slate-100 rounded-3xl p-4 pt-5 pb-3 font-bold text-slate-800 outline-none focus:border-primary transition-all shadow-sm resize-none"
                            />
                        </div>

                        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">info</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest">
                                O local é importante para calcularmos o frete e garantir que nossa equipe chegue no horário planejado.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Container */}
            <div className={`fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 transition-transform duration-500 ${showSuccess ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="max-w-md mx-auto">
                    <button
                        id="btn-confirm-step4"
                        onClick={handleConfirm}
                        disabled={!isButtonEnabled || isExiting}
                        className={`w-full text-lg font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${isButtonEnabled && !isExiting
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                    >
                        {isExiting ? "Aguarde..." : "Continuar para Planos"}
                        <span className="material-symbols-outlined font-bold">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
