'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, subMonths } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';

export default function TelemetryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  const handlePreset = (months: number) => {
    const to = new Date();
    const from = subMonths(to, months);
    updateUrl(from, to);
    setIsOpen(false);
  };

  const updateUrl = (from?: Date, to?: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    if (from) {
      params.set('from', format(from, 'yyyy-MM-dd'));
    } else {
      params.delete('from');
    }
    
    if (to) {
      params.set('to', format(to, 'yyyy-MM-dd'));
    } else {
      params.delete('to');
    }
    
    router.push(`?${params.toString()}`);
  };

  const handleCustomApply = () => {
    updateUrl(dateRange.from, dateRange.to);
    setIsOpen(false);
  };

  const getActivePreset = () => {
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');
    
    if (!fromStr || !toStr) return null;
    
    const from = new Date(fromStr + 'T12:00:00Z');
    const to = new Date(toStr + 'T12:00:00Z');
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 28 && diffDays <= 32) return 1;
    if (diffDays >= 175 && diffDays <= 185) return 6;
    if (diffDays >= 360 && diffDays <= 370) return 12;
    return 'custom';
  };

  const activePreset = getActivePreset();

  const getFilterLabel = () => {
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');
    
    if (!fromStr || !toStr) return 'Último Mês'; // Padrão
    
    if (activePreset === 1) return 'Último Mês';
    if (activePreset === 6) return 'Últimos 6 Meses';
    if (activePreset === 12) return 'Últimos 12 Meses';
    
    const from = new Date(fromStr + 'T12:00:00Z');
    const to = new Date(toStr + 'T12:00:00Z');
    return `${format(from, 'dd/MM/yyyy')} - ${format(to, 'dd/MM/yyyy')}`;
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
      >
        <CalendarIcon className="w-4 h-4" />
        {getFilterLabel()}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 p-4 bg-card border border-border rounded-xl shadow-xl flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2 min-w-[170px]">
            <button 
              onClick={() => handlePreset(1)} 
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${activePreset === 1 ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
            >
              Último Mês
              {activePreset === 1 && <Check className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handlePreset(6)} 
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${activePreset === 6 ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
            >
              Últimos 6 Meses
              {activePreset === 6 && <Check className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handlePreset(12)} 
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${activePreset === 12 ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
            >
              Últimos 12 Meses
              {activePreset === 12 && <Check className="w-4 h-4" />}
            </button>
            <hr className="border-border my-1" />
            <span className="text-xs font-bold text-muted-foreground uppercase px-3 mt-1">Customizado</span>
            {dateRange.from && dateRange.to && (
              <button onClick={handleCustomApply} className="mt-2 w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-bold">
                Aplicar
              </button>
            )}
          </div>
          
          <div className="border-l border-border pl-4">
            <DayPicker
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                setDateRange({ from: range?.from, to: range?.to });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
