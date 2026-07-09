'use client';

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

interface DashboardChartsProps {
  energyData: { date: string; gerada: number; consumida: number }[];
  deviceStats: { online: number; offline: number };
  alertStats: { naoReconhecidos: number; reconhecidos: number; resolvidos: number };
}

const PIE_COLORS = ['#10b981', '#f43f5e']; // Emerald for Online, Rose for Offline
const BAR_COLORS = {
  naoReconhecidos: '#f43f5e', // Rose
  reconhecidos: '#f59e0b',    // Amber
  resolvidos: '#10b981'       // Emerald
};

export default function DashboardCharts({ energyData, deviceStats, alertStats }: DashboardChartsProps) {
  const pieData = [
    { name: 'Online', value: deviceStats.online },
    { name: 'Offline', value: deviceStats.offline }
  ];

  const barData = [
    {
      name: 'Status',
      'Não Reconhecido': alertStats.naoReconhecidos,
      'Reconhecido': alertStats.reconhecidos,
      'Resolvido': alertStats.resolvidos
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg border shadow-xl bg-background/95 backdrop-blur-md">
          <p className="text-xs font-bold text-muted-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-sm font-semibold" style={{ color: entry.color }}>
                {entry.name}: {entry.value.toLocaleString()} {entry.unit || ''}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Gráfico 1: Balanço Energético Global */}
      <div className="lg:col-span-2 glass p-5 rounded-2xl border flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-foreground">Balanço Energético (7 dias)</h2>
        </div>
        <div className="h-[250px] w-full mt-2">
          {energyData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Sem dados para exibir</div>
          ) : (
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={energyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGerada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConsumida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                <XAxis dataKey="date" stroke="currentColor" className="text-muted-foreground text-xs font-semibold" tickMargin={10} />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs font-semibold" tickFormatter={(value) => `${value}`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="gerada" name="Gerada" unit="Wh" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGerada)" />
                <Area type="monotone" dataKey="consumida" name="Consumida" unit="Wh" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorConsumida)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráfico 2 e 3: Status da Rede e Alertas */}
      <div className="flex flex-col gap-6">
        
        {/* Status da Rede */}
        <div className="glass p-5 rounded-2xl border flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-500" />
              Status da Rede
            </h2>
          </div>
          <div className="h-[120px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-foreground leading-none">{deviceStats.online + deviceStats.offline}</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Total</span>
            </div>
          </div>
        </div>

        {/* Status dos Alertas */}
        <div className="glass p-5 rounded-2xl border flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-bold tracking-tight text-foreground">Quadro de Alertas</h2>
          </div>
          <div className="h-[120px] w-full mt-2">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" className="text-border" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="Não Reconhecido" stackId="a" fill={BAR_COLORS.naoReconhecidos} radius={[4, 0, 0, 4]} barSize={24} />
                <Bar dataKey="Reconhecido" stackId="a" fill={BAR_COLORS.reconhecidos} barSize={24} />
                <Bar dataKey="Resolvido" stackId="a" fill={BAR_COLORS.resolvidos} radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center px-1 mt-1">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"/> <span className="text-[10px] font-semibold text-muted-foreground">Ñ. Rec</span></div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"/> <span className="text-[10px] font-semibold text-muted-foreground">Rec</span></div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-[10px] font-semibold text-muted-foreground">Resol</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}
