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
import { useEffect, useState } from "react";
import BottomModal from "./components/BottomModal";
import { VariantSelectionProvider } from "./contexts/VariantSelectionContext";

export const cartIdVar = makeVar("");
export const bottomModaVar = makeVar(false);
export const selctedProductForBottomModalVar = makeVar(null);

export default function App() {
  const slectedProudct = useReactiveVar(selctedProductForBottomModalVar);

  return (
    <ApolloProvider client={shopifyClient}>
      <Provider store={store}>
        <VariantSelectionProvider>
          <AppNavigation />
          <BottomModal productId={slectedProudct} />
        </VariantSelectionProvider>
      </Provider>
    </ApolloProvider>
  );
}
