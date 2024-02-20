import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ShopifyCheckoutSheetProvider } from "@shopify/checkout-sheet-kit";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";
import { useEffect } from "react";

export default function App() {
  const [fontsLoaded] = useFonts({
    Georgia: require("./assets/fonts/georgia.ttf"),
    NunitoSans: require("./assets/fonts/NunitoSans.ttf"),
    EBGaramond: require("./assets/fonts/EBGaramond-Regular.ttf"),
    EBGaramondBold: require("./assets/fonts/EBGaramond-Bold.ttf"),
    EBGaramondMedium: require("./assets/fonts/EBGaramond-Medium.ttf"),
    Nexa: require("./assets/fonts/NexaRegular.otf"),
    NexaBold: require("./assets/fonts/NexaBold.otf"),
  });

  useEffect(() => {}, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={shopifyClient}>
        <ShopifyCheckoutSheetProvider>
          <Provider store={store}>
            <AppNavigation />
          </Provider>
        </ShopifyCheckoutSheetProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}
