const mongoose = require('mongoose');

const connectMongoDB = async(URI) => {
    mongoose.connect(URI);
}

module.exports = connectMongoDB;