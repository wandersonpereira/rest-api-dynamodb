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
    let arrayKeyCondition = [];
    let attributes = {};
    let indexName = null;
    let indexKey = 0;

    // Prepare all attributes to batchGetItem in dynamodb
    // use the documentation (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#query-property)
    Keys.map((attributeName) => {
        if (['IndexName'].indexOf(attributeName) >= 0) {
            indexName = event.queryStringParameters[attributeName];
            return null;
        }

        attributes[':S' + (indexKey + 1)] = event.queryStringParameters[attributeName];
        arrayKeyCondition.push(`${attributeName} = :S${(indexKey + 1)}`);

        indexKey++;
        return attributes;
    });


    if (Object.keys(attributes).length <= 0) {
        params = {
            TableName: Table.tableName
        };

        return dynamoDb.scan(params).promise().then(response => response.Items)
    }

    params = {
        ExpressionAttributeValues: attributes,
        KeyConditionExpression: arrayKeyCondition.join(' and '),
        TableName: Table.tableName
    };

    if (indexName !== null) {
        params.IndexName = indexName;
    }

    return dynamoDb.query(params).promise().then(response => response.Items);
};