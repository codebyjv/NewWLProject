import { Filters } from "@/types/filters";

export interface CustomerFiltersProps {
  filters: Filters;
  search: string;
  tipoContribuinte: "all" | "1" | "2" | "9" | undefined;
  isActive: string;
  onFilterChange: (newFilters: Partial<Filters>) => void;
}