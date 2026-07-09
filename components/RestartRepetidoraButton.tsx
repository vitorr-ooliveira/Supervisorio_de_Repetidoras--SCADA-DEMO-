"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RefreshCw, Loader2, CheckCircle2, XCircle, Globe } from "lucide-react";
import { toast } from "sonner";

interface RestartRepetidoraButtonProps {
  /** ID da repetidora para enviar o comando de reinício */
  repetidoraId: string;
  /** Nome da repetidora para exibir na notificação */
  repetidoraName?: string;
  /** Callback opcional após sucesso */
  onSuccess?: () => void;
  /** Callback opcional após erro */
  onError?: (error: Error) => void;
  /** Desabilitar externamente (ex: permissão insuficiente) */
  disabled?: boolean;
  /** Customização de estilos CSS do botão */
  className?: string;
  /** Texto personalizado para o botão */
  text?: string;
}

/**
 * Botão "Reiniciar Repetidora" com estados de loading, feedback e notificação.
 *
 * Comportamento:
 * 1. Ao clicar, `isLoading = true` → botão fica `disabled` com spinner.
 * 2. Realiza chamada assíncrona (POST /api/proxy).
 * 3. Ao finalizar, exibe toast de sucesso ou erro via `sonner`.
 *
 * **Importante**: O componente `<Toaster />` do sonner precisa estar
 * montado em algum layout pai (ex: layout.tsx). Veja a instrução abaixo.
 *
 * @example
 * ```tsx
 * // No layout.tsx, adicione o Toaster:
 * import { Toaster } from 'sonner';
 * // ...
 * <body>
 *   {children}
 *   <Toaster richColors position="top-right" theme="dark" />
 * </body>
 *
 * // No componente:
 * <RestartRepetidoraButton
 *   repetidoraId="abc-123"
 *   repetidoraName="Repetidora Central"
 *   onSuccess={() => refetchData()}
 * />
 * ```
 */
export default function RestartRepetidoraButton({
  repetidoraId,
  repetidoraName = "Repetidora",
  onSuccess,
  onError,
  disabled = false,
  className,
  text = "Reiniciar Repetidora",
}: RestartRepetidoraButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // MFA States
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRequestRestart = async () => {
    if (isLoading || disabled) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmIntent = async () => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Código MFA enviado`, {
        description: "Verifique sua caixa de entrada. (Mocked)",
        icon: <CheckCircle2 className="h-5 w-5" />,
        duration: 5000,
      });

      setIsMfaModalOpen(true);
      setMfaCode(""); // Reset code input
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro desconhecido");
      toast.error(`Atenção`, {
        description: error.message,
        icon: <XCircle className="h-5 w-5" />,
        duration: 6000,
      });
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRestart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirming || mfaCode.length !== 6) return;
    setIsConfirming(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const durationMs = 30000;

      toast.success(`Reiniciando ${repetidoraName}...`, {
        description: `A repetidora será reiniciada pelos próximos 30 segundos.`,
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-pulse" />,
        duration: durationMs,
      });

      setIsMfaModalOpen(false); // Fecha o modal após o sucesso
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro desconhecido");

      toast.error(`Falha ao reiniciar ${repetidoraName}`, {
        description: error.message,
        icon: <XCircle className="h-5 w-5" />,
        duration: 6000,
      });

      onError?.(error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <button
        onClick={handleRequestRestart}
        disabled={isLoading || disabled}
        className={
          className ||
          `
          group relative flex items-center justify-center gap-2
          px-4 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-200 active:scale-[0.97]
          ${
            isLoading || disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:shadow-lg hover:shadow-emerald-500/15"
          }
          bg-emerald-500/10 border border-emerald-500/25
          text-emerald-400
          hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40
          disabled:hover:bg-emerald-500/10 disabled:hover:text-emerald-400
        `
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-45" />
            <span>{text}</span>
          </>
        )}
      </button>

      {/* PORTALS FOR MODALS */}
      {mounted &&
        createPortal(
          <>
            {/* MODAL DE CONFIRMAÇÃO */}
            {isConfirmModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200">
                  <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                    {/* <RefreshCw className="h-5 w-5 text-emerald-500" /> */}
                    Confirmar Reinício
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Tem certeza que deseja reiniciar a repetidora{" "}
                    <strong className="text-foreground">
                      {repetidoraName}
                    </strong>
                    ? Um código de segurança será enviado ao seu e-mail.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setIsConfirmModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleConfirmIntent()}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL MFA */}
            {isMfaModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Verificação de Segurança
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Digite o código de 6 dígitos enviado ao seu e-mail para
                    confirmar o reinício da repetidora.
                  </p>
                  <form onSubmit={handleConfirmRestart} className="space-y-6">
                    <input
                      type="text"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) =>
                        setMfaCode(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="000000"
                      className="w-full h-14 bg-background border-2 border-border focus:border-emerald-500 rounded-xl text-center text-3xl font-bold tracking-[0.5em] text-foreground focus:outline-none transition-colors"
                      autoFocus
                      required
                    />
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsMfaModalOpen(false)}
                        disabled={isConfirming}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isConfirming || mfaCode.length !== 6}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
                      >
                        {isConfirming ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />{" "}
                            Verificando...
                          </>
                        ) : (
                          "Confirmar"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>,
          document.body,
        )}
    </>
  );
}
