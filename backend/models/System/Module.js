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

  async updateModule(module_data) {
    try {
      const { id_module, name_module, url_module, status_module } = module_data;
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
      throw new Error(`Error al eliminar el modulo`);
    }
  }
}

export default Module;