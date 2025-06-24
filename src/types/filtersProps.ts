interface CustomerFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
}