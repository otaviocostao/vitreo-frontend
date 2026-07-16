export function formatDate(data: string | null | undefined): string {
  if (!data) {
    return ''
  };

  const dateObj = new Date(`${data}T00:00:00`);

  if (isNaN(dateObj.getTime())) return 'Data inválida';
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

export function formatPhone(tel: string | null | undefined): string {
  if (!tel) {
    return ''
  };

  const digits = tel.replace(/\D/g, '');
  const truncated = digits.slice(0, 11);

  if (truncated.length <= 2) {
    return truncated.length > 0 ? `(${truncated}` : '';
  }

  if (truncated.length <= 6) {
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
  }

  if (truncated.length <= 10) {
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 6)}-${truncated.slice(6)}`;
  }

  return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
}

export function formatZipCode(zipCode: string | null | undefined): string {
  if (!zipCode) {
    return ''
  };

  const digits = zipCode.replace(/\D/g, '');
  const truncated = digits.slice(0, 8);

  if (truncated.length <= 5) {
    return truncated;
  }

  return `${truncated.slice(0, 5)}-${truncated.slice(5)}`;
}