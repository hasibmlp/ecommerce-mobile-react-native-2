import { Provider } from "react-redux";
import {
  ApolloProvider,
} from "@apollo/client";

import AppNavigation from "./navigation/AppNavigation";
import { store } from "./redux/store";
import { client } from "./graphql/client";


export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </ApolloProvider>
  );
}
