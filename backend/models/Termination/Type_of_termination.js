import mysql from 'mysql2';
import { database } from '../../config/database.js';

class Type_of_termination {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getTots() {
    try {
      const query = 'SELECT id_tot, description_tot, status_tot from type_of_termination';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Type of Termination: ` + error);
      throw new Error(`Error al obtener el listado de tipo de baja`);
    }
  }

  async getTot(value) {
    try {
      const query = 'SELECT id_tot, description_tot, status_tot from type_of_termination where id_tot = ?';

      const [results] = await this.connection.promise().query(query, [value]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Type of Termination: ` + error);
      throw new Error(`Error al obtener el tipo de baja`);
    }
  }

  async createTot(name) {
    try {
      const query =
        'INSERT INTO type_of_termination(description_tot, status_tot, created_at, updated_at) VALUES(?,1,now(),now())';

      const [results] = await this.connection.promise().query(query, [name]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Type of Termination: ` + error);
      throw new Error(`Error al crear tipo de baja`);
    }
  }

  async updateTot(name, status, id) {
    try {
      const query = 'UPDATE type_of_termination SET description_tot = ?, status_tot = ?, updated_at = now() where id_tot = ?';

      const [results] = await this.connection.promise().query(query, [name, status, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Type of Termination: ` + error);
      throw new Error(`Error al actualizar el tipo de baja`);
    }
  }

  async toggleStatusTot(id, value) {
    try {
      const query = 'UPDATE type_of_termination SET status_tot=? where id_tot = ?';

      const [results] = await this.connection.promise().query(query, [value, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Type of Termination: ` + error);
      throw new Error(`Error al cambiar el estado del tipo de baja`);
    }
  }

  async deleteTot(id) {
    try {
      const query = 'DELETE from type_of_termination where id_tot = ?';

      const [results] = await this.connection.promise().query(query, [id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Type of Termination: ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }
}


export default Type_of_termination;
