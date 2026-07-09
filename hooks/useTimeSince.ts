'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Hook customizado que retorna uma string amigável
 * indicando há quanto tempo a leitura foi feita.
 *
 * Atualiza automaticamente a cada 30 segundos sem causar
 * re-renderizações desnecessárias em componentes-pai,
 * pois somente o componente que consome o hook re-renderiza.
 *
 * @param date - ISO 8601 string ou Date da última leitura
 * @returns String formatada (ex: "há 2 minutos", "há 30 segundos")
 *
 * @example
 * ```tsx
 * function LastUpdateIndicator({ lastDate }: { lastDate: string }) {
 *   const timeSince = useTimeSince(lastDate);
 *   return <span className="text-muted-foreground text-xs">{timeSince}</span>;
 * }
 * ```
 */
export function useTimeSince(date: string | Date | null | undefined): string {
  const computeLabel = useCallback((): string => {
    if (!date) return 'Sem dados';

    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return 'Data inválida';
    }

    return formatDistanceToNow(parsedDate, {
      addSuffix: true,   // "há X minutos"
      locale: ptBR,
    });
  }, [date]);

  const [label, setLabel] = useState<string>(computeLabel);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Atualiza imediatamente ao mudar a data de referência
    setLabel(computeLabel());

    // Atualiza a cada 30 segundos
    intervalRef.current = setInterval(() => {
      setLabel(computeLabel());
    }, 30_000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [computeLabel]);

  return label;
}
