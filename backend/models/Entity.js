import mysql from 'mysql2';
import { database } from '../config/database.js';

class Entity {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async createEntity(name, lastname, date_birth, sex, nacionality) {
    try {
      const query =
        'INSERT INTO entity(name_entity, lastname_entity, date_birth_entity, sex_fk, nacionality_fk, status_entity, created_at, updated_at) values(?,?,?,?,?,1,now(),now());';

      const [rows, fields] = await this.connection
        .promise()
        .query(query, [name, lastname, date_birth, sex, nacionality]);

      if (rows.length === 0) {
        return null;
      }

      const lastIdEntity = rows.insertId;
      return lastIdEntity;
    } catch (e) {
      console.error(e);
    }
  }
}

export default Entity;
