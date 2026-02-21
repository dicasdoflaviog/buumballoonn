"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypeWriterProps {
 text: string;
 speed?: number;
 delayBeforeStart?: number;
 onComplete?: () => void;
}

export default function TypeWriter({
 text,
 speed = 40,
 delayBeforeStart = 0,
 onComplete,
}: TypeWriterProps) {
 const [displayedText, setDisplayedText] = useState("");
 const [currentIndex, setCurrentIndex] = useState(0);
 const [isStarted, setIsStarted] = useState(false);

 useEffect(() => {
 const startTimeout = setTimeout(() => {
 setIsStarted(true);
 }, delayBeforeStart);
 return () => clearTimeout(startTimeout);
 }, [delayBeforeStart]);

 useEffect(() => {
 if (!isStarted) return;

 if (currentIndex < text.length) {
 const timeout = setTimeout(() => {
 setDisplayedText((prev) => prev + text[currentIndex]);
 setCurrentIndex((prev) => prev + 1);
 }, speed);

 return () => clearTimeout(timeout);
 } else if (onComplete) {
 const completionTimeout = setTimeout(() => {
 onComplete();
 }, 600);
 return () => clearTimeout(completionTimeout);
 }
 }, [currentIndex, text, speed, isStarted, onComplete]);

 return (
 <p className="text-lg font-medium leading-tight ">
 {displayedText}
 {currentIndex < text.length && (
 <motion.span
 animate={{ opacity: [0, 1, 0] }}
 transition={{ repeat: Infinity, duration: 0.8 }}
 className="inline-block w-[2px] h-[1.2em] bg-primary ml-1 align-middle"
 />
 )}
 </p>
 );
}
