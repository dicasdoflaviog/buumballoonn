"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Kids", "Adultos"];
const THEME_LIST: Record<string, string[]> = {
    Kids: ["Barbie", "Naruto", "Dinossauro", "Safari", "Unicórnio", "Princesa"],
    Adultos: ["Minimalista", "Neon", "Boteco", "Hollywood", "Vintage", "Tropical"],
};

export default function Step2() {
    const router = useRouter();
    const { state, setTema } = useOrder();
    const [selectedCategory, setSelectedCategory] = useState<"Kids" | "Adultos">("Kids");
    const [selectedTheme, setSelectedTheme] = useState(state.tema || "");
    const [customTheme, setCustomTheme] = useState("");
    const [isExiting, setIsExiting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pathPrefix, setPathPrefix] = useState("/quiz");
    const inputRef = useRef<HTMLInputElement>(null);

    const isButtonEnabled = selectedTheme || customTheme.length >= 3;

    useEffect(() => {
        setMounted(true);
        const isSubdomain = typeof window !== 'undefined' && window.location.hostname === 'quiz.buumballoon.com.br';
        setPathPrefix(isSubdomain ? "" : "/quiz");
    }, []);

    const handleConfirm = () => {
        if (!isButtonEnabled) return;

        setIsExiting(true);
        const finalTheme = customTheme.length >= 3 ? customTheme : selectedTheme;
        setTema(finalTheme);

        setTimeout(() => setShowSuccess(true), 300);
        setTimeout(() => router.push(`${pathPrefix}/step3`), 1200);
    };

    if (!mounted) return null;

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden">
            <Header progress={40} onBack={() => router.push(`${pathPrefix}/step1`)} />

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
                            <span className="material-symbols-outlined text-white text-sm">palette</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Estética</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">
                        Qual o tema da sua celebração?
                    </h1>
                </div>

                <div className="relative z-10 pl-10">
                    {/* Category Switcher */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as "Kids" | "Adultos")}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedCategory === cat
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Theme Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {THEME_LIST[selectedCategory].map((theme, index) => (
                            <motion.button
                                key={theme}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    setSelectedTheme(theme);
                                    setCustomTheme("");
                                }}
                                className={`p-5 rounded-3xl border-2 transition-all text-left group relative h-32 flex flex-col justify-between overflow-hidden ${selectedTheme === theme
                                    ? "border-primary bg-white shadow-xl shadow-primary/10"
                                    : "border-slate-100 bg-white/50 grayscale hover:grayscale-0 hover:border-primary/20"
                                    }`}
                            >
                                <span className={`text-sm font-black transition-colors ${selectedTheme === theme ? "text-slate-900" : "text-slate-400"}`}>
                                    {theme}
                                </span>
                                {selectedTheme === theme && (
                                    <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-xl font-black">check</span>
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Custom Theme Input */}
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Outro tema..."
                            value={customTheme}
                            onChange={(e) => {
                                setCustomTheme(e.target.value);
                                setSelectedTheme("");
                            }}
                            className={`w-full bg-white border-2 rounded-3xl p-5 font-bold text-slate-800 outline-none transition-all ${customTheme.length >= 3 ? "border-primary shadow-lg shadow-primary/5" : "border-slate-100 focus:border-primary/50"
                                }`}
                        />
                        <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">edit</span>
                    </div>
                </div>
            </main>

            {/* Footer Container */}
            <div className={`fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 transition-transform duration-500 ${showSuccess ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="max-w-md mx-auto">
                    <button
                        id="btn-confirm-step2"
                        onClick={handleConfirm}
                        disabled={!isButtonEnabled || isExiting}
                        className={`w-full text-lg font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${isButtonEnabled && !isExiting
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                    >
                        {isExiting ? "Aguarde..." : "Próximo Passo"}
                        <span className="material-symbols-outlined font-bold">arrow_forward</span>
                    </button>
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center text-white p-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6"
                        >
                            <span className="material-symbols-outlined text-5xl">auto_awesome</span>
                        </motion.div>
                        <h2 className="text-3xl font-black mb-2">Tema Escolhido!</h2>
                        <p className="font-bold opacity-80 text-center">Agora vamos para a data do evento.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
