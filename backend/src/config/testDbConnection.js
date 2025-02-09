const pool = require('./db');

const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database Connected Successfully:', res.rows[0]);
    } catch (error) {
        console.error('Database Connection Failed:', error.message);
    } finally {
        pool.end(); 
    }
};

testConnection();
