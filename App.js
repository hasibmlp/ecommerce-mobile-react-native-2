import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { shopifyClient } from "./graphql/shopifyClient";

export default function App() {
  return (
    <ApolloProvider client={shopifyClient}>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </ApolloProvider>
  );
}
