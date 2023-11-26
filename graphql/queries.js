import { gql } from "@apollo/client";

export const GET_HOMESCREEN_DATA = gql`
  query HomeScreenData {
    homeData {
      gender
      data {
        ... on MainData1 {
          categories {
            title
            desc
            media {
              title
              url
            }
          }
          collections {
            title
            cta
            products {
              id
              title
              price
              media {
                url
              }
            }
          }
          bannerCards {
            title
            media {
              title
              url
            }
          }
          subCategories {
            title
            media {
              title
              url
            }
          }
          genderCategories {
            field {
              title
            }
          }
        }
        ... on MainData2 {
          bannerCards {
            title
            media {
              title
              url
            }
          }
          genderCategories {
            field {
              title
              url
            }
          }
        }
      }
    }
  }
`;

export const GET_HOME_DATA = gql`
  query homeData {
    collection(id: "gid://shopify/Collection/460284723479") {
      id
      metafield(key: "mobile_app", namespace: "mobile") {
        value
      }
    }
  }
`;

export const GET_COLOR_SWATCH_IMAGES = gql`
  query colorSwatchImages {
    collection(id: "gid://shopify/Collection/460284723479") {
      id
      metafield(key: "color_swatch_images", namespace: "custom") {
        value
      }
    }
  }
`;

export const GET_COLLECTION = gql`
  query collectionData($collectionId: ID!) {
    collection(id: $collectionId) {
      id
      title
      products(first: 5) {
        edges {
          node {
            id
            vendor
            title
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
query getProductVairants($productId: ID!) {
  product(id: $productId) {
    id
    vendor
    title
    description
    priceRange {
      minVariantPrice {
        amount
      }
    }
    images(first: 100) {
      edges {
        node {
          id
          url
          altText
        }
      }
    }
    options {
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          id
          quantityAvailable
          selectedOptions {
            name
            value
          }
          image {
            id
            url
          }
        }
      }
    }
  }
}
`

export const GET_PRODUCT_VARIANTS_AND_IMAGES_AND_OPTIONS = gql`
query getProductVairants($productId: ID!) {
  product(id: $productId) {
    id
    images(first: 100) {
      edges {
        node {
          id
          url
          altText
        }
      }
    }
    options {
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          id
          quantityAvailable
          selectedOptions {
            name
            value
          }
          image {
            id
            url
          }
        }
      }
    }
  }
}
`

export const GET_PRODUCT_VARIANTS = gql`
  query getProductVairants($productId: ID!) {
    product(id: $productId) {
      id
      variants(first: 100) {
        edges {
          node {
            id
            quantityAvailable
            selectedOptions {
              name
              value
            }
            image {
              id
              url
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_IMAGES = gql`
  query getProductVairants($productId: ID!) {
    product(id: $productId) {
      id
      images(first: 100) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_OPTIONS = gql`
  query getProductOption($productId: ID!) {
    product(id: $productId) {
      id
      options {
        name
        values
      }
    }
  }
`;

export const GET_CART_ITEM = gql`
  query getCartItem($productId: ID!) {
    node(id: $productId) {
      ... on ProductVariant {
        id
        title
        image {
          url
        }
        price {
          amount
        }
        selectedOptions {
          name
          value
        }
        product {
          title
        }
      }
    }
  }
`;

export const GET_PRODUCT_VARIANT = gql`
  query getProductVariant(
    $productId: ID!
    $selectedOptions: [SelectedOptionInput!]!
  ) {
    product(id: $productId) {
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
      }
    }
  }
`;

export const GET_VARIANT_BY_ID = gql`
  query getVariantById($variantId: ID!) {
    node(id: $variantId) {
      ... on ProductVariant {
        id
        title
        image {
          url
        }
        price {
          amount
        }
        selectedOptions {
          name
          value
        }
        product {
          title
        }
      }
    }
  }
`;

export const GET_CART_DETAILS = gql`
  query GetCheckoutList($checkoutId: ID!) {
    node(id: $checkoutId) {
      ... on Checkout {
        id
        webUrl
        lineItems(first: 20) {
          edges {
            node {
              id
              variant {
                id
              }
            }
          }
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          country
          phone
        }
        totalTax {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        lineItemsSubtotalPrice {
          amount
          currencyCode
        }
        totalPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const GET_CHECKOUT_DETAILS = gql`
  query GetCheckoutDetails($checkoutId: ID!) {
    node(id: $checkoutId) {
      ... on Checkout {
        id
        webUrl
        lineItems(first: 20) {
          edges {
            node {
              id
              variant {
                id
              }
            }
          }
        }
        buyerIdentity {
          __typename
        }
        email
        shippingAddress {
          firstName
          lastName
          phone
          address1
          address2
          city
          country
          zip
        }
        totalTax {
          amount
          currencyCode
        }
        totalDuties {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const GET_AVAILABLE_SHIPPING_RATES = gql`
  query GetAvailableShippingRates($checkoutId: ID!) {
    node(id: $checkoutId) {
      ... on Checkout {
        id
        availableShippingRates {
          ready
          shippingRates {
            handle
            title
            price {
              amount
              currencyCode
            }
          }
        }
        shippingLine {
          handle
          title
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const GET_BUYER_DETAILS = gql`
  query GetBuyerDetails($checkoutId: ID!) {
    node(id: $checkoutId) {
      ... on Checkout {
        id
        email
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          phone
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_ID = gql`
  query getCollectionById($collectionId: ID!, $cursor: String, $filterInput: [ProductFilter!]) {
    collection(id: $collectionId) {
      id
      title
      products(first: 18, after: $cursor, filters: $filterInput) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        edges {
          cursor
          node {
            id
            title
            vendor
            featuredImage{
              altText
              id
              url
            }
            options {
              name
              values
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;


export const GET_ALL_PRODUCTS_ID_IN_COLLECTION = gql`
query getCollectionById($collectionId: ID!, $cursor: String, $filterInput: [ProductFilter!]) {
  collection(id: $collectionId) {
    id
    products(first: 250, after: $cursor, filters: $filterInput) {
      edges {
        cursor
        node {
          id
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
`