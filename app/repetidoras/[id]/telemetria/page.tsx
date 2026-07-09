import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { format, subMonths } from "date-fns";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import RepetidoraChargeWidget from "@/components/RepetidoraChargeWidget";
import TelemetryCharts from "@/components/TelemetryCharts";
import TelemetryFilter from "@/components/TelemetryFilter";
import TelemetryTableRow from "@/components/TelemetryTableRow";
import LastUpdateIndicator from "@/components/LastUpdateIndicator";
import RestartRepetidoraButton from "@/components/RestartRepetidoraButton";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Zap,
  Thermometer,
  ShieldAlert,
  Cpu,
  Activity,
  Flame,
  BatteryFull,
  ZapOff,
} from "lucide-react";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ from?: string; to?: string }>;

export async function generateStaticParams() {
  const repetidoras = await db.getRepetidoras();
  return repetidoras.map((r) => ({
    id: r.id,
  }));
}

export default async function TelemetriaPage({
  params,
}: {
  params: Params;
}) {
  const session = await getSession();
  const { id } = await params;

  if (!session) {
    redirect("/login");
  }

  const from = undefined;
  const to = undefined;

  // Obter detalhes da repetidora
  const repetidora = await db.getRepetidoraById(id);
  if (!repetidora) {
    redirect("/dashboard");
  }

  // Obter histórico de telemetria com filtro de datas
  const history = await db.getTelemetryHistory(repetidora.id, from, to);

  // // exibir o history ordenado por dataHoraControladora
  // console.log(
  //   "Historico: ",
  //   history.sort((a, b) =>
  //     b.dataHoraControladora!.localeCompare(a.dataHoraControladora!),
  //   ),
  // );

  // Latest telemetry details for current status display
  const latest = history.length > 0 ? history[0] : null;

  // Totalizadores de energia no período filtrado
  const totalGerada = history.reduce(
    (sum, item) => sum + (item.energiaGeradaHora || 0),
    0,
  );
  const totalConsumida = history.reduce(
    (sum, item) => sum + (item.energiaConsumidaHora || 0),
    0,
  );

  const canRestart = session.role === "admin" || session.role === "gestor";

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <Navbar user={session} />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/repetidoras"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar às Repetidoras
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              {repetidora.name}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  repetidora.status === "offline"
                    ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                }`}
              >
                {repetidora.status}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Localização:{" "}
              <span className="text-foreground font-semibold">
                {repetidora.location}
              </span>{" "}
              | IP:{" "}
              <span className="font-mono text-foreground font-semibold">
                {repetidora.lastIp}
              </span>
            </p>
          </div>

          {/* Indicador de última atualização + filtro + botão de restart */}
          <div className="flex flex-col items-end gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <LastUpdateIndicator lastDate={latest?.timestampEvento} />
              {canRestart && (
                <RestartRepetidoraButton
                  repetidoraId={repetidora.id}
                  repetidoraName={repetidora.name}
                />
              )}
            </div>
            <Suspense fallback={<div className="h-10 w-32 bg-muted rounded-xl animate-pulse"></div>}>
              <TelemetryFilter />
            </Suspense>
          </div>
        </div>

        {/* Top Section: Energy Totals */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight text-foreground/80 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Total de energia gerada / consumida
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <BatteryFull className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/80">
                  Gerada (Período)
                </p>
                <p className="text-xl font-black text-emerald-500">
                  {totalGerada.toFixed(2)} Wh
                </p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
                <ZapOff className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600/80">
                  Consumida (Período)
                </p>
                <p className="text-xl font-black text-rose-500">
                  {totalConsumida.toFixed(2)} Wh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Latest Telemetry Stats */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight text-foreground/80 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Últimas Leituras Registradas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tensão Entrada
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.tensaoInput != null
                    ? `${latest.tensaoInput.toFixed(2)} V`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tensão Repetidora
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.tensaoRepetidora != null
                    ? `${latest.tensaoRepetidora.toFixed(2)} V`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Corrente Placa
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.correntePlacaSolar != null
                    ? `${latest.correntePlacaSolar.toFixed(2)} A`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
                <Thermometer className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Temperatura
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.temperaturaRepetidora != null
                    ? `${latest.temperaturaRepetidora.toFixed(1)} °C`
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* New Payload Cards */}
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tensão Carga
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.tensaoCarga != null
                    ? `${latest.tensaoCarga.toFixed(2)} V`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 text-orange-600 rounded-xl">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Corrente Carga
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.correnteCarga != null
                    ? `${latest.correnteCarga.toFixed(2)} A`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Potência Repetidora
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.potenciaRepetidora != null
                    ? `${latest.potenciaRepetidora.toFixed(2)} W`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-border flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-600 rounded-xl">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Temp. Controladora
                </p>
                <p className="text-xl font-black text-foreground">
                  {latest?.temperaturaControladora != null
                    ? `${latest.temperaturaControladora.toFixed(1)} °C`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Center Grid: Repetidora level and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RepetidoraChargeWidget
              capacity={latest?.capacidadeRepetidora}
              isCharging={latest?.energizado}
              isOffline={repetidora.status === "offline"}
            />
          </div>
          <div className="lg:col-span-2">
            <TelemetryCharts data={history} />
          </div>
        </div>

        {/* Detailed History Table — agora usando TelemetryTableRow */}
        <div className="glass rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Tabela de Registros
            </h3>
            <span className="text-xs text-muted-foreground">
              {history.length} telemetrias listadas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Data/Hora</th>
                  <th className="px-6 py-3.5">Energizado</th>
                  <th className="px-6 py-3.5">V. Entrada</th>
                  <th className="px-6 py-3.5">V. Repetidora</th>
                  <th className="px-6 py-3.5">Carga %</th>
                  <th className="px-6 py-3.5">Corrente Placa</th>
                  <th className="px-6 py-3.5">Temperatura</th>
                  <th className="px-6 py-3.5">V. Carga</th>
                  <th className="px-6 py-3.5">A. Carga</th>
                  <th className="px-6 py-3.5">W. Repetidora</th>
                  <th className="px-6 py-3.5">T. Controladora</th>
                  <th className="px-6 py-3.5">Gerada (Wh)</th>
                  <th className="px-6 py-3.5">Consumida (Wh)</th>
                  <th className="px-6 py-3.5">Data/Hora Controladora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {history.map((t) => (
                  <TelemetryTableRow key={t.id} telemetria={t} />
                ))}

                {history.length === 0 && (
                  <tr>
                    <td
                      colSpan={14}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      Nenhum registro de telemetria recebido neste período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
