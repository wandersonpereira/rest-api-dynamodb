const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

/**
 * Insert registry in table from the dynamodb
 * @param Table
 * @param event
 * @returns {PromiseLike<T> | Promise<T>}
 */
module.exports = (Table, event) => {
    if (!event.body) {
        throw new Error('invalid');
    }

    let item = JSON.parse(event.body);
    item[Table.primaryKey] = uuidv4();

    let params = {
        TableName: Table.tableName,
        Item: item
    };

    return dynamoDb.put(params).promise().then((resource) => item);
};