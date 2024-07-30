import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String
    publicImages(page: Int, limit: Int, searchParam: String): PaginatedImages
  }

  type Mutation {
    login(username: String!, password: String!): Token
    register(username: String!, password: String): User
    createImage(prompt: String!, isPublic: Boolean): Image
  }

  type PaginatedImages {
    images: [Image]
    pageInfo: PageInfo
  }

  type PageInfo {
    currentPage: Int
    totalPages: Int
    hasNextPage: Boolean
    hasPreviousPage: Boolean
  }

  type Token {
    token: String
  }

  type User {
    _id: ID!
    username: String!
    password: String!
    createdAt: String
    updatedAt: String
    images: [Image]
  }

  type Image {
    _id: ID!
    prompt: String!
    isPublic: Boolean
    path: String!
    user: User
    createdAt: String
    updatedAt: String
  }

`;

/*
  */
