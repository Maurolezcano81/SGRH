import mysql from 'mysql2';
import { database } from '../../config/database.js';

class Occupation {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getOccupations() {
    try {
      const query =
        'SELECT id_occupation, name_occupation, status_occupation, salary_occupation from occupation';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Occupation: ` + error);
      throw new Error(`Error al obtener listado de puestos de trabajo`);
    }
  }

  async getOccupation(value) {
    try {
      const query =
        'SELECT id_occupation, name_occupation, salary_occupation, status_occupation from occupation where id_occupation = ? or name_occupation = ?';

      const [results] = await this.connection.promise().query(query, [value, value]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Occupation: ` + error);
      throw new Error(`Error al obtener el puesto de trabajo`);
    }
  }

  async createOccupation(name, salary) {
    try {
      const query =
        'INSERT INTO occupation(name_occupation, salary_occupation, status_occupation, created_at, updated_at) VALUES(?,?,1,now(),now())';

      const [results] = await this.connection.promise().query(query, [name, salary]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Ocuppation: ` + error);
      throw new Error(`Error al crear puesto de trabajo`);
    }
  }

  async updateOccupation(occupation_data) {
    const { id_occupation, name_occupation, salary_occupation, status_occupation } = occupation_data;
    try {
      const query =
        'UPDATE occupation SET name_occupation = ?, salary_occupation = ?, status_occupation = ? where id_occupation = ?';

      const [results] = await this.connection.promise().query(query, [name_occupation, salary_occupation, status_occupation, id_occupation]);

      return results;
    } catch (error) {
      console.error(`Error en modelo de Occupation: ` + error);
      throw new Error(`Ha ocurrido un error al actualizar el puesto de trabajo`);
    }
  }

  async toggleStatusOccupation(id, value) {
    try {
      const query = 'UPDATE occupation SET status_occupation = ? where id_occupation = ?';

      const [results] = await this.connection.promise().query(query, [value, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Occupation: ` + error);
      throw new Error(`Error al actualizar estado de puesto de trabajo`);
    }
  }

  async deleteOccupation(id) {
    try {
      const query = 'DELETE from occupation where id_occupation = ?';

      const [results] = await this.connection.promise().query(query, [id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de : ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }
}

export default Occupation;
