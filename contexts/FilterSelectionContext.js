import { createContext, useState } from "react";

const FilterSelectionContext = createContext();

function FilterSelectionProvider({ children }) {
  

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
