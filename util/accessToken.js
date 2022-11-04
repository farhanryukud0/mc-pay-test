const jwt = require('jsonwebtoken');

const createAuthToken = async (data) => {
    const token = jwt.sign(
        data,
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: 36000}, // 10 hour
    );

    return {accessToken: token};
};


module.exports = {
    createAuthToken,
};
