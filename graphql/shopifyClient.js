import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";

const token = "ff031bf264f816c80da166c05bc93a87";

const httpLink = createHttpLink({
  uri: "https://shopscrubsandclogs.com/api/2024-01/graphql.json",
});

const authLink = setContext((_, { headers }) => {
  const token = "ff71c6c290e0e4160eebe21615dc7aab";
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
  };
});

export const shopifyClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
