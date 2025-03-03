const jwt = require('jsonwebtoken');
const secret = 'AnmolR@2002';

const setUser = (user) => {
    return jwt.sign(user, secret);
}

const getUser = (token) => {
    return jwt.verify(token, secret);
}

module.exports = {
    setUser,
    getUser
}