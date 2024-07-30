import { gql } from "@apollo/client";

export const GET_PUBLIC_IMAGES = gql`
  query GetPublicImages($page: Int, $limit: Int, $searchParam: String) {
    publicImages(page: $page, limit: $limit, searchParam: $searchParam) {
      images {
        _id
        path
        prompt
        isPublic
      }
      pageInfo {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
