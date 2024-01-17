import { createContext, useState } from "react";

const FilterSelectionContext = createContext();

function FilterSelectionProvider({ children }) {
  const [filters, setFilters] = useState([]);
  const [activeFilterInput, setActiveFilterInput] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <FilterSelectionContext.Provider
      value={{
        filters,
        setFilters,
        activeFilterInput,
        setActiveFilterInput,
        loading,
        setLoading,
      }}
    >
      {children}
    </FilterSelectionContext.Provider>
  );
}

export { FilterSelectionContext, FilterSelectionProvider };
