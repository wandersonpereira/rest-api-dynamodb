# rest-api-dynamodb
Project to lambda function for API Gateway with DynamoDb

For configuration to Lambda function, above all, you need to create the tables in DynamoDb.

Then, you need create a AWS IAM Role with permission in all required tables from the DynamoDb. 

Then, you will create the Lambda function, and to do code upload for your Lambda.

Lastly, you will create the API Gateway and to point all request methods for the Lambda function.

> Obs.
> In your API Gateway, in the option "Integration Request", you must to select option "Use Lambda Proxy integration"
