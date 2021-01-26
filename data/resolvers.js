'use strict';
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');
const {QueryTypes} = require('sequelize');
const {User, Commit} = require('../models');
const slugify = require('slugify');
const db = require("../models");
require('dotenv').config();

// Define resolvers
const resolvers = {
    Query: {
        // Fetch all users
        async allUsers(_, {limit, offset}) {
            return await User.all({limit: Math.min(limit || 100, 100), offset: offset || 0});
        },

        // Get a user by it ID
        async fetchUser(_, {id}) {
            return await User.findById(id);
        },

        // Fetch all commits
        async allCommits(_, {limit, offset}) {
            return await Commit.all({limit: Math.min(limit || 100, 100), offset: offset || 0});
        },

        // Get a commit by it ID
        async fetchCommit(_, {id}) {
            return await Commit.findById(id);
        },
        async getInsights(_, {sort}) {
            let order = "commits";
            if (["deletions", "additions", "commits"].includes(sort)) {
                order = sort;
            }
            let stats = []
            stats.push(...await db.sequelize.query('SELECT SUM(additions) additions , SUM(deletions) deletions, COUNT(user_id) commits ,user_id FROM commits\n' +
                'GROUP BY user_id\n' +
                'ORDER BY ' + order + ' DESC LIMIT 20 ', {
                // A function (or false) for logging your queries
                // Will get called for every SQL query that gets sent
                // to the server.
                logging: console.log,

                // If plain is true, then sequelize will only return the first
                // record of the result set. In case of false it will return all records.
                plain: false,

                // Set this to true if you don't have a model definition for your query.
                raw: false,

                // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                type: QueryTypes.SELECT
            }));
            let result = [];
            stats.forEach(value => {
                result.push({
                    additions: value.additions,
                    deletions: value.deletions,
                    commits: value.commits,
                    user: User.findByPk(value.user_id)
                });
            })
            return result;
        },

    },

    User: {
        // Fetch all commits created by a user
        async commits(user) {
            return await user.getCommits({limit: 100});
        }
    },

    Commit: {
        async user(commit) {
            return await commit.getUser();
        },

    },

    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'DateTime type',

        parseValue(value) {
            return new Date(value);
        },

        serialize(value) {
            const date = new Date(value);

            // value sent to the client
            return date.toISOString();
        },

        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10);
            }

            return null;
        }
    })
};

module.exports = resolvers;
