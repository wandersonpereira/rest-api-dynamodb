const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Module that find all items in DynamoDb
 * @param Table
 * @param event
 * @returns {PromiseLike<T> | Promise<T>}
 */
module.exports = (Table, event) => {

    let Keys = Object.keys(event.queryStringParameters || {});
    let params = {};

    // Prepare all attributes to batchGetItem in dynamodb
    // use the documentation (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#batchGetItem-property)
    Keys = Keys.map(attributeName => {
        const attributes = {};

        attributes[attributeName] = {
            'S' : event.queryStringParameters[attributeName]
        };

        return attributes;
    });


    if (Keys.length <= 0) {
        params = {
            TableName: Table.tableName
        };

        return dynamoDb.scan(params).promise().then(response => response.Items)
    }

    params[Table.tableName] = {Keys};

    return dynamoDb.batchGetItem(params).promise().then(response => response.Items);
};