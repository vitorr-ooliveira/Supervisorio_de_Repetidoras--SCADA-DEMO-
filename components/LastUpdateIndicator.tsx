'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useTimeSince } from '@/hooks/useTimeSince';

interface LastUpdateIndicatorProps {
  /** Data/hora da última telemetria recebida (ISO string ou Date) */
  lastDate: string | Date | null | undefined;
}

/**
 * Componente de interface que exibe "Última leitura há X minutos"
 * usando o hook useTimeSince para atualização automática a cada 30s.
 *
 * @example
 * ```tsx
 * <LastUpdateIndicator lastDate={latestTelemetry.timestampEvento} />
 * ```
 */
export default function LastUpdateIndicator({ lastDate }: LastUpdateIndicatorProps) {
  const timeSince = useTimeSince(lastDate);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
      <span>
        Última leitura{' '}
        <span className="text-foreground font-semibold">{timeSince}</span>
      </span>
    </div>
  );
}
