export interface Filters {
  search: string;
  tipoContribuinte: 'all' | 'pessoa_fisica' | 'pessoa_juridica' | 'mei' | 'simples_nacional';
  isActive: 'all' | 'true' | 'false';
  status?: string;
  dateRange?: { start: string; end: string };
  customerName?: string;
}