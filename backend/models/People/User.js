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
      const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
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
              u.status_user as status, 
              tse.name_tse,
              p.name_profile
              FROM user u
              JOIN profile p ON u.profile_fk = p.id_profile 
              JOIN entity e ON u.entity_fk = e.id_entity 
              LEFT JOIN entity_document ed ON ed.entity_fk = e.id_entity 
              LEFT JOIN entity_contact ec ON ec.entity_fk = e.id_entity 
              LEFT JOIN employee emp ON emp.entity_fk = e.id_entity 
              LEFT JOIN type_status_employee tse on emp.tse_fk = tse.id_tse
              LEFT JOIN entity_department_occupation edo ON edo.entity_fk = e.id_entity 
              LEFT JOIN occupation o ON edo.occupation_fk = o.id_occupation 
              LEFT JOIN department d ON edo.department_fk = d.id_department 
              where status_edo = 1 
                ${whereClause.length > 0 ? 'AND' : ''}
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

  async getTotalUsersInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
    try {
      const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
      const query = `SELECT 
              COUNT (DISTINCT u.id_user) as 'total'
              FROM user u
              JOIN profile p ON u.profile_fk = p.id_profile 
              JOIN entity e ON u.entity_fk = e.id_entity 
              LEFT JOIN entity_document ed ON ed.entity_fk = e.id_entity 
              LEFT JOIN entity_contact ec ON ec.entity_fk = e.id_entity 
              LEFT JOIN employee emp ON emp.entity_fk = e.id_entity 
              LEFT JOIN type_status_employee tse on emp.tse_fk = tse.id_tse
              LEFT JOIN entity_department_occupation edo ON edo.entity_fk = e.id_entity 
              LEFT JOIN occupation o ON edo.occupation_fk = o.id_occupation 
              LEFT JOIN department d ON edo.department_fk = d.id_department 
              where status_edo = 1 
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
              `
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
      const query = 'UPDATE USER set pwd_user = ?, haspwdchanged_user = 0, updated_at = now() where id_user = ?';

      const [results] = await this.conn.promise().query(query, [pwd_user, id_user]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de user: ` + error);
      throw new Error(`Error al cambiar la contrasena del empleado`);
    }
  }

  async changePwdAdmin(id_user, pwd_user) {
    try {
      const query = 'UPDATE USER set pwd_user = ?, haspwdchanged_user = 1, updated_at = now() where id_user = ?';

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


  async getDataEmployeeForAudit(id_user) {
    try {
      const query = `
            select 
              id_edo,
              id_user,
              avatar_user,
              username_user,
              name_entity,
              status_employee,
              lastname_entity,
              file_employee,
              name_department,
              name_occupation,
              status_employee,
              status_entity,
              status_user
            from employee emp
              join entity e on emp.entity_fk = e.id_entity 
              join user u on e.id_entity = u.entity_fk 
              join entity_department_occupation edo on edo.entity_fk = e.id_entity 
              join department d on d.id_department = edo.department_fk 
              join occupation o  on edo.occupation_fk = o.id_occupation 
            where id_user = ?
            group by name_entity, lastname_entity
            order by edo.created_at asc
;
            `
      const [results] = await this.conn.promise().query(query, [id_user])
      return results;
    } catch (error) {
      console.error("Error en Users Quiz Performance:", error.message);
      throw new Error("Error en Users Quiz Performance: " + error.message);
    }
  }

  async getAllUsersData() {
    try {
      const query = `
        select
          id_user,
          id_entity,
          name_entity,
          lastname_entity,
          avatar_user
        from user u
        join entity e on u.entity_fk = e.id_entity  
        order by name_entity asc    
            ;
            `
      const [results] = await this.conn.promise().query(query, [])
      return results;
    } catch (error) {
      console.error("Error en Users Quiz Performance:", error.message);
      throw new Error("Error en Users Quiz Performance: " + error.message);
    }

  }

}

export default UserModel