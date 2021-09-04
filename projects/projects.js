const AWS = require('aws-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const UserNotFoundError = require('../users/errors/UserNotFoundError');
const WebsiteExistsError = require('./errors/WebsiteExistsError');

const {getUsersTable, getWebsiteAnalyticsProjectTable} = require('../utilities/AWSHelpers');

const HASH_ROUNDS = 15;

module.exports.createProject = async ({
	apiKey,
	projectName,
	website
}) => {
	const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
	console.log('Table', getUsersTable());
	const userResponse = await dynamoDBClient.scan({
		TableName: getUsersTable(),
		ExpressionAttributeNames: {
			'#key': 'apiKey'
		},
		ExpressionAttributeValues: {
			':val': {
				'S': apiKey
			}
		},
		FilterExpression: '#key = :val',
	}).promise();
	console.log('response', userResponse);
	if (userResponse.Count === 0) throw new UserNotFoundError();

	const user = userResponse.Items[0];
	console.log('Got user', user);

	return {
		projectId: 'fdjfd',
		projectSecret: 'fdfdfdfd'
	};

	const date = new Date().toISOString();
	const projectId = uuid.v5(projectName, apiKey);
	const projectSecret = `s-${uuid.v5(date, apiKey)}-${uuid.v4()}`;
	const projectSecretHash = await bcrypt.hash(projectSecret, HASH_ROUNDS);

	const data = {
		id: projectId,
		projectSecretHash,
		createdAt: date,
		modifiedAt: date,
		name: projectName,

	}
};