import { createContext, useContext, useMemo, useRef, useState } from "react";

const FilterPriceRangeContext = createContext();

const FilterPriceRangeProvider = ({ children }) => {
  const priceRangeMax = useRef();

  const values = useMemo(() => {
    return {
      priceRangeMax,
    };
  }, []);

  return (
    <FilterPriceRangeContext.Provider value={values}>
      {children}
    </FilterPriceRangeContext.Provider>
  );
};

export { FilterPriceRangeContext, FilterPriceRangeProvider };
