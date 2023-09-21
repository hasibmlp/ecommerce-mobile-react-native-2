import { gql } from "@apollo/client";

// export const GET_PRODUCTS = gql`
//   query {
//     collection(id: "gid://shopify/Collection/289439154328") {
//       products(first: 5) {
//         edges {
//           node {
//             vendor
//             title
//             featuredImage {
//               url
//             }
//             images(first: 5) {
//               edges {
//                 node {
//                   url
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export const GET_HOMESCREEN_DATA = gql`
  query HomeScreenData {
    homeData {
      womensData {
        gender
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
            title
            price
            media {
              title
              url
            }
          }
        }
        bannerCards {
          title
          desc
          media {
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
            url
          }
        }
      }
      mensData {
        gender
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
            title
            price
            media {
              title
              url
            }
          }
        }
        bannerCards {
          title
          desc
          media {
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
            url
          }
        }
      }
      kidsData {
        bannerCards {
          title
          desc
          media {
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
`;
