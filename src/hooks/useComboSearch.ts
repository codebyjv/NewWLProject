import { useState, useMemo } from "react";

export function useComboSearch<T>(
  items: T[],
  searchKeys: (keyof T)[]
) {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredItems = useMemo(() => {
    const text = searchText.toLowerCase();
    return items.filter((item) =>
      searchKeys.some((key) =>
        String(item[key]).toLowerCase().includes(text)
      )
    );
  }, [items, searchText, searchKeys]);

  return {
    searchText,
    setSearchText,
    showSuggestions,
    setShowSuggestions,
    filteredItems,
  };
}
