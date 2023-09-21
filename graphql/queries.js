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
  query GetHomeScreenData($gender: GenderValues){
    homeScreen(gender: $gender) {
      greeting
      collectionCategory {
        title
        desc
        images {
          title
          url
        }
      }
    }
  }
`;
