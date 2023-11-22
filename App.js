import { Provider } from "react-redux";
import {
  ApolloProvider,
  makeVar,
} from "@apollo/client";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { createContext, useState } from "react";
import SideBar from "./components/Sidebar/SideBar";

export const cartIdVar = makeVar("");
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
