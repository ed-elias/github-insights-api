'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const schema = require('./data/schema');
const pubSub = require('./messages/listenForMessages');
const jwt = require('express-jwt');
var cors = require('cors')
require('dotenv').config();


const PORT = 3005;

const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
pubSub()

app.use(cors())
// Graphql endpoint
app.use('/api', bodyParser.json(), jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
}), graphqlExpress(req => ({
    schema,
    context: {
        authUser: req.user
    }
})));

// Graphiql for testing the API out
app.use('/graphiql', graphiqlExpress({endpointURL: 'api'}));
// Add headers
var allowedOrigins = ['*'];
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(cors(corsOptions))
app.listen(PORT, () => {
    console.log(`GraphiQL is running on http://localhost:${PORT}/graphiql`);
});
