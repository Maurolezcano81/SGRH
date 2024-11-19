import mysql from 'mysql2';
import { database } from '../../config/database.js';

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

  async getUserDataLogin(value) {
    try {

      // 'SELECT id_user, username_user, avatar_user, status_user, name_entity, lastname_entity, name_profile, url_module AS "home_page", u.profile_fk, name_occupation FROM user u JOIN entity e ON u.entity_fk = e.id_entity JOIN profile p ON u.profile_fk = p.id_profile JOIN profile_module pm ON pm.profile_fk = p.id_profile JOIN module m ON pm.module_fk = m.id_module JOIN entity_department_occupation edo ON e.id_entity = edo.entity_fk JOIN occupation o ON edo.occupation_fk = o.id_occupation WHERE username_user=? or id_user = ? AND url_module LIKE "%/inicio%"';

      const queryDataUser =
        `
            SELECT
                u.id_user,
                u.username_user,
                u.avatar_user,
                u.status_user,
                tse.name_tse,
                e.name_entity,
                e.lastname_entity,
                p.name_profile,
                MIN(m.url_module) AS "home_page",  -- Obtener el primer resultado de url_module
                u.profile_fk,
                o.name_occupation
            FROM
                user u
            JOIN entity e ON
                u.entity_fk = e.id_entity
            JOIN profile p ON
                u.profile_fk = p.id_profile
            JOIN profile_module pm ON
                pm.profile_fk = p.id_profile
            JOIN module m ON
                pm.module_fk = m.id_module
            JOIN entity_department_occupation edo ON
                e.id_entity = edo.entity_fk
            JOIN occupation o ON
                edo.occupation_fk = o.id_occupation
            LEFT JOIN employee emp ON emp.entity_fk = e.id_entity
            LEFT JOIN type_status_employee tse ON emp.tse_fk = tse.id_tse 
            WHERE
                u.username_user = ?
                or u.id_user = ?
                AND m.url_module LIKE "%/inicio%"
            GROUP BY
                u.id_user, u.username_user, u.avatar_user, u.status_user, tse.name_tse,
                e.name_entity, e.lastname_entity, p.name_profile, u.profile_fk, o.name_occupation;
            `

      const [resultsDataUser] = await this.connection.promise().query(queryDataUser, [value, value]);

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
