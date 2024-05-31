import mysql from 'mysql2';
import { database } from '../../config/database.js';
import { comparePwd } from '../../middlewares/Authorization.js';

class UserCredentials {
    constructor() {
        this.connection = mysql.createConnection(database);
    }
    async getUser(username, pwd) {
        try {

            const queryCheckUsername = "Select * from user where username_user = ?";

            const [resultsCheckUsername] = await this.connection.promise().query(queryCheckUsername, [username]);

            if(resultsCheckUsername.length < 1){
                throw new Error("Usuario no encontrado o contraseña incorrecta");
            }


            const checkPwd = await comparePwd(pwd, resultsCheckUsername[0].pwd_user);

            if(checkPwd){
                throw new Error("Usuario no encontrado o contraseña incorrecta");
            }


            const queryDataUser = "SELECT id_user, username_user, avatar_user, status_user, name_entity, lastname_entity, name_profile, name_occupation FROM user u JOIN entity e on u.entity_fk = e.id_entity join profile p on u.profile_fk = p.id_profile join entity_department_occupation edo on e.id_entity = edo.entity_fk join occupation o on edo.occupation_fk = o.id_occupation WHERE username_user=?"
            const [resultsDataUser] = await this.connection.promise().query(queryDataUser, [username.toLowerCase()]);
            
            if (resultsDataUser.length === 0) {
                throw new Error("No se puedo obtener la informacion necesaria desde el servidor, intente nuevamente");
            }

            return resultsDataUser[0];
        } catch (e) {
            console.error(e + ' model');
            throw e;
        }
    }
}

export default UserCredentials;