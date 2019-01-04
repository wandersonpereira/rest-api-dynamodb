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
    let stringKeyCondition = '';
    let attributes = {};

    // Prepare all attributes to batchGetItem in dynamodb
    // use the documentation (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#query-property)
    Keys = Keys.map((attributeName, indexKey) => {
        attributes[':S' + (indexKey + 1)] = event.queryStringParameters[attributeName];

        let and = '';
        if (indexKey < (Keys.length - 1)) {
            and = ' and ';
        }

        stringKeyCondition += attributeName + ' = :S' + (indexKey + 1) + and;

        return attributes;
    });


    if (Keys.length <= 0) {
        params = {
            TableName: Table.tableName
        };

        return dynamoDb.scan(params).promise().then(response => response.Items)
    }

    params = {
        ExpressionAttributeValues: attributes,
        KeyConditionExpression: stringKeyCondition,
        TableName: Table.tableName
    };

    return dynamoDb.query(params).promise().then(response => response.Items);
};