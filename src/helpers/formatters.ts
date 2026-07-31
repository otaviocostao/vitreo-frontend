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

export function formatRg(rg: string | null | undefined): string {
  if (!rg) {
    return ''
  };

  const digits = rg.replace(/\D/g, '');
  const truncated = digits.slice(0, 10);

  if (truncated.length <= 2) {
    return truncated.length > 0 ? `${truncated}` : '';
  }

  if (truncated.length <= 5) {
    return `${truncated.slice(0, 2)}.${truncated.slice(2)}`;
  }

  if (truncated.length <= 8) {
    return `${truncated.slice(0, 2)}.${truncated.slice(2, 5)}.${truncated.slice(5)}`;
  }

  return `${truncated.slice(0, 2)}.${truncated.slice(2, 5)}.${truncated.slice(5, 8)}-${truncated.slice(8)}`;
}

export function formatCurrency(
  value: string | number | null | undefined,
  showSymbol: boolean = false
): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  let numberValue: number;

  if (typeof value === 'number') {
    if (isNaN(value)) return '';
    numberValue = value;
  } else {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    numberValue = Number(digits) / 100;
  }

  if (showSymbol) {
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrency(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }

  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits) / 100;
}