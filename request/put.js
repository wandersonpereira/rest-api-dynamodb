const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ErrorResponse = require('../lib/error');

/**
 * Update registry in table from the dynamodb
 * @param Table
 * @param event
 * @returns {PromiseLike<Array> | Promise<Array>}
 */
module.exports = (Table, event) => {

    if (!event.body) {
        throw new ErrorResponse('no body arguments provided');
    }

    const editedItemId = event.pathParameters.id;

    if (!editedItemId) {
        throw new ErrorResponse('invalid id specified');
    }

    const editedItem = JSON.parse(event.body);
    const editedItemProperties = Object.keys(editedItem);

    if (!editedItem || editedItemProperties.length < 1) {
        throw new ErrorResponse('no args provided');
    }

    const key = {};
    key[Table.primaryKey] = editedItemId;

    const firstProperty = editedItemProperties.splice(0,1);
    let params = {
        TableName: Table.tableName,
        Key: key,
        UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
        ExpressionAttributeValues: {},
        ReturnValues: 'UPDATED_NEW'
    };

    params.ExpressionAttributeValues[`:${firstProperty}`] = editedItem[firstProperty];

    editedItemProperties.forEach(property => {
        params.UpdateExpression += `, ${property} = :${property}`;
        params.ExpressionAttributeValues[`:${property}`] = editedItem[property];
    });

    return dynamoDb.update(params).promise().then((rs) => []);
};