import { database } from '../../config/database.js';
import mysql from 'mysql2';

class EntityDocument {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async assignDocumentToEntity(document_entity_data) {
    const {entity_fk, document_fk, value_ed} = document_entity_data
    try {
      const query =
        'INSERT INTO entity_document(entity_fk, document_fk, value_ed, status_ed, created_at, updated_at) VALUES(?, ?, ?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [entity_fk, document_fk, value_ed]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Entity: ` + error);
      throw new Error(`Error al cargar el documento`);
    }
  }
}

export default EntityDocument;