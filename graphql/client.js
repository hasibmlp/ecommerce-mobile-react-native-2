import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://trappist-1e.myshopify.com/api/2023-07/graphql.json",
  cache: new InMemoryCache(),
  headers: {
    "X-Shopify-Storefront-Access-Token": "bfe9571e29cb8075537f0a0111d2ee63",
  },
});
