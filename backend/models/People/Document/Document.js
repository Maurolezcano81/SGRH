import { database } from '../../../config/database.js';
import mysql from 'mysql2';

class Document {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getDocuments() {
    try {
      const query = 'SELECT * FROM document';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Documentos: ` + error);
      throw new Error(`Error al obtener los documentos`);
    }
  }

  async getDocument(value_document) {
    try {
      const query = 'SELECT * FROM document where id_document = ? or name_document = ?';

      const [results] = await this.connection.promise().query(query, [value_document, value_document]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Documento: ` + error);
      throw new Error(`Error al obtener el documento`);
    }
  }

  async createDocument(name_document) {
    try {
      const query =
        'INSERT INTO document(name_document, status_document, created_at, updated_at) values(?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [name_document]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Documento: ` + error);
      throw new Error(`Error al crear el tipo de documento`);
    }
  }

  async updateDocument(id_document, name_document, status_document) {
    try {
      const query =
        'UPDATE document SET name_document = ?, status_document = ?, updated_at = now() where id_document = ?';

      const [results] = await this.connection.promise().query(query, [name_document, status_document, id_document]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Documento: ` + error);
      throw new Error(`Error al actualizar datos del tipo de documento`);
    }
  }

  async toggleStatusDocument(id_document, status_document) {
    try {
      const query = 'UPDATE document SET status_document = ?, updated_at = now() where id_document = ?';

      const [results] = await this.connection.promise().query(query, [status_document, id_document]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de documento: ` + error);
      throw new Error(`Error al actualizar el estado del tipo de documento`);
    }
  }

  async deleteDocument(value_document) {
    try {
      const query = 'DELETE from document where id_document = ? or name_document = ?';

      const [results] = await this.connection.promise().query(query, [value_document, value_document]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de documento: ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }
}

export default Document;