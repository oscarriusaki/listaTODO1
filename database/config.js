const mysql = require('mysql');

const host1 = process.env.HOST || "localhost";
const user1 = process.env.USER || "root";
const password1 = process.env.PASSWORD || "";
const database1 = process.env.DATABASE || "gestionar";

const db = mysql.createConnection({

    host: host1,
    user: user1,
    password: password1,
    database: database1,
    
});

module.exports = db;