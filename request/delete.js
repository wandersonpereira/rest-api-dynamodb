const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ErrorResponse = require('../lib/error');

/**
 * Delete register in table from the dynamodb
 * @param Table
 * @param event
 * @returns {PromiseLike<Array> | Promise<Array>}
 */
module.exports = (Table, event) => {

    const requestedItemId = event.pathParameters.id;
    if (!requestedItemId) {
        throw new ErrorResponse(`Error: You're missing the id parameter`);
    }

    let key = {};
    key[Table.primaryKey] = requestedItemId;
    let params = {
        TableName: Table.tableName,
        Key: key
    };

    return dynamoDb.delete(params).promise().then((rs) => []);
}