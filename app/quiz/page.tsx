"use client";

import { useRouter } from "next/navigation";
import { useOrder } from "@/context/OrderContext";
import Header from "@/components/Header";

export default function QuizStartPage() {
    const router = useRouter();
    const { resetOrder } = useOrder();

    const handleStart = () => {
        resetOrder();
        router.push("/quiz/step1");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header showBack={false} />

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-md mx-auto">
                <div className="mb-8 relative">
                    <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl absolute -z-10 animate-pulse"></div>
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVZ0QBEr29qXakr6OW-pFa53QnQkHCUjAT5R1IeMJjrRm5VYmvjuwk4kTqJTcIXHMvO6igWQ_Yzn1MAbOt6NPDKK75OSXz8VElJp8MnnZy0m6BBIN8jdm71B2MZzO72VSsQTw7KEgRZFUZ6uSDlblzQyS9Bx3J-0V0GO0Sa0MdKzO8yIToeDzaUUZgP2SSmqqxrQDG3CWtiVMyzpmLUQXSlbuvF3fXcMba43_qjEBqYIVWsRnK4EX6MfdJXniA5qpG_iajSroPpg"
                        alt="Buum Balloon"
                        className="w-48 mx-auto object-contain"
                    />
                </div>

                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                    Buum Balloon
                </h1>
                <p className="text-xl font-medium mb-2 text-slate-800">
                    Vamos começar o seu planejamento?
                </p>
                <p className="text-slate-500 mb-12">
                    Responda algumas perguntas rápidas e descubra o plano ideal para transformar seu evento.
                </p>

                <button
                    id="btn-start-quiz-main"
                    onClick={handleStart}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-lg shadow-primary/30 transition-all text-xl active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                    Iniciar Quiz
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
            </main>

            <footer className="p-8 text-center text-slate-400">
                <p className="text-[10px] uppercase tracking-wider font-medium">
                    CNPJ 44.081.435/0001-83 | © 2026 Todos os direitos reservados
                </p>
            </footer>
        </div>
    );
}
