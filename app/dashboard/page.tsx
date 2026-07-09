import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import DashboardCharts from "@/components/DashboardCharts";
import {
  Battery,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { formatDateBR } from "@/lib/format";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const repetidoras = await db.getRepetidoras();
  const alertas = await db.getAlertas();
  const energyData = await db.getGlobalEnergyHistory(7);

  const total = repetidoras.length;
  const online = repetidoras.filter((b) => b.status === "online").length;
  const offline = total - online;

  const deviceStats = { online, offline };
  const alertStats = {
    naoReconhecidos: alertas.filter(a => a.status === 'NAO_RECONHECIDO').length,
    reconhecidos: alertas.filter(a => a.status === 'RECONHECIDO').length,
    resolvidos: alertas.filter(a => a.status === 'RESOLVIDO').length,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={session} />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Dashboard do Supervisório
            </h1>
            <p className="text-muted-foreground mt-1">
              Olá,{" "}
              <span className="text-foreground font-semibold">
                {session.username}
              </span>
              . Monitoramento em tempo real dos controladores de energia.
            </p>
          </div>
          {/* <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
            <Server className="h-4 w-4 text-primary" />
            <span>Servidor Central:</span>
            <span className="text-emerald-600 font-bold">ONLINE</span>
          </div> */}
        </div>

        {/* Status Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total */}
          <div className="glass rounded-2xl p-6 border border-border shadow-lg relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Total de Repetidoras
              </span>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Battery className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-extrabold text-foreground">
                {total}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Controladores cadastrados no sistema
              </p>
            </div>
          </div>

          {/* Card 2: Online */}
          <div className="glass rounded-2xl p-6 border border-border shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Repetidoras Ativas
              </span>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-extrabold text-foreground">
                {online}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Comunicando normalmente por ping/MQTT
              </p>
            </div>
          </div>

          {/* Card 3: Offline */}
          <div className="glass rounded-2xl p-6 border border-border shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition-all">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-rose-500/5 blur-xl group-hover:bg-rose-500/10 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Repetidoras Inativas
              </span>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-extrabold text-foreground">
                {offline}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Requer atenção imediata da equipe técnica
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Executive Charts */}
        <DashboardCharts energyData={energyData} deviceStats={deviceStats} alertStats={alertStats} />

        {/* Detailed Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Monitor Status table */}
          <div className={`${session.role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} glass rounded-2xl border border-border p-6 space-y-4`}>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Resumo Operacional das Repetidoras
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold">
                    <th className="pb-3">Repetidora</th>
                    <th className="pb-3">Endereço IP</th>
                    <th className="pb-3">Localização</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Último Reinício</th>
                    <th className="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {repetidoras.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 font-semibold text-foreground">
                        {b.name}
                      </td>
                      <td className="py-4 font-mono text-xs text-muted-foreground">
                        {b.lastIp}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {b.location}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            b.status === "online"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${b.status === "online" ? "bg-emerald-500" : "bg-rose-500 animate-ping"}`}
                          />
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-muted-foreground">
                        {formatDateBR(b.lastRestart)}
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/repetidoras/${b.id}/telemetria`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20 hover:text-blue-500 transition-all"
                        >
                          <Activity className="h-3 w-3" />
                          Telemetria
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {repetidoras.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Nenhuma repetidora cadastrada no supervisório.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Informational sidebar */}
          {session.role === 'admin' && (
            <div className="glass rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Regras e Acessos do Painel
              </h2>

              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  O supervisório atua conforme o perfil cadastrado no banco
                  central:
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 bg-muted/40 rounded-xl border border-border">
                    <span className="font-bold text-rose-600 text-xs uppercase block mb-1">
                      Perfil Administrador
                    </span>
                    Acesso total ao sistema, incluindo criação, edição e exclusão
                    de repetidoras e usuários, além de comandos de reinicialização.
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border">
                    <span className="font-bold text-amber-600 text-xs uppercase block mb-1">
                      Perfil Gestor
                    </span>
                    Visualização global de status e liberação do botão de
                    reinicialização para forçar reboot dos controladores.
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border">
                    <span className="font-bold text-emerald-600 text-xs uppercase block mb-1">
                      Perfil Técnico
                    </span>
                    Visualização somente leitura para auditorias simples e
                    conferência de logs na planta.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
