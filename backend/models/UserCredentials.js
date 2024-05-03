import mysql from 'mysql2';
import { database } from '../config/database.js';

class UserCredentials {
    constructor() {
        this.connection = mysql.createConnection(database);
    }
    async getUser(username, pwd) {
        try {
            const query = "SELECT id_user, username_user, avatar_user, status_user, name_entity, lastname_entity, name_profile, name_occupation FROM user u JOIN entity e on u.entity_fk = e.id_entity join user_profile up on u.id_user = up.user_fk join profile p on up.profile_fk = p.id_profile join entity_department_occupation edo on e.id_entity = edo.entity_fk join occupation o on edo.occupation_fk = o.id_occupation WHERE username_user=? AND pwd_user=?;"
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