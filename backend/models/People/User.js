import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class UserModel extends BaseModel {
  constructor() {
    super('user', 'username_user');
    this.db = new Connection();
    this.conn = this.db.createCon();
    this.module = new BaseModel("module", "name_module")
  }

  async getUserDataLogin(value) {
    try {
      const queryDataUser =
        'SELECT id_user, username_user, avatar_user, status_user, name_entity, lastname_entity, name_profile, url_module AS "home_page", u.profile_fk, name_occupation FROM user u JOIN entity e ON u.entity_fk = e.id_entity JOIN profile p ON u.profile_fk = p.id_profile JOIN profile_module pm ON pm.profile_fk = p.id_profile JOIN module m ON pm.module_fk = m.id_module JOIN entity_department_occupation edo ON e.id_entity = edo.entity_fk JOIN occupation o ON edo.occupation_fk = o.id_occupation WHERE username_user=? or id_user = ? AND url_module LIKE "%/inicio%"';

      const [resultsDataUser] = await this.conn.promise().query(queryDataUser, [value, value]);

      if (resultsDataUser.length < 1) {
        throw new Error('No se pudo obtener la información necesaria desde el servidor, intente nuevamente');
      }

      return resultsDataUser[0];
    } catch (error) {
      console.error('Error en modelo de User:', error);
      throw error;
    }
  }
  

  async canViewModule(id_user, urlToCheck) {
    try {
      const query =
        'select * from profile_module pm join module m on pm.module_fk = m.id_module join profile p on pm.profile_fk = p.id_profile  join user u on p.id_profile = u.profile_fk where u.id_user = ? and m.url_module = ?';

      const [results] = await this.conn.promise().query(query, [id_user, urlToCheck]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Modules: ` + error);
      throw new Error(`Error al comprobar el modulo del perfil`);
    }
  }


  async changePwdEmployee(id_user, pwd_user) {
    try {
      const query = 'UPDATE USER set pwd_user = ?, haspwdchanged_user = 1, updated_at = now() where id_user = ?';

      const [results] = await this.conn.promise().query(query, [pwd_user, id_user]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de user: ` + error);
      throw new Error(`Error al cambiar la contrasena del empleado`);
    }
  }

  async changePwdAdmin(id_user, pwd_user) {
    try {
      const query = 'UPDATE USER set pwd_user = ?, haspwdchanged_user = 0, updated_at = now() where id_user = ?';

      const [results] = await this.conn.promise().query(query, [pwd_user, id_user]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de : ` + error);
      throw new Error(`Error al `);
    }
  }

  async getUserProfile(id_user) {
    try {
        const query = "SELECT id_profile, name_profile from user u join profile p on u.profile_fk = p.id_profile where id_user = ?";

        const [results] = await this.conn.promise().query(query, [id_user]);

        return results;
    } catch (error) {
        console.error(`Error en modelo de User: ` + error);
        throw new Error(`Error al obtener los datos del usuario`);
    }
}
}

export default UserModel