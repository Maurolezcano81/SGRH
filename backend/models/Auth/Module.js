import mysql from 'mysql2';
import { database } from '../../config/database.js';

class Module {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getModules() {
    try {
      const query = 'SELECT id_module, name_module, url_module, status_module from module';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Module: ` + error);
      throw new Error(`Error al obtener el listado de modulos`);
    }
  }

  async getModulesByProfile(id_profile) {
    try {
      const query =
        'SELECT id_module, id_pm, name_module, url_module FROM Module m join profile_module pm on pm.module_fk = m.id_module join profile p on pm.profile_fk = id_profile where id_profile = ?';

      const [results] = await this.connection.promise().query(query, [id_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Modules: ` + error);
      throw new Error(`Error al obtener el listado de modulos`);
    }
  }

  async getModulesOutProfile(id_profile) {
    try {
      const query =
        'SELECT m.url_module, m.id_module FROM module m LEFT JOIN profile_module pm ON m.id_module = pm.module_fk AND pm.profile_fk = ?  WHERE pm.module_fk IS NULL;';
      const [results] = await this.connection.promise().query(query, [id_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Modules: ` + error);
      throw new Error(`Error al obtener el listado de modulos`);
    }
  }

  async getModule(value_module) {
    try {
      const query =
        'SELECT id_module, name_module, url_module, status_module from module where id_module = ? or name_module = ?';

      const [results] = await this.connection.promise().query(query, [value_module, value_module]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Module: ` + error);
      throw new Error(`Error al obtener el modulo`);
    }
  }

  async createModule(name, url) {
    try {
      const query =
        'INSERT INTO module(name_module, url_module, status_module, created_at, updated_at) values(?,?,1,now(),now())';

      const [results] = await this.connection.promise().query(query, [name, url]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Modulo: ` + error);
      throw new Error(`Error al crear el modulo`);
    }
  }

  async updateModule(id_module, name_module, url_module, status_module) {
    try {
      const query =
        'UPDATE module SET name_module = ?, url_module = ?, status_module = ?, updated_at = now() where id_module = ?';

      const [results] = await this.connection
        .promise()
        .query(query, [name_module, url_module, status_module, id_module]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Modulo: ` + error);
      throw new Error(`Error al actualizar el modulo`);
    }
  }

  async toggleStatusModule(id, status) {
    try {
      const query = 'UPDATE module SET status_module = ?, updated_at = now() where id_module = ?';

      const [results] = await this.connection.promise().query(query, [status, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Module: ` + error);
      throw new Error(`Error al actualizar el estado del modulo`);
    }
  }

  async deleteModule(id) {
    try {
      const query = 'DELETE from module where id_module = ?';

      const [results] = await this.connection.promise().query(query, [id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Module: ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }

  async bindModuleToProfile(id_module, id_profile) {
    try {
      const query =
        'INSERT INTO profile_module(profile_fk, module_fk, status_pm, created_at, updated_at) VALUES(?,?,1,now(),now())';

      const [results] = await this.connection.promise().query(query, [id_profile, id_module]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Module:` + error);
      throw new Error(`Error al añadir el modulo al perfil`);
    }
  }

  async unBindModuleToProfile(id_profile_module) {
    try {
      const query = 'DELETE from profile_module where id_pm = ?';

      const [results] = await this.connection.promise().query(query, [id_profile_module]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Modules: ` + error);
      throw new Error(`Error al eliminar el modulo del perfil`);
    }
  }

  async canViewModule(id_user, urlToCheck) {
    try {
      const query =
        'select * from profile_module pm join module m on pm.module_fk = m.id_module  join profile p on pm.profile_fk = p.id_profile  join user u on p.id_profile = u.profile_fk where u.id_user = ? and m.url_module = ?';

      const [results] = await this.connection.promise().query(query, [id_user, urlToCheck]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Modules: ` + error);
      throw new Error(`Error al comprobar el modulo del perfil`);
    }
  }
}

export default Module;
