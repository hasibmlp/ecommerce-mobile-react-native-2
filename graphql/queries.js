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

export const GET_CATEGORIES_OF_COLLECTIONS = gql`
  query homeData {
    collection(id: "gid://shopify/Collection/460284723479") {
      id
      metafield(key: "categories_of_collection", namespace: "mobile") {
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
  query getCollectionShortDetails($collectionId: ID!) {
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
            options {
              id
              name
              values
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query getProductDetails(
    $productId: ID!
    $metaIdentifiers: [HasMetafieldsIdentifier!]!
  ) {
    product(id: $productId) {
      id
      vendor
      title
      description
      onlineStoreUrl
      productType
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
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
        id
        name
        values
      }
      metafields(identifiers: $metaIdentifiers) {
        id
        key
        namespace
        type
        value
      }
      variants(first: 100) {
        edges {
          node {
            id
            quantityAvailable
            availableForSale
            currentlyNotInStock
            selectedOptions {
              name
              value
            }
            image {
              id
              url
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
      metafield(key: "offer_announcement_text", namespace: "mobile") {
        value
      }
    }
  }
`;

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
`;

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

export const GET_CART_DETAILS_V2 = gql`
  query getCartDetails($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      discountCodes {
        code
        applicable
      }
      buyerIdentity {
        email
        customer {
          id
          email
        }
      }
      discountAllocations {
        ... on CartAutomaticDiscountAllocation {
          discountedAmount {
            amount
          }
          title
        }
        ... on CartCodeDiscountAllocation {
          code
          discountedAmount {
            amount
            currencyCode
          }
        }
        ... on CartCustomDiscountAllocation {
          title
          discountedAmount {
            amount
            currencyCode
          }
        }
      }
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            attribute(key: "custom-product-uid") {
              key
              value
            }
            attributes {
              key
              value
            }
            discountAllocations {
              ... on CartAutomaticDiscountAllocation {
                title
                discountedAmount {
                  amount
                  currencyCode
                }
              }
              ... on CartCodeDiscountAllocation {
                code
                discountedAmount {
                  amount
                  currencyCode
                }
              }
              ... on CartCustomDiscountAllocation {
                title
                discountedAmount {
                  amount
                  currencyCode
                }
              }
            }
            cost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                image {
                  url
                  altText
                }
                selectedOptions {
                  name
                  value
                }
                product {
                  productType
                  vendor
                  title
                }
              }
            }
            discountAllocations {
              ... on CartCodeDiscountAllocation {
                code
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_ID = gql`
  query getCollectionDetails(
    $collectionId: ID!
    $cursor: String
    $filterInput: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(id: $collectionId) {
      id
      title
      image {
        url
      }

      products(
        first: 18
        after: $cursor
        filters: $filterInput
        sortKey: $sortKey
        reverse: $reverse
      ) {
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
            priceRange {
              __typename
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              __typename
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              altText
              id
              url
            }
            options {
              id
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
      metafield(key: "description", namespace: "custom") {
        value
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_ID_IN_COLLECTION = gql`
  query getCollectionTotalPageNumber(
    $collectionId: ID!
    $cursor: String
    $filterInput: [ProductFilter!]
  ) {
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
`;
export const GET_CUSTOMER = gql`
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      lastIncompleteCheckout {
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
              }
            }
          }
        }
      }
      addresses(first: 50, reverse: true) {
        edges {
          node {
            id
            name
            firstName
            lastName
            address1
            address2
            city
            country
            countryCodeV2
            phone
            province
            zip
          }
        }
      }
      defaultAddress {
        id
        name
        firstName
        lastName
        address1
        address2
        city
        country
        countryCodeV2
        phone
        province
        zip
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            name
            processedAt
            fulfillmentStatus
            lineItems(first: 10) {
              edges {
                node {
                  title
                  variant {
                    id
                    title
                    image {
                      url
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_AVAILABLE_COUNTRIES = gql`
  query getAvailableCountry {
    localization {
      country {
        name
        isoCode
      }
      availableCountries {
        isoCode
        name
      }
    }
  }
`;

export const GET_SHIPPING_COUNTRIES = gql`
  query getShipsToCountries {
    shop {
      name
      shipsToCountries
    }
  }
`;

export const GET_PREDITIVE_RESULTS = gql`
  query predictiveSearch($query: String!) {
    predictiveSearch(query: $query) {
      queries {
        text
      }
      products {
        id
        title
        vendor
        featuredImage {
          id
          altText
          url
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query searchProducts(
    $query: String!
    $first: Int
    $filterInput: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $cursor: String
  ) {
    search(
      query: $query
      first: $first
      after: $cursor
      types: PRODUCT
      sortKey: $sortKey
      reverse: $reverse
      productFilters: $filterInput
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      productFilters {
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
        node {
          ... on Product {
            id
            title
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              altText
              id
              url
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
                  availableForSale
                  currentlyNotInStock
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
      }
    }
  }
`;

export const GET_CUSTOMIZATIN_COLLECTION = gql`
  query getCustomizationCollection(
    $collectionId: ID
    $metaIdentifiers: [HasMetafieldsIdentifier!]!
  ) {
    collection(id: $collectionId) {
      id
      title
      description
      handle
      metafields(identifiers: $metaIdentifiers) {
        id
        namespace
        key
        value
      }
      products(first: 3) {
        edges {
          node {
            id
            title
            vendor
            productType
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_VARIANT_OF_PRODUCTS = gql`
  query productVarinats($productId: ID!) {
    product(id: $productId) {
      id
      variants(first: 100) {
        edges {
          node {
            id
            quantityAvailable
            availableForSale
            currentlyNotInStock
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

export const GET_PRODUCT_RECOMMENDATIONS = gql`
  query getProductRecommendations($proudctId: ID!) {
    productRecommendations(productId: $proudctId) {
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
      options {
        id
        name
        values
      }
    }
  }
`;

export const GET_PROUDCTS_BY_IDS = gql`
  query ProductsById($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
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
        options {
          id
          name
          values
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            name
            canceledAt
            processedAt
            fulfillmentStatus
            financialStatus
            lineItems(first: 10) {
              edges {
                node {
                  title
                  variant {
                    id
                    title
                    image {
                      url
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ORDER_DETAILS = gql`
  query getOrderDetails($orderId: ID!) {
    node(id: $orderId) {
      ... on Order {
        id
        canceledAt
        fulfillmentStatus
        financialStatus
        lineItems(first: 10) {
          edges {
            node {
              title
              currentQuantity
              quantity
              variant {
                id
                title
                selectedOptions {
                  name
                  value
                }
                image{
                  id
                  url
                }
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                product {
                  id
                  vendor
                  title
                }
              }
            }
          }
        }
        name
        orderNumber
        processedAt
        billingAddress {
          id
          address1
          address2
          city
          firstName
          lastName
          zip
          formatted
          formattedArea
        }
        successfulFulfillments(first: 1) {
          trackingCompany
          trackingInfo {
            number
            url
          }
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalShippingPrice {
          amount
          currencyCode
        }
        totalTax {
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
