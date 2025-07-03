export interface Filters {
  search: string;
  tipoContribuinte: 'all' | '1' | '2' | '9';
  isActive: 'all' | 'true' | 'false';
  status?: string;
  dateRange?: { start: string; end: string };
  customerName?: string;
}