const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const GetAll = require('./getAll');

/**
 * Get the item in dynamodb, case params id is undefined, list all items
 * @param Table
 * @param event
 * @returns {PromiseLike<T> | Promise<T>}
 */
module.exports = (Table, event) => {

    const requestedItemId = (event.pathParameters || {}).id || false;
    if (!requestedItemId) {
        return GetAll(Table, event);
    }

    const key = {};
    key[Table.primaryKey] = requestedItemId;
    const params = {
        TableName: Table.tableName,
        Key: key
    };

    return dynamoDb.get(params).promise().then(response => response.Item);
};