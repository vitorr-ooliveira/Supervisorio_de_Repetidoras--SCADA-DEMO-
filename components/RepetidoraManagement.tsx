"use client";

import React, { useState } from "react";
import {
  Battery,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Globe,
  Loader2,
  AlertCircle,
  X,
  ShieldAlert,
  Activity,
  FileText,
} from "lucide-react";
import Link from "next/link";
import RestartRepetidoraButton from "./RestartRepetidoraButton";
import { formatDateBR } from "@/lib/format";

interface RepetidoraData {
  id: string;
  name: string;
  location: string;
  username: string;
  password?: string;
  lastIp: string;
  status: "online" | "offline";
  lastRestart?: string;
  tensaoMin?: number;
  tensaoMax?: number;
  correnteMin?: number;
  correnteMax?: number;
  tempMin?: number;
  tempMax?: number;
  tensaoInputMin?: number;
  tensaoInputMax?: number;
  tensaoCargaMin?: number;
  tensaoCargaMax?: number;
  correnteCargaMin?: number;
  correnteCargaMax?: number;
  potenciaBatMin?: number;
  potenciaBatMax?: number;
  tempControladoraMin?: number;
  tempControladoraMax?: number;
  contratoId?: string;
}

interface Contrato {
  id: string;
  nome: string;
}

interface RepetidoraManagementProps {
  initialRepetidoras: RepetidoraData[];
  contratos: Contrato[];
  userRole: "admin" | "gestor" | "tecnico";
}

export default function RepetidoraManagement({
  initialRepetidoras,
  contratos,
  userRole,
}: RepetidoraManagementProps) {
  const [repetidoras, setRepetidoras] =
    useState<RepetidoraData[]>(initialRepetidoras);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "online" | "offline"
  >("all");
  const [filterContrato, setFilterContrato] = useState<string>("all");

  // Actions states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dialog / Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepetidora, setEditingRepetidora] =
    useState<RepetidoraData | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formIp, setFormIp] = useState("");
  const [formUser, setFormUser] = useState("admin");
  const [formPassword, setFormPassword] = useState("Admin@123");
  const [formContratoId, setFormContratoId] = useState("");
  const [formTensaoMin, setFormTensaoMin] = useState("");
  const [formTensaoMax, setFormTensaoMax] = useState("");
  const [formCorrenteMin, setFormCorrenteMin] = useState("");
  const [formCorrenteMax, setFormCorrenteMax] = useState("");
  const [formTempMin, setFormTempMin] = useState("");
  const [formTempMax, setFormTempMax] = useState("");
  const [formTensaoInputMin, setFormTensaoInputMin] = useState("");
  const [formTensaoInputMax, setFormTensaoInputMax] = useState("");
  const [formTensaoCargaMin, setFormTensaoCargaMin] = useState("");
  const [formTensaoCargaMax, setFormTensaoCargaMax] = useState("");
  const [formCorrenteCargaMin, setFormCorrenteCargaMin] = useState("");
  const [formCorrenteCargaMax, setFormCorrenteCargaMax] = useState("");
  const [formPotenciaBatMin, setFormPotenciaBatMin] = useState("");
  const [formPotenciaBatMax, setFormPotenciaBatMax] = useState("");
  const [formTempControladoraMin, setFormTempControladoraMin] = useState("");
  const [formTempControladoraMax, setFormTempControladoraMax] = useState("");
  const [activeTab, setActiveTab] = useState<
    "geral" | "limites_basicos" | "limites_extras"
  >("geral");

  const isAdmin = userRole === "admin";
  const canRestart = userRole === "admin" || userRole === "gestor";

  const resetForm = () => {
    setFormName("");
    setFormLocation("");
    setFormIp("");
    setFormUser("admin");
    setFormPassword("Admin@123");
    setFormContratoId("");
    setFormTensaoMin("");
    setFormTensaoMax("");
    setFormCorrenteMin("");
    setFormCorrenteMax("");
    setFormTempMin("");
    setFormTempMax("");
    setFormTensaoInputMin("");
    setFormTensaoInputMax("");
    setFormTensaoCargaMin("");
    setFormTensaoCargaMax("");
    setFormCorrenteCargaMin("");
    setFormCorrenteCargaMax("");
    setFormPotenciaBatMin("");
    setFormPotenciaBatMax("");
    setFormTempControladoraMin("");
    setFormTempControladoraMax("");
    setActiveTab("geral");
    setEditingRepetidora(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (repetidora: RepetidoraData) => {
    setEditingRepetidora(repetidora);
    setFormName(repetidora.name);
    setFormLocation(repetidora.location);
    setFormIp(repetidora.lastIp);
    setFormUser(repetidora.username || "admin");
    setFormPassword(repetidora.password || "Admin@123");
    setFormContratoId(repetidora.contratoId || "");
    setFormTensaoMin(repetidora.tensaoMin?.toString() || "");
    setFormTensaoMax(repetidora.tensaoMax?.toString() || "");
    setFormCorrenteMin(repetidora.correnteMin?.toString() || "");
    setFormCorrenteMax(repetidora.correnteMax?.toString() || "");
    setFormTempMin(repetidora.tempMin?.toString() || "");
    setFormTempMax(repetidora.tempMax?.toString() || "");
    setFormTensaoInputMin(repetidora.tensaoInputMin?.toString() || "");
    setFormTensaoInputMax(repetidora.tensaoInputMax?.toString() || "");
    setFormTensaoCargaMin(repetidora.tensaoCargaMin?.toString() || "");
    setFormTensaoCargaMax(repetidora.tensaoCargaMax?.toString() || "");
    setFormCorrenteCargaMin(repetidora.correnteCargaMin?.toString() || "");
    setFormCorrenteCargaMax(repetidora.correnteCargaMax?.toString() || "");
    setFormPotenciaBatMin(repetidora.potenciaBatMin?.toString() || "");
    setFormPotenciaBatMax(repetidora.potenciaBatMax?.toString() || "");
    setFormTempControladoraMin(
      repetidora.tempControladoraMin?.toString() || "",
    );
    setFormTempControladoraMax(
      repetidora.tempControladoraMax?.toString() || "",
    );
    setActiveTab("geral");
    setIsModalOpen(true);
  };

  const showNotification = (type: "success" | "error", text: string) => {
    if (type === "success") {
      setSuccessMsg(text);
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(text);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  const handleRestartSuccess = (repetidoraId: string) => {
    // Atualiza localmente a data de reinício sem precisar recarregar
    const nowStr = new Date().toISOString();
    setRepetidoras((prev) =>
      prev.map((b) =>
        b.id === repetidoraId
          ? { ...b, status: "online", lastRestart: nowStr }
          : b,
      ),
    );
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!confirm("Deseja realmente remover esta repetidora do supervisório?"))
      return;

    setDeletingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification("success", "Repetidora removida com sucesso.");
      setRepetidoras((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      id: editingRepetidora?.id,
      name: formName,
      location: formLocation,
      lastIp: formIp,
      username: formUser,
      password: formPassword,
      contratoId: formContratoId || null,
      tensaoMin: formTensaoMin ? parseFloat(formTensaoMin) : null,
      tensaoMax: formTensaoMax ? parseFloat(formTensaoMax) : null,
      correnteMin: formCorrenteMin ? parseFloat(formCorrenteMin) : null,
      correnteMax: formCorrenteMax ? parseFloat(formCorrenteMax) : null,
      tempMin: formTempMin ? parseFloat(formTempMin) : null,
      tempMax: formTempMax ? parseFloat(formTempMax) : null,
      tensaoInputMin: formTensaoInputMin
        ? parseFloat(formTensaoInputMin)
        : null,
      tensaoInputMax: formTensaoInputMax
        ? parseFloat(formTensaoInputMax)
        : null,
      tensaoCargaMin: formTensaoCargaMin
        ? parseFloat(formTensaoCargaMin)
        : null,
      tensaoCargaMax: formTensaoCargaMax
        ? parseFloat(formTensaoCargaMax)
        : null,
      correnteCargaMin: formCorrenteCargaMin
        ? parseFloat(formCorrenteCargaMin)
        : null,
      correnteCargaMax: formCorrenteCargaMax
        ? parseFloat(formCorrenteCargaMax)
        : null,
      potenciaBatMin: formPotenciaBatMin
        ? parseFloat(formPotenciaBatMin)
        : null,
      potenciaBatMax: formPotenciaBatMax
        ? parseFloat(formPotenciaBatMax)
        : null,
      tempControladoraMin: formTempControladoraMin
        ? parseFloat(formTempControladoraMin)
        : null,
      tempControladoraMax: formTempControladoraMax
        ? parseFloat(formTempControladoraMax)
        : null,
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = { ...payload, id: payload.id || `mock-${Date.now()}` } as any;

      if (editingRepetidora) {
        setRepetidoras((prev) =>
          prev.map((b) => (b.id === data.id ? data : b)),
        );
        showNotification(
          "success",
          `Repetidora "${formName}" atualizada com sucesso.`,
        );
      } else {
        setRepetidoras((prev) => [...prev, data]);
        showNotification(
          "success",
          `Nova repetidora "${formName}" cadastrada com sucesso.`,
        );
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = repetidoras.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase()) ||
      b.lastIp.includes(search);
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    const matchesContrato =
      filterContrato === "all" || (b.contratoId || "none") === filterContrato;
    return matchesSearch && matchesStatus && matchesContrato;
  });

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

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Gerenciamento de Repetidoras
          </h1>
          <p className="text-muted-foreground mt-1">
            Cadastre, edite e envie comandos de reinicialização para as
            repetidoras de backup.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Repetidora
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="glass rounded-xl p-4 border border-border flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search
            className="absolute inset-y-0 left-3 h-5 w-5 text-muted-foreground flex items-center pointer-events-none self-center"
            style={{ top: "30%" }}
          />
          <input
            type="text"
            placeholder="Buscar por nome, IP ou local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm placeholder-muted-foreground text-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>
        {/* Contrato Filter */}
        <div className="w-full md:w-auto shrink-0">
          <select
            value={filterContrato}
            onChange={(e) => setFilterContrato(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-all"
          >
            <option value="all">Todos os Contratos</option>
            <option value="none">Sem Contrato</option>
            {contratos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === "all"
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus("online")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === "online"
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilterStatus("offline")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === "offline"
                ? "bg-rose-500/10 border-rose-500/25 text-rose-600"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* Repetidoras Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((repetidora) => {
          const isOffline = repetidora.status === "offline";
          const isDeleting = deletingId === repetidora.id;
          const contrato = contratos.find(
            (c) => c.id === repetidora.contratoId,
          );
          return (
            <div
              key={repetidora.id}
              className={`glass rounded-2xl border p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-xl ${
                isOffline
                  ? "border-rose-500/20 shadow-rose-500/5"
                  : "border-border hover:border-primary/20"
              }`}
            >
              <div>
                {/* Status and Title */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${isOffline ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary"}`}
                    >
                      <Battery className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-tight">
                        {repetidora.name}
                      </h3>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                          isOffline
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        }`}
                      >
                        {repetidora.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Repetidora Details */}
                <div className="space-y-2.5 text-xs text-muted-foreground py-3 border-t border-b border-border my-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{repetidora.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-mono">{repetidora.lastIp}</span>
                  </div>
                  {contrato && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-semibold">{contrato.nome}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-semibold">Último reboot:</span>
                    <span>{formatDateBR(repetidora.lastRestart)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                {canRestart && (
                  <RestartRepetidoraButton
                    repetidoraId={repetidora.id}
                    repetidoraName={repetidora.name}
                    onSuccess={() => handleRestartSuccess(repetidora.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50"
                  />
                )}

                <Link
                  href={`/repetidoras/${repetidora.id}/telemetria`}
                  className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-600 hover:bg-blue-500/20 hover:text-blue-700 transition-all active:scale-[0.95]"
                  title="Histórico de Telemetria"
                >
                  <Activity className="h-3.5 w-3.5" />
                </Link>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => handleOpenEdit(repetidora)}
                      className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-[0.95]"
                      title="Editar cadastro"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(repetidora.id)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 hover:bg-rose-500/20 hover:text-rose-700 transition-all active:scale-[0.95] disabled:opacity-50"
                      title="Remover"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center glass rounded-2xl border border-border text-muted-foreground">
            Nenhuma repetidora localizada nos critérios informados.
          </div>
        )}
      </div>

      {/* Add / Edit Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <div className="glass w-full max-w-2xl rounded-2xl border border-border shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-foreground">
                {editingRepetidora
                  ? "Editar Cadastro de Repetidora"
                  : "Cadastrar Nova Repetidora"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col max-h-[85vh]"
            >
              {/* Tabs Header */}
              <div className="flex border-b border-border bg-muted/30 px-6 pt-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab("geral")}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "geral"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Informações Gerais
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("limites_basicos")}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "limites_basicos"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Limites Básicos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("limites_extras")}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "limites_extras"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Limites Extras
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* TAB: GERAL */}
                <div
                  className={
                    activeTab === "geral" ? "block space-y-6" : "hidden"
                  }
                >
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                      Informações Principais
                    </h3>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Nome da Repetidora *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Repetidora Central Sala A"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Localização / Setor *
                      </label>
                      <input
                        type="text"
                        required
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="Ex: Galpão de Manufatura - Bloco 2"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Contrato (Opcional)
                      </label>
                      <select
                        value={formContratoId}
                        onChange={(e) => setFormContratoId(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="">Selecione um contrato...</option>
                        {contratos.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                      Configurações de Rede
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Endereço IP *
                        </label>
                        <input
                          type="text"
                          required
                          value={formIp}
                          onChange={(e) => setFormIp(e.target.value)}
                          placeholder="Ex: 192.168.1.120"
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Porta / CGI User
                        </label>
                        <input
                          type="text"
                          value={formUser}
                          onChange={(e) => setFormUser(e.target.value)}
                          placeholder="Ex: admin"
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Senha de Acesso CGI
                      </label>
                      <input
                        type="password"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="Ex: Admin@123"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* TAB: LIMITES BÁSICOS */}
                <div
                  className={
                    activeTab === "limites_basicos" ? "block" : "hidden"
                  }
                >
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                      Limites Básicos (Tensão, Corrente, Temperatura)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Tensão Min (V)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formTensaoMin}
                          onChange={(e) => setFormTensaoMin(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Tensão Max (V)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formTensaoMax}
                          onChange={(e) => setFormTensaoMax(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Corr. Min (A)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formCorrenteMin}
                          onChange={(e) => setFormCorrenteMin(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Corr. Max (A)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formCorrenteMax}
                          onChange={(e) => setFormCorrenteMax(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Temp Min (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formTempMin}
                          onChange={(e) => setFormTempMin(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Temp Max (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formTempMax}
                          onChange={(e) => setFormTempMax(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* TAB: LIMITES EXTRAS */}
                <div
                  className={
                    activeTab === "limites_extras" ? "block" : "hidden"
                  }
                >
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                      Placa Solar
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Tensao Input Min (V)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formTensaoInputMin}
                          onChange={(e) =>
                            setFormTensaoInputMin(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Tensao Input Max (V)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formTensaoInputMax}
                          onChange={(e) =>
                            setFormTensaoInputMax(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                      Carga
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Tensão Carga Min (V)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formTensaoCargaMin}
                          onChange={(e) =>
                            setFormTensaoCargaMin(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Tensão Carga Max (V)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formTensaoCargaMax}
                          onChange={(e) =>
                            setFormTensaoCargaMax(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Corrente Carga Min (A)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formCorrenteCargaMin}
                          onChange={(e) =>
                            setFormCorrenteCargaMin(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Corrente Carga Max (A)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formCorrenteCargaMax}
                          onChange={(e) =>
                            setFormCorrenteCargaMax(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                      Extras
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Potência Repetidora Min (W)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formPotenciaBatMin}
                          onChange={(e) =>
                            setFormPotenciaBatMin(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Potência Repetidora Max (W)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formPotenciaBatMax}
                          onChange={(e) =>
                            setFormPotenciaBatMax(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Temp. Controladora Min (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formTempControladoraMin}
                          onChange={(e) =>
                            setFormTempControladoraMin(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Temp. Controladora Max (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formTempControladoraMax}
                          onChange={(e) =>
                            setFormTempControladoraMax(e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-card rounded-b-2xl">
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
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar Cadastro
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
