const bcrypt= require('bcrypt');

const generatePasswordHash = async (password) => {
    const salt_rounds = 10;
    const hashed_password = new Promise((resolve, reject) => {
        bcrypt.hash(password, salt_rounds, function(err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });
    return hashed_password;
};


const comparePasswordHash = async (plain_password, hashed_password) => {
    const salt_rounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.compare(plain_password, hashed_password, function(err, result) {
            if (err)	reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    generatePasswordHash,
    comparePasswordHash,
};
