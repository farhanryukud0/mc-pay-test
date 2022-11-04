const jwt = require('jsonwebtoken');
const {ReasonPhrases, StatusCodes} = require('http-status-codes');
const httpContext = require('express-http-context');
const {messageResponse} = require("../util/defaultResponse");

verifyToken = (req, res, next) => {
    const auth_header = req.headers.authorization;
    const token = auth_header && auth_header.split(' ')[1];

    if (token == null) {
        return messageResponse(res,ReasonPhrases.UNAUTHORIZED,StatusCodes.UNAUTHORIZED);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token_data) => {
        if (err) {
            return messageResponse(res,ReasonPhrases.FORBIDDEN,StatusCodes.FORBIDDEN)
        }

        httpContext.set('userId', token_data.id)

        next()
    });
};

module.exports = {
    verifyToken,
};
