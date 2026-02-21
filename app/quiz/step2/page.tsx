"use client";

import { useState, useEffect, useRef } from "react";
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
    const [selectedTheme, setSelectedTheme] = useState(state.tema);
    const [customTheme, setCustomTheme] = useState("");
    const [isExiting, setIsExiting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isButtonEnabled = selectedTheme || customTheme.length >= 3;

    const handleConfirm = () => {
        if (!isButtonEnabled) return;

        setIsExiting(true);
        const finalTheme = customTheme.length >= 3 ? customTheme : selectedTheme;
        setTema(finalTheme);

        setTimeout(() => setShowSuccess(true), 300);
        setTimeout(() => router.push("/quiz/step3"), 1200);
    };

    const isSelected = (theme: string) => selectedTheme === theme;

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden">
            <Header progress={40} onBack={() => router.push("/quiz/step1")} />

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
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Identidade Visual</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">
                        Qual o tema da sua festa?
                    </h1>
                </div>

                <div className="relative z-10 pl-10">
                    {/* Category Switcher */}
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm mb-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as any)}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${selectedCategory === cat
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Themes Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <span className="material-symbols-outlined text-primary text-sm font-bold">auto_awesome</span>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Mais escolhidos para {selectedCategory}
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {THEME_LIST[selectedCategory].map((theme, index) => (
                                    <motion.button
                                        key={theme}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => {
                                            if (isExiting) return;
                                            setSelectedTheme(theme);
                                            setCustomTheme("");
                                        }}
                                        className={`px-5 py-3 rounded-full border-2 font-bold text-sm transition-all duration-[250ms] active:scale-95 ${isSelected(theme)
                                                ? "border-primary bg-[#fff5f4] text-primary shadow-[0_4px_15px_rgba(244,124,108,0.1)]"
                                                : "border-slate-200 text-slate-700 hover:border-primary/40"
                                            }`}
                                    >
                                        <motion.span
                                            animate={isSelected(theme) ? { scale: [1, 1.1, 1] } : {}}
                                            className="inline-block"
                                        >
                                            {theme}
                                        </motion.span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Custom Input */}
                <div className="mt-12 relative pl-10">
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="material-symbols-outlined text-primary text-sm font-bold">edit</span>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Outra ideia?
                        </h2>
                    </div>
                    <div className="relative">
                        <motion.label
                            htmlFor="custom-theme-input"
                            animate={customTheme.length > 0 ? { y: -20, scale: 0.8, opacity: 0.6 } : { y: 0, scale: 1, opacity: 1 }}
                            className="absolute left-4 top-4 text-slate-400 pointer-events-none font-medium text-sm"
                        >
                            Digite seu tema personalizado...
                        </motion.label>
                        <input
                            id="custom-theme-input"
                            ref={inputRef}
                            type="text"
                            value={customTheme}
                            onChange={(e) => {
                                setCustomTheme(e.target.value);
                                setSelectedTheme("");
                            }}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 pt-5 pb-3 font-bold text-slate-800 outline-none focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>
            </main>

            {/* Footer Container */}
            <div className={`fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 transition-transform duration-500 ${showSuccess ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="max-w-md mx-auto">
                    <motion.button
                        id="btn-confirm-step2"
                        onClick={handleConfirm}
                        disabled={!isButtonEnabled || isExiting}
                        whileTap={isButtonEnabled ? { scale: 0.98 } : {}}
                        animate={isButtonEnabled && !isExiting ? {
                            scale: [1, 1.02, 1],
                            boxShadow: "0 10px 25px -5px rgba(244, 124, 108, 0.4)",
                            transition: { duration: 0.4, repeat: Infinity, repeatDelay: 2 }
                        } : {
                            scale: 1,
                            boxShadow: "0 0px 0px 0px rgba(0,0,0,0)"
                        }}
                        className={`w-full text-lg font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group ${isButtonEnabled && !isExiting
                                ? "bg-primary text-white opacity-100 shadow-xl shadow-primary/20"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-40 shadow-none"
                            }`}
                    >
                        Continuar
                        <motion.span
                            animate={isButtonEnabled ? { x: [0, 5, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="material-symbols-outlined font-bold"
                        >
                            arrow_forward
                        </motion.span>
                    </motion.button>
                    <footer className="mt-8 text-center opacity-40">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] ">
                            Buum Balloon • 2026
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
