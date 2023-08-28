import { gql } from "@apollo/client";

export const GET_COLLECTION = gql`
  query {
    collection(id: "gid://shopify/Collection/289439154328") {
      id
      title
      products(first: 5) {
        edges {
          node {
            id
            title
            featuredImage {
              url
            }
          }
        }
      }
    }
  }
`;
