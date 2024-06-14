import { database } from '../../config/database.js';
import mysql from 'mysql2';

class User {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getUserByUsername(username) {
    try {
      const {} = {};
      const query = 'Select * from user where username_user = ?';

      const [results] = await this.connection.promise().query(query, [username]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de User: ` + error);
      throw new Error(`Error al comprobar el nombre de usuario`);
    }
  }

  async createUser(user_data) {
    try {
      const { username_user, pwd_user, avatar_user, entity_fk, profile_fk } = user_data;
      const query =
        'INSERT INTO user(username_user, pwd_user, avatar_user,haspwdchanged_user, status_user, created_at, updated_at, entity_fk, profile_fk) VALUES(?,?,?,0, 1,now(),now(),?,?)';

      const [results] = await this.connection
        .promise()
        .query(query, [username_user, pwd_user, avatar_user, entity_fk, profile_fk]);

      return results;
    } catch (error) {
      console.error(`Error en modelo de User: ` + error);
      throw new Error(`Error al crear datos de usuario`);
    }
  }

  async hasToChangePwd(id_user) {
    try {
      const query = 'SELECT * FROM USER where id_user = ? and haspwdchanged_user = 0';

      const [results] = await this.connection.promise().query(query, [id_user]);

      console.log(results);
      return results;
    } catch (error) {
      console.error(`Error en modelo de User: ` + error);
      throw new Error(`Error al crear datos de usuario`);
    }
  }
}

export default User;
