import mysql from 'mysql2';
import { database } from '../../config/database.js';

class StatusRequest {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getStatusesRequest() {
    try {
      const query = 'SELECT id_sr, name_sr, status_sr from status_request';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Status Request: ` + error);
      throw new Error(`Error al obtener listado de tipo de estados`);
    }
  }

  async getStatusRequest(value) {
    try {
      const query = 'SELECT id_sr, name_sr, status_sr from status_request where id_sr = ? or name_sr = ?';

      const [results] = await this.connection.promise().query(query, [value, value]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Status Request: ` + error);
      throw new Error(`Error al obtener el tipo de estado`);
    }
  }

  async createStatusRequest(name) {
    try {
      const query = 'INSERT INTO status_request(name_sr, status_sr, created_at, updated_at) values(?, 1, now(),now())';

      const [results] = await this.connection.promise().query(query, [name]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de : Status Request` + error);
      throw new Error(`Error al crear el tipo de estado`);
    }
  }

  async updateStatusRequest(name, status, id) {
    try {
      const query = 'UPDATE status_request SET name_sr = ?, status_sr = ?, updated_at = now() where id_sr = ?';

      const [results] = await this.connection.promise().query(query, [name, status, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Status Request: ` + error);
      throw new Error(`Error al actualizar el tipo de estado`);
    }
  }

  async toggleStatusRequest(id, value) {
    try {
      const query = "UPDATE status_request SET status_sr = ? where id_sr = ?";
  
      const [results] = await this.connection.promise().query(query, [value, id]);
      return results;
    } catch(error) {
      console.error(`Error en modelo de Status Request: `+error);
      throw new Error(`Error al actualizar el estado`);
    }
  }

  async deleteStatusRequest(id) {
    try {
      const query = "Delete from status_request where id_sr = ?";
  
      const [results] = await this.connection.promise().query(query, [id]);
      return results;
    } catch(error) {
      console.error(`Error en modelo de Status Request: `+error);
      throw new Error(`Error al eliminar tipo de estado`);
    }
  }
}

export default StatusRequest;