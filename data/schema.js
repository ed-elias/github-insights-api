'use strict';

const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
    scalar DateTime

    type User {
        id: Int!
        name: String!
        login: String
        commits: [Commit]
        createdAt: DateTime! # will be generated
        updatedAt: DateTime! # will be generated
    }

    type Commit {
        id: Int!
        additions: Int!
        deletions: Int!
        cursor: String!
        user: User!
        createdAt: DateTime! # will be generated
        updatedAt: DateTime! # will be generated
    }

    type Insights {
        additions: Int!
        deletions: Int!
        commits: Int!
        user: User!
    }
    
    type Query {
        allUsers(limit: Int, offset:Int): [User]
        fetchUser(id: Int!): User
        allCommits(limit: Int, offset:Int): [Commit]
        fetchCommit(id: Int!): Commit
        getInsights(sortBy: String): [Insights]
    }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});
