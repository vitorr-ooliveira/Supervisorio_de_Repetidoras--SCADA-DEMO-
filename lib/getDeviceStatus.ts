/**
 * Regra de Status Offline (Timeout de 10 minutos)
 *
 * Recebe a data da última telemetria e retorna "ONLINE" ou "OFFLINE".
 * Se a diferença entre o momento atual e a última telemetria for
 * superior a 10 minutos, o repetidora é considerado OFFLINE.
 *
 * Trata fuso horário de forma segura usando Date.getTime() (UTC epoch ms).
 */

export type DeviceStatus = 'ONLINE' | 'OFFLINE';

const OFFLINE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutos em milissegundos

/**
 * Determina se o repetidora está online ou offline com base
 * na data/hora da última telemetria recebida.
 *
 * @param lastTelemetryDate - ISO 8601 string, Date object,
 *                            ou null/undefined (resulta em OFFLINE)
 * @returns 'ONLINE' | 'OFFLINE'
 *
 * @example
 * ```ts
 * const status = getDeviceStatus('2026-06-19T17:45:00-03:00');
 * // Se "agora" for 17:52 → diferença de 7 min → "ONLINE"
 *
 * const status2 = getDeviceStatus('2026-06-19T17:30:00-03:00');
 * // Se "agora" for 17:52 → diferença de 22 min → "OFFLINE"
 * ```
 */
export function getDeviceStatus(
  lastTelemetryDate: string | Date | null | undefined,
): DeviceStatus {
  // Sem data = OFFLINE
  if (!lastTelemetryDate) {
    return 'OFFLINE';
  }

  const lastDate =
    lastTelemetryDate instanceof Date
      ? lastTelemetryDate
      : new Date(lastTelemetryDate);

  // Data inválida = OFFLINE
  if (isNaN(lastDate.getTime())) {
    return 'OFFLINE';
  }

  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();

  // Diferença negativa (telemetria no futuro) indica possível problema
  // de fuso horário ou relógio desajustado — considera ONLINE como proteção
  if (diffMs < 0) {
    return 'ONLINE';
  }

  return diffMs > OFFLINE_THRESHOLD_MS ? 'OFFLINE' : 'ONLINE';
}
