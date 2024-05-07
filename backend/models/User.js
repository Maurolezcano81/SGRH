import mysql from 'mysql2'
import { database } from '../config/database.js'

class User {
    constructor() {
        this.connection = mysql.createConnection(database);
    }

    async getUsername(username){
        try{
            const query = "Select username_user from user where username_user = ?;";

            const [rows, fields] = await this.connection.promise().query(query, [username]);

            if(rows.length === 0){
                return null;
            }

            const usernameObtained = rows[0].username_user;
            return usernameObtained;
        } catch(error){
            console.log("Error al obtener nombre de usuario :"+error)
        }
    }

    async createUser(username, pwd, avatar, idEntity) {
        try {
            const query = "INSERT INTO user(username_user, pwd_user, avatar_user, status_user, created_at, updated_at, entity_fk) VALUES(?,?,?,1,now(),now(),?)";

            const [rows, fields] = await this.connection.promise().query(query, [username, pwd, avatar, idEntity]);

            if (rows.length === 0) {
                return null;
            }

            const lastIdUser = rows.insertId;
            return lastIdUser;
        } catch (error) {
            console.error("Error al crear usuario" + error);
        }
    }
}

export default User;