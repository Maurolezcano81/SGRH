import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class UserModel extends BaseModel {
  constructor() {
    super('user', 'username_user');
    this.db = new Connection();
    this.conn = this.db.createCon();
    this.module = new BaseModel("module", "name_module")
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
}

export default UserModel