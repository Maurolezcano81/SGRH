import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class UserModel extends BaseModel {
  constructor() {
    super('user', 'username_user');
    this.db = new Connection();
    this.conn = this.db.createCon();
    this.module = new BaseModel("module", "name_module")
  }


  async getUsersInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
    try {
      const { whereClause, values } = this.buildWhereClause(filters);
      const query = `SELECT 
              u.id_user, 
              u.username_user, 
              e.name_entity, 
              e.lastname_entity, 
              u.avatar_user, 
              MAX(ed.value_ed) AS value_ed, 
              MAX(ec.value_ec) AS value_ec, 
              MAX(emp.file_employee) AS file_employee, 
              MAX(o.name_occupation) AS name_occupation, 
              MAX(o.salary_occupation) AS salary_occupation, 
              MAX(d.name_department) AS name_department, 
              u.status_user, 
              p.name_profile
              FROM user u
              JOIN profile p ON u.profile_fk = p.id_profile 
              JOIN entity e ON u.entity_fk = e.id_entity 
              LEFT JOIN entity_document ed ON ed.entity_fk = e.id_entity 
              LEFT JOIN entity_contact ec ON ec.entity_fk = e.id_entity 
              LEFT JOIN employee emp ON emp.entity_fk = e.id_entity 
              LEFT JOIN entity_department_occupation edo ON edo.entity_fk = e.id_entity 
              LEFT JOIN occupation o ON edo.occupation_fk = o.id_occupation 
              LEFT JOIN department d ON edo.department_fk = d.id_department 
              ${whereClause}
              GROUP BY u.id_user, u.username_user, e.name_entity, e.lastname_entity, u.avatar_user, u.status_user, p.name_profile
              ORDER BY ${orderBy} ${order} 
              LIMIT ? OFFSET ?`;
      const [results] = await this.con.promise().query(query, [...values, limit, offset]);
      return results;
    } catch (error) {
      console.error("Error en Users Model:", error.message);
      throw new Error("Error en Users Model: " + error.message);
    }
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