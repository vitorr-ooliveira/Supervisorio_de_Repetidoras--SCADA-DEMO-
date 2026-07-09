'use client';

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Tipo representando um registro de telemetria.
 * Adapte os campos conforme sua interface real.
 */
interface TelemetryRecord {
  id: string | number;
  timestampEvento: string;
  energizado: boolean;
  tensaoInput?: number | null;
  tensaoRepetidora?: number | null;
  capacidadeRepetidora?: number | null;
  correntePlacaSolar?: number | null;
  temperaturaRepetidora?: number | null;
  tensaoCarga?: number | null;
  correnteCarga?: number | null;
  potenciaRepetidora?: number | null;
  temperaturaControladora?: number | null;
  energiaGeradaHora?: number | null;
  energiaConsumidaHora?: number | null;
  dataHoraControladora?: string;
}

interface TelemetryTableRowProps {
  telemetria: TelemetryRecord;
}

/**
 * Componente de linha de tabela com formatação condicional.
 *
 * Se `telemetria.energizado` for `false`, aplica um fundo vermelho
 * translúcido e texto avermelhado usando Tailwind CSS para destacar
 * visualmente a falha de energização.
 *
 * @example
 * ```tsx
 * <table>
 *   <tbody>
 *     {history.map((t) => (
 *       <TelemetryTableRow key={t.id} telemetria={t} />
 *     ))}
 *   </tbody>
 * </table>
 * ```
 */
export default function TelemetryTableRow({ telemetria }: TelemetryTableRowProps) {
  const isDeenergized = !telemetria.energizado;

  return (
    <tr
      className={`
        transition-colors
        ${isDeenergized
          ? 'bg-rose-500/[0.05] text-rose-700 hover:bg-rose-500/[0.08]'
          : 'hover:bg-muted/50 text-foreground'
        }
      `}
    >
      <td className="px-6 py-3.5 text-foreground font-semibold">
        {telemetria.timestampEvento 
          ? format(new Date(telemetria.timestampEvento), 'dd/MM/yyyy, HH:mm:ss', { locale: ptBR })
          : '-'}
      </td>

      <td className="px-6 py-3.5">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            telemetria.energizado
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
          }`}
        >
          {/* Indicador pulsante quando desenergizado */}
          {isDeenergized && (
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          )}
          {telemetria.energizado ? 'Sim' : 'Não'}
        </span>
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.tensaoInput != null
          ? `${telemetria.tensaoInput.toFixed(2)} V`
          : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.tensaoRepetidora != null
          ? `${telemetria.tensaoRepetidora.toFixed(2)} V`
          : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.capacidadeRepetidora != null
          ? `${telemetria.capacidadeRepetidora}%`
          : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.correntePlacaSolar != null
          ? `${telemetria.correntePlacaSolar.toFixed(2)} A`
          : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.temperaturaRepetidora != null
          ? `${telemetria.temperaturaRepetidora.toFixed(1)} °C`
          : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.tensaoCarga != null ? `${telemetria.tensaoCarga.toFixed(2)} V` : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.correnteCarga != null ? `${telemetria.correnteCarga.toFixed(2)} A` : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.potenciaRepetidora != null ? `${telemetria.potenciaRepetidora.toFixed(2)} W` : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.temperaturaControladora != null ? `${telemetria.temperaturaControladora.toFixed(1)} °C` : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.energiaGeradaHora != null ? `${telemetria.energiaGeradaHora.toFixed(2)}` : '-'}
      </td>

      <td className="px-6 py-3.5 font-mono">
        {telemetria.energiaConsumidaHora != null ? `${telemetria.energiaConsumidaHora.toFixed(2)}` : '-'}
      </td>

      <td className="px-6 py-3.5 text-muted-foreground">
        {telemetria.dataHoraControladora 
          ? format(new Date(telemetria.dataHoraControladora), 'dd/MM/yyyy, HH:mm:ss', { locale: ptBR })
          : 'N/A'}
      </td>
    </tr>
  );
}
