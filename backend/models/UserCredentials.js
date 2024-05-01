import mysql from 'mysql2';
import { database } from '../config/database.js';

class UserCredentials {
    constructor(){
        this.connection = mysql.createConnection(database);
    }

    //.promise() nos permite trabajar con async/await en lugar de callbacks en mysql2

    async getUser(username, pwd) {
        try {
            const query = "SELECT * FROM user WHERE username_user=? AND pwd_user=?"
            const [rows, fields] = await this.connection.promise().query(query, [username, pwd]);
            return rows[0];
        } catch (e) {
            console.error(e + ' model');
            throw e; // Re-lanzar el error para que el controlador lo maneje
        }
    }
}

export default UserCredentials;