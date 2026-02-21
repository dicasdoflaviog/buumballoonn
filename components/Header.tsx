"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
    showBack?: boolean;
    onBack?: () => void;
    onClose?: () => void;
    progress?: number;
}

export default function Header({ showBack = true, onBack, onClose, progress }: HeaderProps) {
    const router = useRouter();

    const isSubdomain = typeof window !== 'undefined' && window.location.hostname === 'quiz.buumballoon.com.br';
    const pathPrefix = isSubdomain ? "" : "/quiz";

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.push(`${pathPrefix}/`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/10">
            <div className="flex items-center justify-between p-4 max-w-md mx-auto w-full">
                {showBack ? (
                    <button onClick={handleBack} className="p-2 text-slate-600 ">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                ) : (
                    <div className="w-10"></div>
                )}
                <div className="flex-1 flex justify-center">
                    <img
                        alt="Logo"
                        className="h-8 object-contain"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVZ0QBEr29qXakr6OW-pFa53QnQkHCUjAT5R1IeMJjrRm5VYmvjuwk4kTqJTcIXHMvO6igWQ_Yzn1MAbOt6NPDKK75OSXz8VElJp8MnnZy0m6BBIN8jdm71B2MZzO72VSsQTw7KEgRZFUZ6uSDlblzQyS9Bx3J-0V0GO0Sa0MdKzO8yIToeDzaUUZgP2SSmqqxrQDG3CWtiVMyzpmLUQXSlbuvF3fXcMba43_qjEBqYIVWsRnK4EX6MfdJXniA5qpG_iajSroPpg"
                    />
                </div>
                <button onClick={handleClose} className="p-2 text-slate-600 ">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            {progress !== undefined && (
                <div className="max-w-md mx-auto px-4 pb-2">
                    <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </header>
    );
}
