import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

class Connection {
    constructor(){
        this.db = process.env.DB_NAME;
        this.host = process.env.DB_HOST;
        this.username = process.env.DB_USER;
        this.password = process.env.DB_PWD;
        this.port = process.env.DB_PORT;
    }

    createCon() {
        return mysql.createPool({
            host: this.host,
            user: this.username,
            database: this.db,
            password: this.password,
            port: this.port
        });
    }
}

export default Connection;
