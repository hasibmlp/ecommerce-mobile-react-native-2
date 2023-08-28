import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://trappist-1e.myshopify.com/api/2023-07/graphql.json",
});

const authLink = setContext((_, { headers }) => {
  const token = "ff031bf264f816c80da166c05bc93a87";
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
  };
});

export default client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
