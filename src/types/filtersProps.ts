interface CustomerFiltersProps {
  filters: Filters;
  search: string;
  tipoContribuinte: "all" | "pessoa_fisica" | "pessoa_juridica" | "mei" | "simples_nacional" | undefined;
  isActive: string;
  onFilterChange: (newFilters: Partial<Filters>) => void;
}

