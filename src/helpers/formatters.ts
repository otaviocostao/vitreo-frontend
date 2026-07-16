export function formatDate(data: string | null | undefined): string {
  if (!data) return '';
  const dateObj = new Date(`${data}T00:00:00`);
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

export function formatPhone(tel: string | null | undefined): string {
  if (!tel) return '';
  const digits = tel.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return tel;
};