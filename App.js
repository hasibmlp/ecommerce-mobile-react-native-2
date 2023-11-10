import { Provider } from "react-redux";
import {
  ApolloProvider,
  makeVar,
  useQuery,
  useReactiveVar,
} from "@apollo/client";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { createContext, useEffect, useState } from "react";
import BottomModal from "./components/BottomModal";
import { VariantSelectionProvider } from "./contexts/VariantSelectionContext";
import SideBar from "./components/Sidebar/SideBar";
import { SafeAreaView } from "react-native";

export const cartIdVar = makeVar("");
export const bottomModaVar = makeVar(false);
export const selctedProductForBottomModalVar = makeVar(null);

export const SideBarContext = createContext()

export default function App() {
  const slectedProudct = useReactiveVar(selctedProductForBottomModalVar);

  const [isSideBarOpen, setSideBarOpen] = useState(false)

  return (
    <ApolloProvider client={shopifyClient}>
      <Provider store={store}>
        <SideBarContext.Provider value={{
            isSideBarOpen,
            setSideBarOpen
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
