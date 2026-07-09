"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BatteryCharging,
  Lock,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Mock login for demo - always success
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Title / Logo Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/10 text-primary animate-pulse">
            <BatteryCharging className="h-10 w-10 stroke-[2.5]" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Supervisório <span className="text-primary font-light">Empresa</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Insira suas credenciais para gerenciar e monitorar as repetidoras.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass rounded-2xl p-8 shadow-2xl border border-border relative overflow-hidden">
          {/* Subtle glowing element in background */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-600">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
              >
                Nome de Usuário
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Ex: admin"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>

          {/* Seed credentials info
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Acesso para Testes:</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-muted/40 rounded p-1.5 border border-border">
                <span className="font-bold text-foreground block">Admin</span>
                admin / admin123
              </div>
              <div className="bg-muted/40 rounded p-1.5 border border-border">
                <span className="font-bold text-foreground block">Gestor</span>
                gestor / gestor123
              </div>
              <div className="bg-muted/40 rounded p-1.5 border border-border">
                <span className="font-bold text-foreground block">Técnico</span>
                tecnico / tecnico123
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
