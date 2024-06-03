import { database } from '../../config/database.js';
import mysql from 'mysql2';

class Entity {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async createEntity(entity_data) {
    try {

      const { name_entity, lastname_entity, date_birth_entity, sex_fk, nacionality_fk } = entity_data;

      const query =
        'INSERT INTO entity(name_entity, lastname_entity, date_birth_entity, sex_fk, nacionality_fk, status_entity, created_at, updated_at) values(?, ?, ?, ?, ?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [name_entity, lastname_entity, date_birth_entity, sex_fk, nacionality_fk]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Entity: ` + error);
      throw new Error(`Error al crear los datos de la persona`);
    }
  }
}

export default Entity;
