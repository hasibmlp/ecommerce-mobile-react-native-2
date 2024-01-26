import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { useFonts } from "expo-font";
import { useApolloClientDevTools } from '@dev-plugins/apollo-client';

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { useCallback, useEffect } from "react";
import { View } from "react-native";


export default function App() {

  useApolloClientDevTools(shopifyClient);

  const [fontsLoaded] = useFonts({
    "Nexa-Regular": require("./assets/fonts/NexaRegular.otf"),
    "Nexa-Bold": require("./assets/fonts/NexaBold.otf"),
    "Nexa-Light": require("./assets/fonts/NexaLight.otf"),
    "Nexa-Thin": require("./assets/fonts/NexaThin.otf"),
    "Nexa-Black": require("./assets/fonts/NexaBlack.otf"),
    "Nexa-Book": require("./assets/fonts/NexaBook.otf"),
    "Nexa-Heavy": require("./assets/fonts/NexaHeavy.otf"),
    "Nexa-XBold": require("./assets/fonts/NexaXBold.otf"),
    "Georgia": require("./assets/fonts/georgia.ttf"),
    "NunitoSans": require("./assets/fonts/NunitoSans.ttf"),
    "Cormorant-Regular": require("./assets/fonts/Cormorant-Regular.ttf"),
    "Cormorant-Medium": require("./assets/fonts/Cormorant-Medium.ttf"),
    "Cormorant-SemiBold": require("./assets/fonts/Cormorant-SemiBold.ttf"),
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
