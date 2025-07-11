export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateString; // Fallback se for inválido
  }
};

export const formatCpfCnpj = (value: string | undefined): string => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const cleaned = value.replace(/\D/g, '');
  
  // Formata CPF (11 dígitos)
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // Formata CNPJ (14 dígitos)
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return value; // Retorna original se não for CPF/CNPJ válido
};

export const formatMoney = (value: number | undefined): string => {
  return value?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) || 'R$ 0,00';
};