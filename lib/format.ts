export function formatDateBR(dateString?: string | null): string {
  if (!dateString) return 'Sem registros';
  try {
    const date = new Date(dateString);
    // Verifica se a data é inválida
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' às');
  } catch (e) {
    return dateString;
  }
}
