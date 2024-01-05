import { Provider } from "react-redux";
import {
  ApolloProvider,
  makeVar,
} from "@apollo/client";

import AppNavigation from "./navigation/AppNavigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { createContext, useEffect, useState } from "react";

export const cartIdVar = makeVar("");
export const checkoutIdVar = makeVar("");
export const userVar = makeVar(null)
export const bottomModaVar = makeVar(false); 
export const selctedProductForBottomModalVar = makeVar(null);

export const SideBarContext = createContext()

export default function App() {
  return ( 
    <ApolloProvider client={shopifyClient}>
      <Provider store={store}>
            <AppNavigation />
      </Provider>
    </ApolloProvider>
  );
}
