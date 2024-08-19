import mysql from 'mysql2';
import { database } from '../../../config/database.js';

class Country {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getCountries() {
    try {
      const query = 'SELECT id_country,name_country, abbreviation_country, status_country FROM country';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Pais: ` + error);
      throw new Error(`Error al obtener listado de paises`);
    }
  }

  async getCountry(value) {
    try {
      const query =
        'SELECT id_country,name_country, abbreviation_country, status_country from country where id_country = ? or name_country = ? or abbreviation_country = ? ';

      const [results] = await this.connection.promise().query(query, [value, value, value]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Pais: ` + error);
      throw new Error(`Error al obtener el país`);
    }
  }

  async createCountry(name, abbreviation) {
    try {
      const query =
        'INSERT INTO country(name_country, abbreviation_country, status_country, created_at, updated_at) VALUES(?, ?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [name, abbreviation]);

      console.log(results);

      return results;
    } catch (error) {
      console.error(`Error en modelo de Pais: ` + error);
      throw new Error(`Error al crear el país`);
    }
  }

  async updateCountry(id_country, name_country, abbreviation_country, status_country) {
    try {
      const query =
        'UPDATE country SET name_country = ?, abbreviation_country = ?, status_country = ?, updated_at = now() where id_country = ?';

      const [results] = await this.connection
        .promise()
        .query(query, [name_country, abbreviation_country, status_country, id_country]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Pais: ` + error);
      throw new Error(`Error al actualizar el país`);
    }
  }

  async toggleStatusCountry(id, status) {
    try {
      const query = 'UPDATE country SET status_country = ?, updated_at = now() where id_country = ?';

      const [results] = await this.connection.promise().query(query, [status, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Pais: ` + error);
      throw new Error(`Error al cambiar el estado del país`);
    }
  }

  async deleteCountry(value) {
    try {
      const query = 'DELETE FROM country where id_country = ? or name_country = ? or abbreviation_country =?';

      const [results] = await this.connection.promise().query(query, [value, value, value]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Pais: ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }
}

export default Country;
