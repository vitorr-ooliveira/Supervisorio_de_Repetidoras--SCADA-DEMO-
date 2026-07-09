'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ShieldAlert, CheckCircle, Loader2, Search } from 'lucide-react';

interface AlertManagementProps {
  userId: string;
  role: string;
}

export default function AlertManagement({ userId, role }: AlertManagementProps) {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchAlertas = async () => {
    try {
      // Mock for static demo
      setAlertas([
        { id: 'a1', tipoAlerta: 'BATERIA_BAIXA', repetidoraId: 'Repetidora Central', mensagem: 'Tensão da bateria abaixo do limite (48.1V)', status: 'NAO_RECONHECIDO', dataCriacao: new Date().toLocaleString() }
      ]);
    } catch (err) {
      toast.error('Erro ao buscar alertas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Alerta marcado como ${status.replace('_', ' ')}`);
      setAlertas(prev => prev.map(a => a.id === id ? { ...a, status, dataResolucao: status === 'RESOLVIDO' ? new Date().toLocaleString() : undefined } : a));
      window.dispatchEvent(new Event('alertStatusChanged'));
    } catch (err) {
      toast.error('Erro de rede.');
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const filteredAlertas = alertas.filter(a => {
    const matchesSearch = 
      a.tipoAlerta.toLowerCase().includes(search.toLowerCase()) || 
      a.repetidoraId.toLowerCase().includes(search.toLowerCase()) ||
      a.mensagem.toLowerCase().includes(search.toLowerCase());
      
    if (filterStatus === 'nao_reconhecidos' && a.status !== 'NAO_RECONHECIDO') return false;
    if (filterStatus === 'reconhecidos' && a.status !== 'RECONHECIDO') return false;
    if (filterStatus === 'resolvidos' && a.status !== 'RESOLVIDO') return false;
    
    return matchesSearch;
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando alertas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Search/Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gerenciamento de Alertas</h1>
          <p className="text-muted-foreground mt-1">Reconheça e resolva incidentes da planta.</p>
        </div>
      </div>

      <div className="glass rounded-xl p-4 border border-border flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute inset-y-0 left-3 h-5 w-5 text-muted-foreground flex items-center pointer-events-none self-center" style={{ top: '30%' }} />
          <input
            type="text"
            placeholder="Buscar por tipo, repetidora ou mensagem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm placeholder-muted-foreground text-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === 'all'
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus('nao_reconhecidos')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === 'nao_reconhecidos'
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-500'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Não Rec.
          </button>
          <button
            onClick={() => setFilterStatus('reconhecidos')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === 'reconhecidos'
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Reconhecidos
          </button>
          <button
            onClick={() => setFilterStatus('resolvidos')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === 'resolvidos'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Resolvidos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlertas.map(a => (
          <div key={a.id} className={`glass p-5 rounded-2xl border flex flex-col gap-4 ${a.status === 'NAO_RECONHECIDO' ? 'border-rose-500/50 bg-rose-500/5' : a.status === 'RECONHECIDO' ? 'border-amber-500/50 bg-amber-500/5' : 'border-emerald-500/50 bg-emerald-500/5'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-foreground flex items-center gap-2">
                  <ShieldAlert className={`h-4 w-4 ${a.status === 'NAO_RECONHECIDO' ? 'text-rose-500' : a.status === 'RECONHECIDO' ? 'text-amber-500' : 'text-emerald-500'}`} />
                  {a.tipoAlerta}
                </h3>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
                  Repetidora: {a.repetidoraId}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Criado em: {a.dataCriacao}
                </p>
                {a.dataResolucao && (
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold">
                    Resolvido em: {a.dataResolucao}
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-sm text-foreground bg-background/50 p-3 rounded-xl border border-border">
              {a.mensagem}
            </p>
            
            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                {a.status === 'NAO_RECONHECIDO' && (
                  <button 
                    onClick={() => handleUpdateStatus(a.id, 'RECONHECIDO')} 
                    disabled={processingIds.includes(a.id)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingIds.includes(a.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reconhecer'}
                  </button>
                )}
                {a.status === 'RECONHECIDO' && (
                  <button 
                    onClick={() => handleUpdateStatus(a.id, 'RESOLVIDO')} 
                    disabled={processingIds.includes(a.id)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingIds.includes(a.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Resolver'}
                  </button>
                )}
                {a.status === 'RESOLVIDO' && (
                  <div className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-500 text-center flex items-center justify-center gap-1 border border-emerald-500/20">
                    <CheckCircle className="h-4 w-4" /> Resolvido
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredAlertas.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground glass rounded-xl border border-border">
            Nenhum alerta encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
