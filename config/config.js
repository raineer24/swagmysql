require('dotenv').config();

module.exports = {
    env: {
        port: process.env.PORT || '6001',
        hostname: 'localhost',
    }
}