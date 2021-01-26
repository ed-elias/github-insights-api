// Copyright 2019-2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This application demonstrates how to perform basic operations on
 * subscriptions with the Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */
const {User, Commits} = require('../models');

'use strict';
const pubSubListener = () => {


    const subscriptionName = process.env.SUBSCRIPTION_NAME || 'github-data-pull';
    const projectId = process.env.PROJECT_ID || 'unique-302723';
    const keyFilename = process.env.GOOGLE_KEY_PATH || '/home/ederson/google/unique-google.json'
    // Imports the Google Cloud client library
    const {PubSub} = require('@google-cloud/pubsub');

    // Creates a client; cache this for further use
    const pubSubClient = new PubSub({
        projectId: projectId,
        subscriptionName: subscriptionName,
        keyFilename: keyFilename
    });

    function listenForMessages() {
        // References an existing subscription
        const subscription = pubSubClient.subscription(subscriptionName);

        // Create an event handler to handle messages
        const messageHandler = async message => {
            let data = JSON.parse(message.data.toString())
            let fails = [];
            for (const el of data) {
                const user =
                    await User.findOne({where: {login: el.login}})
                        .then((u) => u.id)
                        .catch((e) => User.create({...el})
                            .then((u) => u.id)
                            .catch(() => fails.push(el)));

                await Commits.create({...el, userId: user})
                    .then(() => console.log("sucess in process " + message.id))
                    .catch((e) => {
                            console.error("Fail process message" + message.id + " " + el + " " + e)
                        }
                    )
            }
            message.ack()
        };

        // Listen for new messages until timeout is hit
        subscription.on('message', messageHandler);


    }

    listenForMessages();
}

module.exports = pubSubListener;
