'use client';

import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';

interface RepetidoraChargeWidgetProps {
  capacity?: number;
  isCharging?: boolean;
  isOffline?: boolean;
}

export default function RepetidoraChargeWidget({ capacity = 0, isCharging = false, isOffline = false }: RepetidoraChargeWidgetProps) {
  // Determine color based on capacity
  let colorClass = 'bg-rose-500 shadow-rose-500/50';
  let borderClass = 'border-rose-500/30';
  let textClass = 'text-rose-400';
  let bgGradient = 'from-rose-600 to-rose-400';

  if (isOffline) {
    colorClass = 'bg-slate-500 shadow-slate-500/50';
    borderClass = 'border-slate-500/30';
    textClass = 'text-slate-400';
    bgGradient = 'from-slate-600 to-slate-400';
  } else if (capacity >= 70) {
    colorClass = 'bg-emerald-500 shadow-emerald-500/50';
    borderClass = 'border-emerald-500/30';
    textClass = 'text-emerald-400';
    bgGradient = 'from-emerald-600 to-emerald-400';
  } else if (capacity >= 30) {
    colorClass = 'bg-amber-500 shadow-amber-500/50';
    borderClass = 'border-amber-500/30';
    textClass = 'text-amber-400';
    bgGradient = 'from-amber-600 to-amber-400';
  }

  return (
    <div className="glass p-6 rounded-2xl border border-border flex flex-col items-center justify-center space-y-4 relative overflow-hidden h-full">
      {/* Background glow */}
      <div className={`absolute -inset-10 bg-gradient-to-r opacity-5 blur-2xl pointer-events-none rounded-full ${isOffline ? 'from-slate-500 to-slate-400' : isCharging ? 'from-yellow-500 to-amber-500 opacity-10' : capacity >= 70 ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-amber-500'}`} />

      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground self-start">Nível de Carga</h3>
      
      <div className="flex flex-col items-center justify-center py-6 w-full">
        {/* Repetidora Container */}
        <div className="relative w-28 h-52 border-4 border-slate-300 rounded-3xl p-1.5 flex items-end justify-start bg-slate-100 shadow-inner">
          {/* Repetidora Cap */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-300 rounded-t-lg" />
          
          {/* Repetidora Fill level */}
          <div 
            className={`w-full rounded-2xl bg-gradient-to-t ${bgGradient} transition-all duration-1000 ease-out shadow-lg relative overflow-hidden`}
            style={{ height: `${Math.max(4, Math.min(100, capacity))}%` }}
          >
            {/* Wave overlay animation when charging */}
            {!isOffline && isCharging && (
              <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite] mix-blend-overlay" />
            )}
          </div>

          {/* Center value overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {isOffline ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  OFFLINE
                </span>
              </div>
            ) : isCharging ? (
              <div className="flex flex-col items-center justify-center space-y-1">
                <Zap className="h-8 w-8 text-yellow-400 fill-yellow-400 animate-bounce" />
                <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {capacity}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] animate-pulse">
                  Carregando
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {capacity < 20 && (
                  <AlertTriangle className="h-6 w-6 text-rose-500 mb-1 animate-pulse" />
                )}
                <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {capacity}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center border-t border-border pt-4">
        <span className={`text-sm font-semibold ${textClass}`}>
          {isOffline ? 'Repetidora Desconectada' : isCharging ? 'Alimentação Externa Ativa' : capacity < 20 ? 'Repetidora Crítica' : 'Operando em Standby'}
        </span>
      </div>
    </div>
  );
}
