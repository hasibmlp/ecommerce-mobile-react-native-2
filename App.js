import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { useFonts } from "expo-font";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { useEffect } from "react";

export default function App() {
  const [fontsLoaded] = useFonts({
    Georgia: require("./assets/fonts/georgia.ttf"),
    NunitoSans: require("./assets/fonts/NunitoSans.ttf"),
  });

  useEffect(() => {}, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ApolloProvider client={shopifyClient}>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </ApolloProvider>
  );
}
