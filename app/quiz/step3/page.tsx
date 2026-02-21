"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Step3() {
    const router = useRouter();
    const { state, setData } = useOrder();
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(state.data ? new Date(state.data) : null);
    const [isExiting, setIsExiting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const calendarData = useMemo(() => {
        const targetDate = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1);
        const monthName = targetDate.toLocaleDateString('pt-BR', { month: 'long' });
        const year = targetDate.getFullYear();

        const firstDayOfMonth = targetDate.getDay();
        const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();

        const days = [];

        // Fill empty start
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        // Fill actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(targetDate.getFullYear(), targetDate.getMonth(), day);
            dateObj.setHours(0, 0, 0, 0);

            let status = 'disponivel';

            if (dateObj < today) {
                status = 'esgotado';
            } else {
                // Mock some availability logic
                const dayHash = (day + targetDate.getMonth() * 31) % 10;
                if (dayHash === 3 || dayHash === 7) status = 'ultimas-vagas';
                if (dayHash === 0) status = 'esgotado';
            }

            days.push({ day, date: dateObj, status });
        }

        return { monthName, year, days };
    }, [today, currentMonthOffset]);

    const handleConfirm = async () => {
        if (!selectedDate) return;

        setIsExiting(true);
        setData(selectedDate.toISOString());

        setTimeout(() => {
            setShowSuccess(true);
        }, 300);

        setTimeout(() => {
            router.push("/quiz/step4");
        }, 1500);
    };

    const formatDateDisplay = (date: Date) => {
        return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
    };

    const getAlertMessage = () => {
        if (!selectedDate) return null;

        const diffDays = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

        if (isWeekend) return "⚠️ Finais de semana costumam esgotar rapidamente.";
        if (diffDays <= 15) return "⚡ Pouca antecedência pode limitar horários disponíveis.";
        return null;
    };

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden">
            <Header progress={60} onBack={() => router.push("/quiz/step2")} />

            <main className="flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-40 relative">
                <div className="timeline-line"></div>

                {/* Header Section */}
                <div className="relative z-10 mb-8 pl-10">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm">calendar_month</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Agendamento</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight">
                        Quando será o evento?
                    </h1>
                </div>

                <div className="relative z-10 pl-10">
                    {/* Calendar Container */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                        {/* Month Selector */}
                        <div className="flex items-center justify-between mb-6 px-2">
                            <button
                                onClick={() => setCurrentMonthOffset(prev => prev - 1)}
                                disabled={currentMonthOffset <= 0}
                                className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center disabled:opacity-20"
                            >
                                <span className="material-symbols-outlined text-slate-600">chevron_left</span>
                            </button>
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">
                                {calendarData.monthName} {calendarData.year}
                            </h3>
                            <button
                                onClick={() => setCurrentMonthOffset(prev => prev + 1)}
                                className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                            </button>
                        </div>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 mb-2">
                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                <div key={i} className="text-center text-[10px] font-black text-slate-300 py-2">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarData.days.map((item, i) => {
                                if (!item) return <div key={i} />;

                                const isSelected = selectedDate?.getTime() === item.date.getTime();
                                const isToday = today.getTime() === item.date.getTime();

                                return (
                                    <button
                                        key={i}
                                        disabled={item.status === 'esgotado'}
                                        onClick={() => setSelectedDate(item.date)}
                                        className={`
                                            relative h-11 flex flex-col items-center justify-center rounded-xl transition-all
                                            ${isSelected
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30 z-10 scale-110'
                                                : isToday
                                                    ? 'border-2 border-primary/20 text-primary font-bold'
                                                    : 'bg-transparent text-slate-600 hover:bg-slate-50'
                                            }
                                            ${item.status === 'esgotado' ? 'opacity-30 cursor-not-allowed line-through' : ''}
                                        `}
                                    >
                                        <span className="text-sm font-bold">{item.day}</span>
                                        {item.status === 'ultimas-vagas' && !isSelected && (
                                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Alert */}
                    <AnimatePresence>
                        {getAlertMessage() && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3"
                            >
                                <p className="text-xs font-bold text-orange-700 leading-tight">
                                    {getAlertMessage()}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer Container */}
            <div className={`fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 transition-transform duration-500 ${showSuccess ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Data Selecionada</p>
                            <p className="text-xl font-black text-slate-800">
                                {selectedDate ? formatDateDisplay(selectedDate) : 'Selecione no calendário'}
                            </p>
                        </div>
                        {selectedDate && (
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600 font-bold">check</span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        id="btn-confirm-step3"
                        onClick={handleConfirm}
                        disabled={!selectedDate || isExiting}
                        whileTap={selectedDate ? { scale: 0.98 } : {}}
                        className={`w-full text-lg font-black py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${selectedDate && !isExiting
                                ? "bg-primary text-white shadow-xl shadow-primary/20"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                    >
                        Confirmar Data
                        <span className="material-symbols-outlined font-bold">event_available</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
