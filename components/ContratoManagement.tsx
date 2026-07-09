'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, FileText, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ContratoManagement() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cif, setCif] = useState('');
  const [search, setSearch] = useState('');

  const fetchContratos = async () => {
    try {
      // Mock contracts for demo
      setContratos([
        { id: 'c1', nome: 'Contrato Alpha', cif: '12345', dataCriacao: new Date().toISOString(), repetidorasVinculados: 1 }
      ]);
    } catch (err) {
      toast.error('Erro ao buscar contratos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const openModal = (contrato?: any) => {
    if (contrato) {
      setEditingContrato(contrato);
      setNome(contrato.nome);
      setDescricao(contrato.descricao || '');
      setCif(contrato.cif || '');
    } else {
      setEditingContrato(null);
      setNome('');
      setDescricao('');
      setCif('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContrato(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      toast.error('O nome do contrato é obrigatório.');
      return;
    }
    if (cif) {
      const cifRegex = /^(\d{5}|\d{5}\.\d{2}|\d{2}\.\d{2}\.\d{2}\.\d{5}\.\d{2})$/;
      if (!cifRegex.test(cif)) {
        toast.error('O CIF informado é inválido. Padrões aceitos: 12345, 12345.12 ou 12.12.12.12345.12');
        return;
      }
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Contrato ${editingContrato ? 'atualizado' : 'cadastrado'} com sucesso!`);
      closeModal();
    } catch (err) {
      toast.error('Erro de rede.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este contrato?')) return;
    setDeletingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Contrato removido.');
      setContratos(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      toast.error('Erro de rede.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredContratos = contratos.filter(c => {
    const term = search.toLowerCase();
    return (
      c.nome.toLowerCase().includes(term) ||
      (c.descricao && c.descricao.toLowerCase().includes(term)) ||
      (c.cif && c.cif.toLowerCase().includes(term))
    );
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando contratos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gerenciamento de Contratos</h1>
          <p className="text-muted-foreground mt-1">Administre os contratos (CIF) das filiais.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Novo Contrato
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass rounded-xl p-4 border border-border flex items-center">
        <div className="relative w-full">
          <Search className="absolute inset-y-0 left-3 h-5 w-5 text-muted-foreground flex items-center pointer-events-none self-center" style={{ top: '30%' }} />
          <input
            type="text"
            placeholder="Buscar contrato por nome, CIF ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm placeholder-muted-foreground text-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContratos.map(c => (
          <div key={c.id} className="glass p-5 rounded-2xl border border-border flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground">{c.nome}</h3>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex flex-wrap gap-2 mt-1">
                    <span>Criado em: {new Date(c.dataCriacao).toLocaleDateString()}</span>
                    {c.cif && (
                      <>
                        <span>•</span>
                        <span className="text-primary font-bold">CIF: {c.cif}</span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-md mt-2">
                    {c.repetidorasVinculados || 0} {(c.repetidorasVinculados === 1) ? 'repetidora vinculada' : 'repetidoras vinculadas'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(c)} className="p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(c.id)} 
                  disabled={deletingId === c.id}
                  className="p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {c.descricao && (
              <p className="text-xs text-muted-foreground line-clamp-2">{c.descricao}</p>
            )}
          </div>
        ))}
        {filteredContratos.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground glass rounded-xl border border-border">
            Nenhum contrato encontrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {editingContrato ? 'Editar Contrato' : 'Cadastrar Contrato'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                  placeholder="Nome do cliente ou contrato"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Centro de Custo (CIF)</label>
                <input
                  type="text"
                  maxLength={17}
                  value={cif}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '');
                    if (v.length > 13) v = v.substring(0, 13);
                    let formatted = v;
                    if (v.length > 7) {
                      formatted = v.replace(/^(\d{2})(\d{0,2})(\d{0,2})(\d{0,5})(\d{0,2}).*/, (_, p1, p2, p3, p4, p5) => {
                        let res = p1;
                        if (p2) res += '.' + p2;
                        if (p3) res += '.' + p3;
                        if (p4) res += '.' + p4;
                        if (p5) res += '.' + p5;
                        return res;
                      });
                    } else if (v.length > 5) {
                      formatted = v.replace(/^(\d{5})(\d{0,2}).*/, '$1.$2');
                    }
                    setCif(formatted);
                  }}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all font-mono placeholder:font-sans"
                  placeholder="Ex: 12.12.12.12345.12"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all h-24 resize-none"
                  placeholder="Detalhes opcionais..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-bold hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
