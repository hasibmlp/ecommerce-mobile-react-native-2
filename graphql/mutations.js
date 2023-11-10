import { gql } from "@apollo/client";

export const CREATE_CART = gql`
  mutation checkoutCreate($productQuantity: Int!, $productId: ID!) {
    checkoutCreate(
      input: {
        lineItems: [{ quantity: $productQuantity, variantId: $productId }]
      }
    ) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
      queueToken
    }
  }
`;

export const CREATE_EMPTY_CART = gql`
  mutation emptyCheckoutCreate {
    checkoutCreate(input: { lineItems: [] }) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
      queueToken
    }
  }
`;

export const ADD_CART_ITEM = gql`
  mutation checkoutLineItemAdd($checkoutId: ID!, $variantId: ID!) {
    checkoutLineItemsAdd(
      checkoutId: $checkoutId
      lineItems: [{ variantId: $variantId, quantity: 1 }]
    ) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation checkoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
    checkoutLineItemsRemove(
      checkoutId: $checkoutId
      lineItemIds: $lineItemIds
    ) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const ADD_CHECKOUT_EMAIL = gql`
  mutation checkoutEmailUpdateV2($checkoutId: ID!, $email: String!) {
    checkoutEmailUpdateV2(checkoutId: $checkoutId, email: $email) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const ADD_CHECKOUT_SHIPPING_ADDRESS = gql`
  mutation checkoutShippingAddressUpdateV2(
    $checkoutId: ID!
    $shippingAddress: MailingAddressInput!
  ) {
    checkoutShippingAddressUpdateV2(
      checkoutId: $checkoutId
      shippingAddress: $shippingAddress
    ) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const SET_SHIPPING_METHOD = gql`
  mutation checkoutShippingLineUpdate(
    $checkoutId: ID!
    $shippingRateHandle: String!
  ) {
    checkoutShippingLineUpdate(
      checkoutId: $checkoutId
      shippingRateHandle: $shippingRateHandle
    ) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;
