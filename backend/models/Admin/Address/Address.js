import { database } from '../../../config/database.js';
import mysql from 'mysql2';

class Address {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async createAddress(address_data) {
    try {
      const { description_address, city_fk, entity_fk } = address_data;
      const query =
        'INSERT INTO address(description_address, city_fk, entity_fk, status_address, created_at, updated_at) values (?, ?, ?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [description_address, city_fk, entity_fk]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Address: ` + error);
      throw new Error(`Error al crear la direccion de domicilio`);
    }
  }
}

export default Address;