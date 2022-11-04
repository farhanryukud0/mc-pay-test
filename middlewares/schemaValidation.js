const {ReasonPhrases, StatusCodes} = require('http-status-codes');

const validation = (schema) => async (req, res, next) => {
    if ((req.method) == 'POST' || (req.method) == 'PUT' || (req.method) == 'DELETE' ||(req.method) == 'GET') {
        try {
            const body = req.body;
            const parsed = await schema.validate(body);
            req.body = parsed;

            next();
        } catch (err) {
            res.set('x-timestamp', Date.now());
            return res.status(StatusCodes.BAD_REQUEST).type('application/json').json({
                status: StatusCodes.BAD_REQUEST,
                error: (({name, message, errors}) => ({name, message, errors}))(err),
            });
        }
    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).type('application/json').json({
            status: StatusCodes.METHOD_NOT_ALLOWED,
            error: {
                message: ReasonPhrases.METHOD_NOT_ALLOWED,
            },
        });
    }
};

module.exports = validation;

