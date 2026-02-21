"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { motion } from "framer-motion";
import TypeWriter from "@/components/TypeWriter";

const EVENT_TYPES = [
    { id: "infantil", label: "Aniversário infantil", sub: "Celebração para os pequenos", icon: "🎈" },
    { id: "adulto", label: "Aniversário adulto", sub: "Festa para maiores de 18", icon: "🎉" },
    { id: "revelacao", label: "Chá revelação / bebê", sub: "Momento com a família", icon: "👶" },
    { id: "escolar", label: "Evento escolar", sub: "Formatura ou reunião", icon: "🏫" },
    { id: "outro", label: "Outro", sub: "Outros tipos de celebração", icon: "✨" },
];

export default function Step1() {
    const router = useRouter();
    const { state, setTipoEvento } = useOrder();
    const [selected, setSelected] = useState(state.tipoEvento || "");

    const [showQuestion, setShowQuestion] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pathPrefix, setPathPrefix] = useState("/quiz");

    const handleInitialMessageComplete = () => {
        setTimeout(() => {
            setShowQuestion(true);
        }, 400);
    };

    useEffect(() => {
        setMounted(true);
        const isSubdomain = typeof window !== 'undefined' && window.location.hostname === 'quiz.buumballoon.com.br';
        setPathPrefix(isSubdomain ? "" : "/quiz");

        if (showQuestion) {
            const timer = setTimeout(() => {
                setShowOptions(true);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [showQuestion]);

    const handleConfirm = async () => {
        if (!selected) return;
        setIsExiting(true);
        setTipoEvento(selected);
        setTimeout(() => {
            setShowFinalMessage(true);
        }, 300);
        setTimeout(() => {
            router.push(`${pathPrefix}/step2`);
        }, 1200);
    };

    if (!mounted) return null;

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden">
            <Header progress={20} />
            <main className="flex-1 w-full max-w-md mx-auto px-4 pt-6 pb-40 relative">
                <div className="timeline-line"></div>
                <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex flex-col gap-2 items-start max-w-[85%]">
                        <div className="flex items-center gap-2 mb-1">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
                            >
                                <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
                            </motion.div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs font-bold uppercase tracking-widest text-primary/80"
                            >
                                Assistente IA
                            </motion.span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-primary/10 shadow-sm transition-all duration-300 min-h-[60px] flex items-center">
                            {!showFinalMessage ? (
                                <TypeWriter
                                    text="Olá! Sou seu assistente de eventos. Vamos planejar algo incrível?"
                                    onComplete={handleInitialMessageComplete}
                                />
                            ) : (
                                <motion.p
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-lg font-medium leading-tight text-slate-900"
                                >
                                    Perfeito! Vamos escolher o tema 🎨
                                </motion.p>
                            )}
                        </div>
                    </div>

                    {showQuestion && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`flex flex-col gap-2 items-start max-w-[85%] transition-opacity duration-300 ${showFinalMessage ? 'opacity-0' : 'opacity-100'}`}
                        >
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-primary/10 shadow-sm">
                                <p className="text-xl font-bold text-slate-900 mb-1">
                                    Que tipo de festa você vai fazer?
                                </p>
                                <p className="text-sm text-slate-500">
                                    Vamos começar entendendo o seu momento.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {showOptions && (
                        <div className={`flex flex-col gap-3 items-end w-full pl-10 transition-all duration-300 ${showFinalMessage ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100'}`}>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 mr-2"
                            >
                                Selecione uma opção
                            </motion.span>
                            <div className="grid grid-cols-1 gap-3 w-full">
                                {EVENT_TYPES.map((type, index) => (
                                    <motion.label
                                        key={type.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.12, duration: 0.35, ease: "easeOut" }}
                                        className={`group relative flex items-center gap-4 p-4 cursor-pointer rounded-2xl border-2 transition-all duration-250 ${selected === type.label
                                            ? "border-primary bg-[#fff5f4] shadow-[0_4px_15px_rgba(244,124,108,0.2)]"
                                            : "border-slate-200 bg-white hover:border-primary/40"
                                            }`}
                                        onClick={() => !isExiting && setSelected(type.label)}
                                    >
                                        <div className={`w-10 h-10 flex items-center justify-center text-2xl rounded-xl transition-colors ${selected === type.label ? 'bg-white/20' : 'bg-white/5'}`}>
                                            {type.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-base ${selected === type.label ? 'text-slate-900' : 'text-slate-800'}`}>{type.label}</p>
                                            <p className={`text-xs ${selected === type.label ? 'text-primary/70' : 'text-slate-500'}`}>{type.sub}</p>
                                        </div>
                                        <input type="radio" className="hidden" name="party_type" checked={selected === type.label} readOnly />
                                        <div className={`w-5 h-5 rounded-full border-2 transition-colors duration-250 flex items-center justify-center ${selected === type.label ? "border-primary" : "border-slate-300"}`}>
                                            {selected === type.label && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    </motion.label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {showOptions && (
                <div className={`fixed bottom-0 left-0 right-0 bg-background-light/95 backdrop-blur-lg border-t border-primary/10 z-50 transition-transform duration-500 ${showFinalMessage ? 'translate-y-full' : 'translate-y-0'}`}>
                    <div className="max-w-md mx-auto p-4 flex flex-col gap-4">
                        <motion.button
                            id="btn-confirm-step1"
                            onClick={handleConfirm}
                            disabled={!selected || isExiting}
                            whileTap={selected ? { scale: 0.98 } : {}}
                            animate={selected && !isExiting ? { scale: [1, 1.03, 1], transition: { duration: 0.4, repeat: Infinity, repeatDelay: 2 } } : {}}
                            className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${selected && !isExiting
                                ? "bg-primary text-white shadow-primary/30 opacity-100"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-40"
                                }`}
                        >
                            {isExiting ? "Carregando..." : "Confirmar Escolha"}
                            <span className="material-symbols-outlined text-xl">send</span>
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
}
