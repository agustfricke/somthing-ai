import { gql } from "@apollo/client";

export const UPDATE_IMAGE = gql`
  mutation UpdateImage($id: ID!, $isPublic: Boolean) {
    updateImage(_id: $id, isPublic: $isPublic) {
      _id
      path
      prompt
      isPublic
    }
  }
`;

export const GET_IMAGE = gql`
  query GetImage($id: ID!) {
    image(_id: $id) {
      _id
      path
      prompt
      isPublic
      user {
        _id
      }
    }
  }
`;

export const GET_USER_IMAGES = gql`
  query GetUserImages($page: Int, $limit: Int) {
    userImages(page: $page, limit: $limit) {
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

export const GENERATE_IMAGE = gql`
  mutation GenerateImage($prompt: String!, $isPublic: Boolean) {
    generateImage(prompt: $prompt, isPublic: $isPublic) {
      _id
      path
      prompt
      isPublic
    }
  }
`;
