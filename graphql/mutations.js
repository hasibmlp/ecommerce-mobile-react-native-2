import { gql } from "@apollo/client";

export const CREATE_CART = gql`
  mutation checkoutCreate($productQuantity: Int!, $productId: ID!, $customAttributes: [AttributeInput!]) {
    checkoutCreate(
      input: {
        lineItems: [{ quantity: $productQuantity, variantId: $productId, customAttributes: $customAttributes }]
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

export const CREATE_CHECKOUT = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        shippingAddress{
          id
          firstName
          lastName
          address1
          address2
          city
          country
          countryCodeV2
          phone
          zip
      }
      }
      checkoutUserErrors {
        message
      }
      queueToken
    }
  }
`;

export const ADD_CHECKOUT_LINES = gql`
  mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const REPLACE_CHECKOUT_LINES = gql`
  mutation checkoutLineItemsReplace($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
      id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CREATE_CART_V2 = gql`
  mutation createCart($lines: [CartLineInput!]!){
    cartCreate(input:{
      lines:$lines,
    }){
      cart{
        id
      }
    }
  }
`;

export const CREATE_CART_WITH_CUSTOM_ID = gql`
  mutation checkoutCreateWithCustomId($productQuantity: Int!, $productId: ID!) {
    checkoutCreate(
      input: {
        lineItems: [
          { quantity: $productQuantity, variantId: $productId }
        ]
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

export const CREATE_CART_EMPTY_V2 = gql`
  mutation createCart{
    cartCreate(input:{
      lines:[],
    }){
      cart{
        id
      }
    }
  }
`;

export const ADD_CART_ITEM = gql`
  mutation checkoutLineItemAdd($checkoutId: ID!, $variantId: ID!, $customAttributes: [AttributeInput!]) {
    checkoutLineItemsAdd(
      checkoutId: $checkoutId
      lineItems: [{ variantId: $variantId, quantity: 1, customAttributes: $customAttributes }]
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

export const ADD_CART_ITEM_V2 = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  } 
`;

export const UPDATE_CART_ITEM = gql`
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;


export const ADD_CUSTOM_VARIANT_ID = gql`
  mutation checkoutLineItemAdd($checkoutId: ID!, $customId: ID!) {
    checkoutLineItemsAdd(
      checkoutId: $checkoutId
      lineItems: [
          { quantity: 1, variantId: $customId }
        ]
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

export const REMOVE_CART_ITEM_V2 = gql`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
      }
      userErrors {
        field
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

export const CREATE_CUSTOMER_TOKEN = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
      }
      customerUserErrors {
        message
      }
    }
  }
`;

export const UPDATE_CART_DISCOUT_CODE = gql`
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes{
          code
          applicable
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_NOTE = gql`
  mutation cartNoteUpdate($cartId: ID!, $note:String!) {
    cartNoteUpdate(cartId: $cartId, note:$note) {
      cart {
        id
        note
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_CUSTOMER_ASSOCIATE = gql`
mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
  checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
    checkout {
     id
      email
      shippingAddress{
        id
        address1
        address2
        name
        firstName
        lastName
      }
      buyerIdentity{
        countryCode
      }
      lineItems(first:5){
        edges{
          node{
            id
          }
        }
      }
    }
    checkoutUserErrors {
      message
    }
    customer {
      email
    }
  }
}
`;

