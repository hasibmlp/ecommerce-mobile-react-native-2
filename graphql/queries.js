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
      metafield(key: "mobile_app", namespace: "mobile") {
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
            images(first:5){
              edges{
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
  query singleProduct($productId: ID!) {
    product(id: $productId) {
    id
    vendor
    title
    priceRangeV2 {
      minVariantPrice {
        amount
      }
    }
    images(first:5) {
      edges {
        node {
          url
        }
      }
    }
  }
  }
`
