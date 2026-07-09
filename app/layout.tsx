import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

import AutoRefresh from "@/components/AutoRefresh";

export const metadata: Metadata = {
  title: "Supervisório de Repetidoras | Empresa Demo",
  description: "Painel de controle, monitoramento e gerenciamento de repetidoras industriais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} light h-full antialiased`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AutoRefresh />
        {children}
        <Toaster richColors position="top-right" theme="light" />
      </body>
    </html>
  );
}

