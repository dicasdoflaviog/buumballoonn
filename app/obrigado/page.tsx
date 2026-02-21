"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";

const PLANS = [
    { name: "ESSENCIAL", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuUe3u_p5Q-kS-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S" },
    { name: "PREMIUM", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuUe3u_p5Q-kS-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S-p8W-p_S" }
];

export default function ObrigadoPage() {
    const router = useRouter();
    const { state, resetOrder } = useOrder();
    const [timeLeft, setTimeLeft] = useState(3);
    const [progress, setProgress] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const planImage = useMemo(() => {
        const plan = PLANS.find(p => p.name === state.planoSelecionado);
        return plan?.image || "";
    }, [state.planoSelecionado]);

    const generateWhatsAppUrl = () => {
        const greeting = state.nomeCliente
            ? `Olá, ${state.nomeCliente}! 👋`
            : "Olá! 👋";

        const formattedDate = state.data ? new Date(state.data).toLocaleDateString('pt-BR') : 'A definir';

        const upsellsList = [];
        if (state.upsells.guirlanda) upsellsList.push("• Guirlanda Orgânica");
        if (state.upsells.ledQuantidade > 0) upsellsList.push(`• LED Numérico (${state.upsells.ledQuantidade} unidade${state.upsells.ledQuantidade > 1 ? 's' : ''})`);
        if (state.upsells.mesa) upsellsList.push("• Mesa Decorativa");

        const upsellsText = upsellsList.length > 0
            ? upsellsList.join("\n")
            : "Sem personalizações adicionais";

        let servicesText = "";
        if (state.servicos.selfService) {
            servicesText = "Eu retiro, monto e devolvo";
        } else if (state.servicos.comodidadeTotal) {
            servicesText = "Comodidade Total (Entrega + Montagem + Retirada)";
        } else {
            const list = [];
            if (state.servicos.entrega) list.push("Entrega");
            if (state.servicos.montagem) list.push("Montagem");
            if (state.servicos.retirada) list.push("Retirada");
            servicesText = list.length > 0 ? list.join(" + ") : "Não selecionado";
        }

        const paymentText = state.formaPagamento === "100"
            ? "100% antecipado (prioridade na agenda)"
            : "50% agora (sinal) e 50% no evento";

        const message = `${greeting}

Acabei de confirmar minha reserva pelo Quiz e gostaria de receber as instruções para pagamento.

📌 Detalhes da Reserva

🎉 Evento: ${state.tipoEvento}
🎀 Tema: ${state.tema}
📅 Data: ${formattedDate}
📍 Local: ${state.local || 'A definir'}

🎁 Plano Escolhido: ${state.planoSelecionado}

✨ Personalizações:
${upsellsText}

🚚 Serviços:
${servicesText}

💰 Valor Total: R$ ${state.valores.total}

💳 Forma de Pagamento: ${paymentText}`;

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/5573999347555?text=${encodedMessage}`;
    };

    useEffect(() => {
        if (!isMounted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const countTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(countTimer);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        return () => {
            clearInterval(timer);
            clearInterval(countTimer);
        };
    }, [isMounted]);

    if (!isMounted) return null;

    const handleWhatsAppRedirect = () => {
        const url = generateWhatsAppUrl();
        window.location.href = url;
    };

    return (
        <div className="bg-[#F9F6F4] min-h-screen flex flex-col font-display overflow-x-hidden">
            <main className="flex-1 max-w-md mx-auto w-full px-6 py-12 flex flex-col items-center">
                {/* Status Steps */}
                <div className="w-full space-y-8 relative">
                    <div className="timeline-line left-[24px]"></div>

                    {/* Step 1: Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10 flex gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                            <span className="material-symbols-outlined text-white">check</span>
                        </div>
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Sua Seleção</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-[#F9F6F4]">
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary/30 text-2xl">celebration</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-800 truncate">{state.planoSelecionado}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                                        {state.tipoEvento} • {state.tema}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2: Processing */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative z-10 flex gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center shrink-0">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="material-symbols-outlined text-primary text-xl"
                            >
                                sync
                            </motion.span>
                        </div>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-black text-slate-800 mb-1">Processando Reserva</h3>
                                <p className="text-xs font-medium text-slate-500 mb-4">Sincronizando com nossa agenda oficial...</p>

                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: "85%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3 }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-[10px] font-black text-primary animate-pulse italic">GERANDO ORÇAMENTO FINAL...</p>
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest">{timeLeft}S</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Action Call */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 }}
                    className="mt-16 text-center"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-primary text-4xl font-bold">celebration</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3">Tudo Pronto!</h2>
                    <p className="text-sm font-medium text-slate-500 mb-12 max-w-[280px] mx-auto">
                        Sua pré-reserva foi gerada com sucesso. Clique abaixo para receber os detalhes no WhatsApp.
                    </p>

                    <button
                        onClick={handleWhatsAppRedirect}
                        className="w-full bg-[#1E9E55] text-white font-black py-5 rounded-2xl shadow-xl shadow-green-200 flex items-center justify-center gap-3 active:scale-95 transition-all text-lg"
                    >
                        Abrir WhatsApp
                        <span className="material-symbols-outlined font-black">bolt</span>
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] hover:text-primary transition-colors"
                    >
                        Voltar ao Início
                    </button>
                </motion.div>
            </main>
        </div>
    );
}
