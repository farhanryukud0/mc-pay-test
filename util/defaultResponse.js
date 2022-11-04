const {ReasonPhrases, StatusCodes} = require('http-status-codes');

const defaultResponse = (res, data, status_code=StatusCodes.OK) => {
    res.status(status_code).json({
        status: status_code,
        data: data,
    });
};

const messageResponse = (res, message, error_code = StatusCodes.BAD_REQUEST) => {
    res.status(error_code).json({
        status: error_code,
        message: message,
    });
};


module.exports = {
    defaultResponse, messageResponse,
};
