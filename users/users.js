const AWS = require('aws-sdk');
const uuid = require('uuid');

const {getUsersTable} = require('../utilities/AWSHelpers');

module.exports.createUser = async ({
	name
}) => {
    
	const apiKey = uuid.v4();
	
	const date = new Date().toISOString();
	const data = {
		id: uuid.v4(),
		name,
		createdAt: date,
		modifiedAt: date,
		apiKey
	};
	
	const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
	await dynamoDBClient.put({
		Item: data,
		TableName: getUsersTable()
	}).promise();

	return apiKey;
};