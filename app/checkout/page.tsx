"use client";

import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const router = useRouter();
    const { state, updateServicos, setFormaPagamento, updateUpsells } = useOrder();
    const [isConfirming, setIsConfirming] = useState(false);

    // Dynamic Payment Logic
    const paymentToday = useMemo(() => {
        const total = state.valores.total;
        if (state.formaPagamento === "100") return total;
        if (state.formaPagamento === "50/50") return total * 0.5;
        return total * 0.5; // Default/Sinal
    }, [state.valores.total, state.formaPagamento]);

    const paymentLabel = useMemo(() => {
        if (state.formaPagamento === "100") return "Pagamento Hoje (À Vista)";
        return "Pagamento Hoje (Sinal)";
    }, [state.formaPagamento]);

    const handleConfirmBooking = async () => {
        if (!state.formaPagamento) return;

        setIsConfirming(true);

        try {
            // 1. Dispatch Tracking Event
            if (typeof window !== "undefined") {
                console.log("Tracking Event: reserva_confirmada", {
                    valorTotal: state.valores.total,
                    valorHoje: paymentToday,
                    formaPagamento: state.formaPagamento,
                    plano: state.planoSelecionado,
                    dataEvento: state.data
                });
            }

            setTimeout(() => {
                router.push("/obrigado");
            }, 800);

        } catch (error) {
            console.error("Erro ao confirmar reserva:", error);
            setIsConfirming(false);
        }
    };

    const handleServiceToggle = (id: string) => {
        const current = state.servicos;
        let next = { ...current };

        if (id === "selfService") {
            const newValue = !current.selfService;
            next = {
                selfService: newValue,
                entrega: false,
                montagem: false,
                retirada: false,
                comodidadeTotal: false
            };
        } else if (id === "comodidadeTotal") {
            const newValue = !current.comodidadeTotal;
            next = {
                selfService: false,
                entrega: false,
                montagem: false,
                retirada: false,
                comodidadeTotal: newValue
            };
        } else {
            // Individual services
            next.selfService = false;
            next.comodidadeTotal = false;
            next[id as keyof typeof next] = !current[id as keyof typeof next];
        }

        updateServicos(next);
    };

    const handleUpsellToggle = (key: string) => {
        if (key === "led") {
            updateUpsells({ ledQuantidade: state.upsells.ledQuantidade > 0 ? 0 : 1 });
        } else {
            updateUpsells({ [key]: !state.upsells[key as keyof typeof state.upsells] });
        }
    };

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col font-display overflow-x-hidden uppercase-none">
            <Header progress={100} onBack={() => router.push("/plans")} />

            <main className="flex-1 max-w-md mx-auto w-full px-6 py-8 pb-64">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-black mb-6">Resumo da Reserva</h1>
                </motion.div>

                {/* Event Summary Card */}
                <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Seu Plano</p>
                                <h3 className="text-xl font-black tracking-tight">{state.planoSelecionado}</h3>
                                <p className="text-xs text-slate-500 font-medium">{state.tipoEvento} • {state.tema}</p>
                            </div>
                            <span className="text-xl font-bold">R$ {state.valores.valorPlano}</span>
                        </div>

                        {/* Interactive Upsells */}
                        <div className="space-y-3 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Personalizações (Upsells)</p>

                            {[
                                { id: "guirlanda", label: "Guirlanda Orgânica", price: 40, icon: "🌿" },
                                { id: "led", label: `LED Numérico ${state.upsells.ledQuantidade > 1 ? `(x${state.upsells.ledQuantidade})` : "(x1)"}`, price: 35 * (state.upsells.ledQuantidade || 1), icon: "💡" },
                                { id: "mesa", label: "Mesa Decorativa", price: 30, icon: "🪄" }
                            ].map((item) => {
                                const isChecked = item.id === "led" ? state.upsells.ledQuantidade > 0 : !!state.upsells[item.id as keyof typeof state.upsells];

                                return (
                                    <motion.div
                                        key={item.id}
                                        onClick={() => handleUpsellToggle(item.id)}
                                        className="group cursor-pointer flex items-center justify-between"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isChecked ? "bg-primary border-primary" : "border-slate-300"
                                                }`}>
                                                {isChecked && <span className="material-symbols-outlined text-white text-[14px] font-black">check</span>}
                                            </div>
                                            <span className={`text-sm font-bold transition-colors ${isChecked ? "text-slate-800" : "text-slate-400"}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${isChecked ? "text-primary" : "text-slate-300"}`}>
                                            R$ {item.price}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-xs font-semibold opacity-60">
                                <span className="material-symbols-outlined text-base">calendar_month</span>
                                <span>{state.data ? new Date(state.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Não informada'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold opacity-60">
                                <span className="material-symbols-outlined text-base">location_on</span>
                                <span className="truncate">{state.local || 'Não informado'}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-5 px-2">
                        <span className="material-symbols-outlined text-primary text-sm font-bold">local_shipping</span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 tracking-[0.1em]">Serviços e Logística</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            {
                                id: "selfService",
                                label: "Eu retiro, monto e devolvo",
                                sub: "Você busca conosco, monta no seu evento e devolve depois.",
                                price: 0,
                                icon: "package_2",
                                free: true
                            },
                            {
                                id: "entrega",
                                label: "Entrega no local",
                                sub: "Levamos o kit até o endereço do seu evento.",
                                price: 40,
                                icon: "local_shipping"
                            },
                            {
                                id: "montagem",
                                label: "Montagem Profissional",
                                sub: "Nossa equipe monta toda a decoração no local.",
                                price: 40,
                                icon: "construction"
                            },
                            {
                                id: "retirada",
                                label: "Retirada pós-evento",
                                sub: "Voltamos após o evento para desmontar e recolher.",
                                price: 40,
                                icon: "restore_from_trash"
                            },
                            {
                                id: "comodidadeTotal",
                                label: "Comodidade Total (Combo)",
                                sub: "Cuidamos de tudo: entrega, montagem e retirada.",
                                subSecondary: "A escolha ideal para quem quer tranquilidade do início ao fim.",
                                price: 120,
                                icon: "verified",
                                highlight: true
                            },
                        ].map((service) => {
                            const isSelected = !!state.servicos[service.id as keyof typeof state.servicos];

                            return (
                                <motion.label
                                    key={service.id}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${service.highlight
                                        ? isSelected
                                            ? "border-primary bg-gradient-to-br from-[#FFF5F4] to-[#FFEBE9] shadow-xl shadow-primary/20"
                                            : "bg-white border-primary/30"
                                        : isSelected
                                            ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                                            : "bg-white border-slate-100 hover:border-primary/30"
                                        }`}
                                    onClick={() => handleServiceToggle(service.id)}
                                >
                                    {/* Badges */}
                                    {service.free && (
                                        <div className="absolute top-3 right-4 bg-green-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                                            Grátis
                                        </div>
                                    )}
                                    {service.highlight && (
                                        <div className="absolute -top-2.5 right-6 bg-primary text-[8px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                                            Mais escolhido
                                        </div>
                                    )}

                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                        }`}>
                                        <span className="material-symbols-outlined text-xl font-bold">{service.icon}</span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className="text-sm font-bold tracking-tight">{service.label}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-[10px] font-medium text-slate-500 leading-tight">
                                                {service.sub}
                                            </p>

                                            {service.subSecondary && (
                                                <motion.div
                                                    className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors ${isSelected
                                                        ? "bg-[#1E9E55] border-[#1E9E55]/20"
                                                        : "bg-[#E8F7EE] border-[#1E9E55]/10"
                                                        }`}
                                                >
                                                    <span className={`material-symbols-outlined text-[12px] font-bold ${isSelected ? "text-white" : "text-[#1E9E55]"
                                                        }`}>auto_awesome</span>
                                                    <p className={`text-[9px] font-black leading-none tracking-tight ${isSelected ? "text-white" : "text-[#1E9E55]"
                                                        }`}>
                                                        {service.subSecondary}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                        ? service.highlight ? "border-[#1E9E55] bg-[#1E9E55]" : "border-primary bg-primary"
                                        : "border-slate-300"
                                        }`}>
                                        {isSelected && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="material-symbols-outlined text-white text-xs font-black"
                                            >
                                                check
                                            </motion.span>
                                        )}
                                    </div>
                                </motion.label>
                            );
                        })}
                    </div>
                </section>

                {/* Payment Form Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-5 px-2">
                        <span className="material-symbols-outlined text-primary text-sm font-bold">payments</span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 tracking-[0.1em]">Forma de Pagamento</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setFormaPagamento("50/50")}
                            className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${state.formaPagamento === "50/50" ? "border-primary bg-primary/5 shadow-sm" : "bg-white border-slate-100 hover:border-primary/20"
                                }`}
                        >
                            <p className="text-sm font-bold">50% / 50%</p>
                            <p className="text-[10px] font-bold opacity-60 leading-tight mt-1.5">Metade agora, metade no evento</p>
                        </button>
                        <button
                            onClick={() => setFormaPagamento("100")}
                            className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${state.formaPagamento === "100" ? "border-primary bg-primary/5 shadow-sm" : "bg-white border-slate-100 hover:border-primary/20"
                                }`}
                        >
                            <p className="text-sm font-bold">100% à vista</p>
                            <p className="text-[10px] font-bold opacity-60 leading-tight mt-1.5">Antecipado com prioridade</p>
                        </button>
                    </div>
                </section>
            </main>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-primary/10 p-6 z-50">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 text-slate-500">Total da Reserva</p>
                            <p className="text-3xl font-black text-slate-800">
                                R$ {state.valores.total}
                            </p>
                        </div>
                        <div className="flex flex-col text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none mb-1">{paymentLabel}</p>
                            <p className="text-2xl font-black text-primary leading-none">R$ {paymentToday}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirmBooking}
                        disabled={!state.formaPagamento || isConfirming}
                        style={{
                            backgroundColor: state.formaPagamento && !isConfirming ? "#1E9E55" : undefined,
                            boxShadow: state.formaPagamento && !isConfirming ? "0 10px 15px -3px rgba(30, 158, 85, 0.2)" : undefined
                        }}
                        className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 active:scale-95 text-white ${!state.formaPagamento || isConfirming
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-50 shadow-none"
                            : "hover:bg-[#168347] shadow-xl"
                            }`}
                    >
                        {isConfirming ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                Confirmar Reserva
                                <span className="material-symbols-outlined font-black">verified</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
