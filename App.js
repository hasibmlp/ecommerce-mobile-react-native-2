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
import SideBar from "./components/Sidebar/SideBar";

export const cartIdVar = makeVar("");
export const checkoutIdVar = makeVar("");
export const accessTokenVar = makeVar(null);
export const bottomModaVar = makeVar(false);
export const selctedProductForBottomModalVar = makeVar(null);

export const SideBarContext = createContext()

export default function App() {

  const getAcessToken = async () => {
    const token = await AsyncStorage.getItem("my-key")
    if(token !== null) accessTokenVar(token)
    console.log(token)
  } 

  useEffect(() => {
    console.log("THIS IS APP USEEFFECT")
    getAcessToken()
  })

  return ( 
    <ApolloProvider client={shopifyClient}>
      <Provider store={store}>
            <AppNavigation />
      </Provider>
    </ApolloProvider>
  );
}
