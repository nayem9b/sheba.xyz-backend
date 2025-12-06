"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.typeDefs = (0, graphql_tag_1.gql) `
  type Query {
    me: User
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    signup(
      name: String!,
      email: String!,
      password: String!,
      bio: String
    ): AuthPayload
    
    signin(
      email: String!
      password: String!
    ): AuthPayload
  }

  type User {
    id: ID!
    name: String!
    email: String!
    bio: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String
    user: User
  }
`;
