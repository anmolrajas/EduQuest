const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const setUser = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET);
}

const getUser = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    setUser,
    getUser
}