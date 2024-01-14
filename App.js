import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { useFonts } from "expo-font";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { useCallback, useEffect } from "react";
import { View } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Nexa-Regular": require("./assets/fonts/NexaRegular.otf"),
    "Nexa-Bold": require("./assets/fonts/NexaBold.otf"),
    "Nexa-Light": require("./assets/fonts/NexaLight.otf"),
    "Nexa-Thin": require("./assets/fonts/NexaThin.otf"),
    "Nexa-Black": require("./assets/fonts/NexaBlack.otf"),
    "Nexa-Book": require("./assets/fonts/NexaBook.otf"),
    "Nexa-Heavy": require("./assets/fonts/NexaHeavy.otf"),
    "Nexa-XBold": require("./assets/fonts/NexaXBold.otf"),
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
