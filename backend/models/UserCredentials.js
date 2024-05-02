import mysql from 'mysql2';
import { database } from '../config/database.js';

class UserCredentials {
    constructor() {
        this.connection = mysql.createConnection(database);
    }
    async getUser(username, pwd) {
        try {
            const query = "SELECT id_user, username_user, avatar_user, status_user, name_entity, lastname_entity FROM user JOIN entity on entity_fk = id_entity WHERE username_user=? AND pwd_user=?"
            const [rows, fields] = await this.connection.promise().query(query, [username.toLowerCase(), pwd]);
            //.promise() nos permite trabajar con async/await en lugar de callbacks en mysql2

            if (rows.length === 0) {
                return null;
            }

            return rows[0];
        } catch (e) {
            console.error(e + ' model');
            throw e;
        }
    }
}

export default UserCredentials;