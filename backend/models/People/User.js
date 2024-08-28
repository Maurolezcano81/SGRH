import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class UserModel extends BaseModel{
  constructor(){
    super('user', 'id_user');
    this.db = new Connection();
    this.conn = this.db.createCon();
    this.model = new BaseModel('user', 'username_user');
    this.module = new BaseModel("module", "name_module")
  }

  async hasToChangePwd(id_user){
    try {
        const query = 'SELECT * FROM USER where id_user = ?';
  
        const [results] = await this.conn.promise().query(query, [id_user]);
        return results;
      } catch (error) {
        console.error(`Error en modelo de User: ` + error);
        throw new Error(`Error al crear datos de usuario`);
      }
  }

  async canViewModule(id_user, urlToCheck){
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
}

export default UserModel