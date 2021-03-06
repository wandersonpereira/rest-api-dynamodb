const Response = require('./lib/response.js');
const Table = require('./lib/table.js');
const Post = require('./request/post.js');
const Put = require('./request/put.js');
const Delete = require('./request/delete.js');
const Get = require('./request/get.js');
const IS_CORS = true;

exports.handler = (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return Promise.resolve(Response(IS_CORS));
    }

    let responseItem = null;

    try {
        // Validate type Http Method
        switch (event.httpMethod.toUpperCase()) {
            case 'POST':
                responseItem = Post(Table(event), event);
                break;

            case 'PUT':
                responseItem = Put(Table(event), event);
                break;

            case 'DELETE':
                responseItem = Delete(Table(event), event);
                break;

            case 'GET':
                responseItem = Get(Table(event), event);
                break;

            default:
                responseItem = null;
                break;
        }
    } catch (e) {
        return Promise.resolve(Response(IS_CORS, e.message, e.code));
    }


    if (responseItem == null) {
        return Promise.resolve(Response(IS_CORS, 'Invalid Table', 400));
    }

    return responseItem
    .then((item) => (Response(IS_CORS, item)))
    .catch(dbError => {
        let errorResponse = `Error: Execution CRUD, caused a Dynamodb error, please look at your logs.`;
        if (dbError.code === 'ValidationException') {
            if (dbError.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
        }
        return Response(IS_CORS, errorResponse, 500);
    });
};