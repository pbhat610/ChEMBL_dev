require('dotenv').config();

module.exports = {
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    server: {
        port: process.env.PORT || 5000,
        nodeEnv: process.env.NODE_ENV || 'development',
    }
};
