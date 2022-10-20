const jwt = require('jsonwebtoken');

const createToken = async (payload, expiration) => {
    return jwt.sign(payload, process.env.MY_SECRET, {
        expiresIn: expiration
    });
};

const decodeToken = (token) => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());


const tokens = {
    createToken,
    decodeToken

}


module.exports = tokens; 
