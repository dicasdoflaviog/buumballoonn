import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { OrderProvider } from "@/context/OrderContext";

const montserrat = Montserrat({
 subsets: ["latin"],
 variable: "--font-montserrat",
});

export const metadata: Metadata = {
 title: "Buum Balloon - Planejador de Festas",
 description: "Planeje sua festa de forma fácil e rápida.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="pt-BR" suppressHydrationWarning>
 <head>
 <link
 href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
 rel="stylesheet"
 />
 </head>
 <body className={`${montserrat.variable} antialiased font-sans`} suppressHydrationWarning>
 <OrderProvider>
 {children}
 </OrderProvider>
 </body>
 </html>
 );
}
