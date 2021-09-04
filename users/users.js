const AWS = require('aws-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const HASH_ROUNDS = 15;

module.exports.createUser = async ({
    name
}) => {
    
    const clientId = `${uuid.v4()}${uuid.v2()}`;
    const clientSecret = `${uuid.v5(clientId, name)}${uuid.v4()}`
    const clientSecretHash = await bcrypt.hash(clientSecret, HASH_ROUNDS);
    
    const dynamoDBClient = new AWS.DynamoDB();
    const date = new Date();
    const data = {
        name,
        id: uuid.v4(),
        createdAt: date,
        modifiedAt: date,
        clientId,
        clientSecret
    };
};