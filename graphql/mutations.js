import { gql } from "@apollo/client";

export const CREATE_CART = gql`
  mutation cartCreate($productQuantity: Int!, $productId: ID!) {
    cartCreate(
      input: {
        lines: [{ quantity: $productQuantity, merchandiseId: $productId }]
      }
    ) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const ADD_CART_ITEM = gql`
  mutation addCartItem($cartId: ID!, $productId: ID!) {
    cartLinesAdd(
      cartId: $cartId
      lines: { merchandiseId: $productId, quantity: 1 }
    ) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation removeCartItem($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(
      cartId: $cartId
      lineIds: $lineIds
    ) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
