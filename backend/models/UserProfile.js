import mysql from 'mysql2';
import { database } from "../config/database.js";

class UserProfile {
    constructor() {
        this.connection = mysql.createConnection(database);
    };

    async assignProfileToUser(userProfile_data) {
        try {
            const query = "INSERT INTO user_profile(user_fk, profile_fk,status_up, created_at, updated_at) VALUES(?,?,1,now(),now())"
            const {idUser, idProfile } = userProfile_data
            const [rows, fields] = await this.connection.promise().query(query, [idUser, idProfile])

            if(rows.length === 0){
                return null
            };

            const lastInsertId = rows.insertId;
            return lastInsertId;
        } catch (error) {
            console.error("Error en USERPROFILE: " + error)
        }
    }
}

export default UserProfile;