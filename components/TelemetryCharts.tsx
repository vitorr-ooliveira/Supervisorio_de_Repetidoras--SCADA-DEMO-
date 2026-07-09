'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TelemetryPoint {
  timestampEvento: string;
  tensaoInput?: number;
  tensaoRepetidora?: number;
  correntePlacaSolar?: number;
  temperaturaRepetidora?: number;
  tensaoCarga?: number;
  correnteCarga?: number;
  potenciaRepetidora?: number;
  temperaturaControladora?: number;
  energiaGeradaHora?: number;
  energiaConsumidaHora?: number;
}

interface TelemetryChartsProps {
  data: TelemetryPoint[];
}

export default function TelemetryCharts({ data }: TelemetryChartsProps) {
  const [activeTab, setActiveTab] = useState<'voltage' | 'current' | 'temperature' | 'power' | 'energy'>('voltage');

  if (data.length === 0) {
    return (
      <div className="glass p-8 rounded-2xl border border-white/10 flex items-center justify-center text-muted-foreground h-96">
        Nenhum dado de telemetria disponível para gerar gráficos neste período.
      </div>
    );
  }

  // Pre-process data for gaps and date formatting
  const chartData = [...data].reverse().map(d => {
    let formattedDate = d.timestampEvento;
    try {
      const date = parseISO(d.timestampEvento);
      if (!isNaN(date.getTime())) {
        formattedDate = format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      } else {
         const parts = d.timestampEvento.split(', ');
         if(parts.length === 2) formattedDate = parts[0] + ' ' + parts[1].substring(0, 5);
      }
    } catch (e) {}
    return {
      ...d,
      formattedDate,
      tensaoInput: d.tensaoInput || null,
      tensaoRepetidora: d.tensaoRepetidora || null,
      correntePlacaSolar: d.correntePlacaSolar || null,
      temperaturaRepetidora: d.temperaturaRepetidora || null,
      tensaoCarga: d.tensaoCarga || null,
      correnteCarga: d.correnteCarga || null,
      potenciaRepetidora: d.potenciaRepetidora || null,
      temperaturaControladora: d.temperaturaControladora || null,
      energiaGeradaHora: d.energiaGeradaHora || null,
      energiaConsumidaHora: d.energiaConsumidaHora || null,
    };
  });

  return (
    <div className="glass p-6 rounded-2xl border border-border space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Monitoramento de Sinais</h3>
          <p className="text-xs text-muted-foreground">Evolução temporal das medições</p>
        </div>
        
        <div className="flex flex-wrap bg-muted/40 border border-border rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab('voltage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'voltage' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tensão
          </button>
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'current' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Corrente
          </button>
          <button
            onClick={() => setActiveTab('temperature')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'temperature' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Temperatura
          </button>
          <button
            onClick={() => setActiveTab('power')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'power' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Potência
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'energy' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Energia
          </button>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="99%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', fontSize: '12px' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            {activeTab === 'voltage' && (
              <>
                <Line connectNulls={false} type="monotone" dataKey="tensaoInput" name="Tensão Placa Solar (V)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                <Line connectNulls={false} type="monotone" dataKey="tensaoRepetidora" name="Tensão Repetidora (V)" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                <Line connectNulls={false} type="monotone" dataKey="tensaoCarga" name="Tensão Carga (V)" stroke="#a855f7" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
              </>
            )}
            
            {activeTab === 'current' && (
              <>
                <Line connectNulls={false} type="monotone" dataKey="correntePlacaSolar" name="Corrente Placa (A)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                <Line connectNulls={false} type="monotone" dataKey="correnteCarga" name="Corrente Carga (A)" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
              </>
            )}
            
            {activeTab === 'temperature' && (
              <>
                <Line connectNulls={false} type="monotone" dataKey="temperaturaRepetidora" name="Temp Repetidora (°C)" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                <Line connectNulls={false} type="monotone" dataKey="temperaturaControladora" name="Temp Controladora (°C)" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
              </>
            )}

            {activeTab === 'power' && (
              <Line connectNulls={false} type="monotone" dataKey="potenciaRepetidora" name="Potência Repetidora (W)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
            )}

            {activeTab === 'energy' && (
              <>
                <Line connectNulls={true} type="monotone" dataKey="energiaGeradaHora" name="Gerada (Wh)" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                <Line connectNulls={true} type="monotone" dataKey="energiaConsumidaHora" name="Consumida (Wh)" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
