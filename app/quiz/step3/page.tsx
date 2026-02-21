"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Step3() {
    const router = useRouter();
    const { state, setData } = useOrder();
    const [selectedDate, setSelectedDate] = useState(state.data || "");
    const [isExiting, setIsExiting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pathPrefix, setPathPrefix] = useState("/quiz");

    const isButtonEnabled = !!selectedDate;

    useEffect(() => {
        setMounted(true);
        const isSubdomain = typeof window !== 'undefined' && window.location.hostname === 'quiz.buumballoon.com.br';
        setPathPrefix(isSubdomain ? "" : "/quiz");
    }, []);

    const handleConfirm = () => {
        if (!isButtonEnabled) return;

        setIsExiting(true);
        setData(selectedDate);

        setTimeout(() => setShowSuccess(true), 300);
        setTimeout(() => router.push(`${pathPrefix}/step4`), 1200);
    };

    // Calculate dynamic dates for next 3 weekends
    const quickDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        let current = new Date(today);

        while (dates.length < 4) {
            current.setDate(current.getDate() + 1);
            const day = current.getDay();
            if (day === 0 || day === 6) { // Sat or Sun
                dates.push(new Date(current));
            }
        }
        return dates;
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden">
            <Header progress={60} onBack={() => router.push(`${pathPrefix}/step2`)} />

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
                            <span className="material-symbols-outlined text-white text-sm">calendar_today</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Datas</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">
                        Quando será o seu grande dia?
                    </h1>
                </div>

                <div className="relative z-10 pl-10">
                    {/* Date Picker Input */}
                    <div className="bg-white rounded-[2.5rem] p-4 border-2 border-slate-100 shadow-sm mb-8">
                        <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full h-16 bg-slate-50 border-none rounded-3xl px-6 font-bold text-slate-800 text-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                        />
                    </div>

                    {/* Quick Dates Grid */}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 ml-2">Próximos Finais de Semana</p>
                    <div className="grid grid-cols-2 gap-4">
                        {quickDates.map((date, index) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = selectedDate === dateStr;

                            return (
                                <motion.button
                                    key={dateStr}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${isSelected
                                        ? "border-primary bg-white shadow-xl shadow-primary/10"
                                        : "border-slate-50 bg-white/50 grayscale hover:grayscale-0 hover:border-primary/20"
                                        }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                                    </span>
                                    <span className={`text-2xl font-black ${isSelected ? "text-primary" : "text-slate-800"}`}>
                                        {date.getDate()}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500">
                                        {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Footer Container */}
            <div className={`fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 transition-transform duration-500 ${showSuccess ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="max-w-md mx-auto">
                    <button
                        id="btn-confirm-step3"
                        onClick={handleConfirm}
                        disabled={!isButtonEnabled || isExiting}
                        className={`w-full text-lg font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${isButtonEnabled && !isExiting
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                    >
                        {isExiting ? "Aguarde..." : "Confirmar Data"}
                        <span className="material-symbols-outlined font-bold">event_available</span>
                    </button>
                    <p className="text-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Sujeito a disponibilidade de agenda
                    </p>
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
                            <span className="material-symbols-outlined text-5xl">location_on</span>
                        </motion.div>
                        <h2 className="text-3xl font-black mb-2">Agendado!</h2>
                        <p className="font-bold opacity-80 text-center">Agora, onde será realizado?</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
