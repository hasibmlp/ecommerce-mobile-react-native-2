import { Provider } from "react-redux";
import {
  ApolloProvider,
  makeVar,
  useReactiveVar,
} from "@apollo/client";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { createContext, useState } from "react";
import BottomModal from "./components/BottomModal";
import { VariantSelectionProvider } from "./contexts/VariantSelectionContext";
import SideBar from "./components/Sidebar/SideBar";

export const cartIdVar = makeVar("");
export const bottomModaVar = makeVar(false);
export const selctedProductForBottomModalVar = makeVar(null);

export const SideBarContext = createContext()

export default function App() {
  const slectedProudct = useReactiveVar(selctedProductForBottomModalVar);

  const [isSideBarOpen, setSideBarOpen] = useState(false)
  const [filters , setFilters] = useState([])
  const [activeFilters, setActiveFilters] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFilterInput, setActiveFilterInput] = useState([])

  return (
    <ApolloProvider client={shopifyClient}>
      <Provider store={store}>
        <SideBarContext.Provider value={{
            isSideBarOpen,
            setSideBarOpen,
            filters,
            setFilters,
            activeFilters,
            loading,
            setLoading,
            setActiveFilters,
            activeFilterInput,
            setActiveFilterInput,
          }}>
          <VariantSelectionProvider>
            <AppNavigation />
            <BottomModal productId={slectedProudct} />
            {isSideBarOpen && (<SideBar />)} 
          </VariantSelectionProvider>
        </SideBarContext.Provider>
      </Provider>
    </ApolloProvider>
  );
}
