'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/**
 * Interface para um ponto de dado no gráfico.
 * Campos numéricos usam `number | null` para representar
 * dados faltantes (ex: minuto sem telemetria).
 */
interface TelemetryDataPoint {
  /** Horário formatado para o eixo X (ex: "14:05", "14:10") */
  time: string;
  /** Tensão de entrada em Volts (null se não houver dado) */
  tensaoInput: number | null;
  /** Tensão da repetidora em Volts (null se não houver dado) */
  tensaoRepetidora: number | null;
  /** Corrente da placa solar em Ampères */
  correntePlacaSolar?: number | null;
  /** Temperatura da repetidora em °C */
  temperaturaRepetidora?: number | null;
}

interface MonitoringChartProps {
  data: TelemetryDataPoint[];
}

/**
 * Gráfico de monitoramento usando Recharts com as seguintes melhorias:
 *
 * 1. **Eixo X sem rótulos encavalados**: usa `interval="preserveStartEnd"`
 *    com `angle` e `tickFormatter` para rotacionar/formatar os ticks.
 *
 * 2. **Valores nulos não despencam para zero**: cada `<Line>` usa
 *    `connectNulls={false}` para interromper a linha quando faltar um dado
 *    naquele minuto, em vez de desenhar uma descida abrupta até 0.
 *
 * @example
 * ```tsx
 * const data: TelemetryDataPoint[] = [
 *   { time: '14:00', tensaoInput: 13.5, tensaoRepetidora: 12.8 },
 *   { time: '14:01', tensaoInput: null,  tensaoRepetidora: null },  // dado faltante
 *   { time: '14:02', tensaoInput: 13.6, tensaoRepetidora: 12.9 },
 * ];
 *
 * <MonitoringChart data={data} />
 * ```
 */
export default function MonitoringChart({ data }: MonitoringChartProps) {
  return (
    <div className="glass p-6 rounded-2xl border border-border space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Monitoramento de Tensão (Recharts)
      </h3>

      <ResponsiveContainer width="99%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
        >
          {/* Grade de fundo sutil */}
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          {/* =========================================================
           * EIXO X — Rótulos de horário
           *
           * - interval="preserveStartEnd" → garante que o primeiro e
           *   último tick sempre apareçam, distribuindo os demais de
           *   modo a evitar sobreposição.
           *
           * - angle={-35} + textAnchor="end" → rotaciona levemente
           *   os rótulos para não colidirem em telas menores.
           *
           * - tickFormatter → permite reformatar o horário se necessário
           *   (ex: remover segundos, extrair só HH:mm).
           *
           * - minTickGap={40} → distância mínima em pixels entre ticks,
           *   filtrando automaticamente rótulos em excesso.
           * ========================================================= */}
          <XAxis
            dataKey="time"
            tick={{
              fontSize: 11,
              fill: 'hsl(var(--muted-foreground))',
              fontFamily: 'monospace',
            }}
            angle={-35}
            textAnchor="end"
            interval="preserveStartEnd"
            minTickGap={40}
            tickFormatter={(value: string) => {
              // Extrai somente HH:mm caso venha com segundos ou data completa
              const parts = value.split(':');
              return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : value;
            }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />

          {/* Eixo Y */}
          <YAxis
            tick={{
              fontSize: 11,
              fill: 'hsl(var(--muted-foreground))',
              fontFamily: 'monospace',
            }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
            width={50}
          />

          {/* Tooltip customizado com estilo light */}
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'hsl(var(--foreground))',
              backdropFilter: 'blur(8px)',
            }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}
            itemStyle={{ fontWeight: 600 }}
          />

          {/* Legenda */}
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))',
              paddingTop: '12px',
            }}
          />

          {/* =========================================================
           * LINHAS — connectNulls={false}
           *
           * Quando um ponto de dado tem o valor `null`, a linha é
           * interrompida naquele segmento em vez de desenhar uma
           * queda abrupta até zero.
           *
           * Para que isso funcione, os campos DEVEM estar como `null`
           * (e não como `0` ou `undefined`). Certifique-se de mapear
           * os dados corretamente antes de passar ao gráfico.
           * ========================================================= */}
          <Line
            type="monotone"
            dataKey="tensaoInput"
            name="Tensão Entrada (V)"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            connectNulls={false}
          />

          <Line
            type="monotone"
            dataKey="tensaoRepetidora"
            name="Tensão Repetidora (V)"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
