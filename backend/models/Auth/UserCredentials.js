import mysql from 'mysql2';
import { database } from '../../config/database.js';
import { comparePwd } from '../../middlewares/Authorization.js';

class UserCredentials {
  constructor() {
    this.connection = mysql.createConnection(database);
  }
  async getUser(username) {
    try {
      const queryCheckUsername = 'SELECT * FROM user WHERE username_user = ?';

      const [resultsCheckUsername] = await this.connection.promise().query(queryCheckUsername, [username]);

      return resultsCheckUsername;
    } catch (error) {
      console.error('Error en modelo de User:', error);
      throw new Error('Error del servidor');
    }
  }

  async getUserDataLogin(username) {
    try {
      const queryDataUser =
        'SELECT id_user, username_user, avatar_user, status_user, name_entity, lastname_entity, name_profile, url_module AS "home_page", u.profile_fk, name_occupation FROM user u JOIN entity e ON u.entity_fk = e.id_entity JOIN profile p ON u.profile_fk = p.id_profile JOIN profile_module pm ON pm.profile_fk = p.id_profile JOIN module m ON pm.module_fk = m.id_module JOIN entity_department_occupation edo ON e.id_entity = edo.entity_fk JOIN occupation o ON edo.occupation_fk = o.id_occupation WHERE username_user=? AND url_module LIKE "%/inicio%"';

      const [resultsDataUser] = await this.connection.promise().query(queryDataUser, [username.toLowerCase()]);

      if (resultsDataUser.length < 1) {
        throw new Error('No se pudo obtener la información necesaria desde el servidor, intente nuevamente');
      }

      return resultsDataUser[0];
    } catch (error) {
      console.error('Error en modelo de User:', error);
      throw error;
    }
  }
}

export default UserCredentials;
