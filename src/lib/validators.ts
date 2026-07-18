/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas).
 * Returns true if empty (optional) or mathematically valid.
 */
export function validateCPF(cpf: string | null | undefined): boolean {
  if (!cpf) return true;
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 0) return true;
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10), 10)) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i), 10) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11), 10)) return false;

  return true;
}

/**
 * Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica).
 * Supports standard numeric CNPJ and the new alphanumeric CNPJ format.
 * Returns true if empty (optional) or mathematically valid.
 */
export function validateCNPJ(cnpj: string | null | undefined): boolean {
  if (!cnpj) return true;
  const cleaned = cnpj.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length === 0) return true;
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  // The check digits (last 2 digits) must be numeric
  if (!/^\d{2}$/.test(cleaned.slice(-2))) return false;

  // Conversion rule for Receita Federal alphanumeric CNPJ: letter ASCII - 48
  const convertChar = (c: string): number => {
    return c.charCodeAt(0) - 48;
  };

  const calculateDigit = (slice: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += convertChar(slice[i]) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const first12 = cleaned.slice(0, 12);
  const dv1 = calculateDigit(first12, weights1);
  const dv2 = calculateDigit(first12 + dv1, weights2);

  return dv1 === parseInt(cleaned[12], 10) && dv2 === parseInt(cleaned[13], 10);
}

/**
 * Validates a Brazilian phone/cell number.
 * Returns true if empty (optional) or format-valid.
 * Accepts formats: (XX) XXXX-XXXX (10 digits) or (XX) XXXXX-XXXX (11 digits).
 */
export function validatePhone(phone: string | null | undefined): boolean {
  if (!phone) return true;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 0) return true;
  if (cleaned.length !== 10 && cleaned.length !== 11) return false;

  // Brazilian DDDs are between 11 and 99 (each digit 1-9)
  const ddd = parseInt(cleaned.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  if (cleaned[0] === '0' || cleaned[1] === '0') return false;

  // If it's a mobile phone (11 digits), it must start with a 9 digit
  if (cleaned.length === 11 && cleaned[2] !== '9') return false;

  return true;
}

/**
 * Validates a Brazilian CEP (Código de Endereçamento Postal).
 * Returns true if empty (optional) or has exactly 8 digits.
 */
export function validateCEP(cep: string | null | undefined): boolean {
  if (!cep) return true;
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length === 0) return true;
  return cleaned.length === 8;
}
