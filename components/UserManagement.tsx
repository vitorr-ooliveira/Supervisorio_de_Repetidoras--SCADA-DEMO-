'use client';

import React, { useState } from 'react';
import { User, Plus, Edit2, Trash2, Search, X, Loader2, AlertCircle, ShieldCheck, HelpCircle, Hammer } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  role: 'admin' | 'gestor' | 'tecnico';
  email?: string;
}

interface UserManagementProps {
  initialUsers: UserData[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Notification states
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dialog/Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'gestor' | 'tecnico'>('tecnico');

  const resetForm = () => {
    setFormUsername('');
    setFormPassword('');
    setFormEmail('');
    setFormRole('tecnico');
    setEditingUser(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserData) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormPassword(''); // Senha vazia significa que não será alterada
    setFormEmail(user.email || '');
    setFormRole(user.role);
    setIsModalOpen(true);
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    if (type === 'success') {
      setSuccessMsg(text);
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(text);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (username === 'admin') {
      showNotification('error', 'O administrador padrão não pode ser removido.');
      return;
    }

    if (!confirm(`Deseja realmente remover o usuário "${username}"?`)) return;

    setDeletingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('success', 'Usuário removido com sucesso.');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    if (!formUsername || (!editingUser && !formPassword)) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      setSubmitting(false);
      return;
    }

    const payload = {
      id: editingUser?.id,
      username: formUsername,
      role: formRole,
      password: formPassword || undefined,
      email: formEmail || undefined,
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = { ...payload, id: payload.id || `mock-${Date.now()}` } as any;

      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === data.id ? data : u));
        showNotification('success', `Usuário "${formUsername}" atualizado.`);
      } else {
        setUsers(prev => [...prev, data]);
        showNotification('success', `Usuário "${formUsername}" cadastrado com sucesso.`);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter list
  const filtered = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase());
    if (filterRole === 'admin' && u.role !== 'admin') return false;
    if (filterRole === 'gestor' && u.role !== 'gestor') return false;
    if (filterRole === 'tecnico' && u.role !== 'tecnico') return false;
    return matchesSearch;
  });

  const roleIcons = {
    admin: ShieldCheck,
    gestor: Hammer,
    tecnico: HelpCircle,
  };

  const roleLabels = {
    admin: 'Administrador',
    gestor: 'Gestor',
    tecnico: 'Técnico',
  };

  const roleColors = {
    admin: 'bg-red-500/10 text-red-400 border border-red-500/20',
    gestor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    tecnico: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl text-emerald-400 text-sm shadow-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckIcon className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/25 p-4 rounded-xl text-rose-400 text-sm shadow-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground mt-1">Configure as permissões de acesso da planta industrial.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Usuário
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass rounded-xl p-4 border border-border flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute inset-y-0 left-3 h-5 w-5 text-muted-foreground flex items-center pointer-events-none self-center" style={{ top: '30%' }} />
          <input
            type="text"
            placeholder="Buscar usuário por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm placeholder-muted-foreground text-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setFilterRole('all')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterRole === 'all'
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterRole('admin')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterRole === 'admin'
                ? 'bg-red-500/10 border-red-500/25 text-red-500'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Administrador
          </button>
          <button
            onClick={() => setFilterRole('gestor')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterRole === 'gestor'
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Gestor
          </button>
          <button
            onClick={() => setFilterRole('tecnico')}
            className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterRole === 'tecnico'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Técnico
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-2xl border border-border p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold">
                <th className="pb-3">Usuário</th>
                <th className="pb-3">E-mail</th>
                <th className="pb-3">Perfil / Cargo</th>
                <th className="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filtered.map((user) => {
                const Icon = roleIcons[user.role];
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 font-semibold text-foreground flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-muted/50 border border-border flex items-center justify-center text-xs text-foreground">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      {user.username}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {user.email || <span className="italic opacity-50">Não informado</span>}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-[0.95]"
                          title="Editar permissão"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {user.username !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            disabled={deletingId === user.id}
                            className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 hover:bg-rose-500/20 hover:text-rose-700 transition-all active:scale-[0.95] disabled:opacity-50"
                            title="Remover usuário"
                          >
                            {deletingId === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    Nenhum usuário cadastrado com estes critérios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl border border-border overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Nome de Usuário *</label>
                <input
                  type="text"
                  required
                  disabled={editingUser?.username === 'admin'}
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="Ex: joao.tecnico"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Cargo / Permissão de Acesso *
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  disabled={editingUser?.username === 'admin'}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
                >
                  <option value="tecnico">Técnico (Apenas Visualização)</option>
                  <option value="gestor">Gestor (Visualização e Reiniciar)</option>
                  <option value="admin">Administrador (Controle Total)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Ex: joao@empresa.com.br"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Senha {editingUser ? '(Deixe em branco para manter)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
