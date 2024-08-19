import { database } from '../../config/database.js';
import mysql from 'mysql2';

class Subject {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getSubjects() {
    try {
      const query = 'SELECT * FROM subject_message';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de Asuntos: ` + error);
      throw new Error(`Error al obtener los tipos de asunto de mensaje`);
    }
  }

  async getSubject(value_subject) {
    try {
      const query = 'SELECT * FROM subject_message where id_sm = ? or name_sm = ?';

      const [results] = await this.connection.promise().query(query, [value_subject, value_subject]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de asunto de mensaje: ` + error);
      throw new Error(`Error al obtener el tipo de asunto de mensaje`);
    }
  }

  async createSubject(name_sm) {
    try {
      const query =
        'INSERT INTO subject_message(name_sm, status_sm, created_at, updated_at) values(?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [name_sm]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de asunto de mensaje: ` + error);
      throw new Error(`Error al crear el tipo de tipo de asunto de mensaje`);
    }
  }

  async updateSubject(id_sm, name_sm, status_sm) {
    try {
      const query = 'UPDATE subject_message SET name_sm = ?, status_sm = ?, updated_at = now() where id_sm = ?';

      const [results] = await this.connection.promise().query(query, [name_sm, status_sm, id_sm]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de asunto de mensaje: ` + error);
      throw new Error(`Error al actualizar datos del tipo de tipo de asunto de mensaje`);
    }
  }

  async toggleStatusSubject(id_sm, status_sm) {
    try {
      const query = 'UPDATE subject_message SET status_sm = ?, updated_at = now() where id_sm = ?';

      const [results] = await this.connection.promise().query(query, [status_sm, id_sm]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de asunto de mensaje: ` + error);
      throw new Error(`Error al actualizar el estado del tipo de tipo de asunto de mensaje`);
    }
  }

  async deleteSubject(value_subject) {
    try {
      const query = 'DELETE from subject_message where id_sm = ? or name_sm = ?';

      const [results] = await this.connection.promise().query(query, [value_subject, value_subject]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de asunto de mensaje: ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }
}

export default Subject;
