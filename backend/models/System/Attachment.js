import { database } from '../../config/database.js';
import mysql from 'mysql2';

class Attachment {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getAttachments() {
    try {
      const query = 'SELECT * FROM type_attachment';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de Anexos: ` + error);
      throw new Error(`Error al obtener los tipos de anexos`);
    }
  }

  async getAttachment(value_attachment) {
    try {
      const query = 'SELECT * FROM type_attachment where id_ta = ? or name_ta = ?';

      const [results] = await this.connection.promise().query(query, [value_attachment, value_attachment]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de anexos: ` + error);
      throw new Error(`Error al obtener el tipo de anexo`);
    }
  }

  async createAttachment(name_ta) {
    try {
      const query =
        'INSERT INTO type_attachment(name_ta, status_ta, created_at, updated_at) values(?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [name_ta]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de anexos: ` + error);
      throw new Error(`Error al crear el tipo de tipo de anexo`);
    }
  }

  async updateAttachment(id_ta, name_ta, status_ta) {
    try {
      const query = 'UPDATE type_attachment SET name_ta = ?, status_ta = ?, updated_at = now() where id_ta = ?';

      const [results] = await this.connection.promise().query(query, [name_ta, status_ta, id_ta]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de anexos: ` + error);
      throw new Error(`Error al actualizar datos del tipo de tipo de anexo`);
    }
  }

  async toggleStatusAttachment(id_ta, status_ta) {
    try {
      const query = 'UPDATE type_attachment SET status_ta = ?, updated_at = now() where id_ta = ?';

      const [results] = await this.connection.promise().query(query, [status_ta, id_ta]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de anexo: ` + error);
      throw new Error(`Error al actualizar el estado del tipo de tipo de anexo`);
    }
  }

  async deleteAttachment(value_attachment) {
    try {
      const query = 'DELETE from type_attachment where id_ta = ? or name_ta = ?';

      const [results] = await this.connection.promise().query(query, [value_attachment, value_attachment]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de tipo de anexo: ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }
}

export default Attachment;