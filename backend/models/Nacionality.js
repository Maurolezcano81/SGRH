import mysql from 'mysql2';
import { database } from '../config/database';

class Nacionality {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getNacionalities() {
    try {
      const query =
        'SELECT id_nacionality, name_nacionality, abbreviation_nacionality, status_nacionality from nacionality';

      const [results] = await this.connection.promise().query(query);

      return results;
    } catch (error) {
      console.error('Error en Modelo de Nacionalidad: ' + error);
      throw new Error('Ha ocurrido un error al obtener el listado de nacionalidades');
    }
  }

  async getNacionality(value) {
    try {
      const query =
        'Select id_nacionality, name_nacionality,abbreviation_nacionality, status_nacionality from nacionality where id_nacionality = ? or name_nacionality = ? or abbreviation_nacionality = ?';

      const [results] = await this.connection.promise().query(query, [value]);

      return results[0];
    } catch (error) {
      console.error('Error en Modelo de Nacionalidad: ' + error);
      throw new Error('Ha ocurrido un error al obtener la nacionalidad');
    }
  }

  async createNacionality(nacionality_data) {
    try {
      const { name, abbreviation } = nacionality_data;

      const query =
        'INSERT INTO nacionality(name_nacionality, abbreviation_nacionality, status_nacionality, created_at, updated_at) VALUES(?,?,1,now(),now())';

      const [results] = await this.connection.promise().query(query, [name, abbreviation]);

      return results[0];
    } catch (error) {
      console.error('Error en Modelo de Nacionalidad: ' + error);
      throw new Error('Ha ocurrido un error al crear la nacionalidad');
    }
  }

  async updateNacionality(nacionality_data) {
    try {
      const { name, abbreviation } = nacionality_data;

      const query =
        'UPDATE nacionality SET name_nacionality = ?, SET abbreviation_nacionality = ?, SET updated_at = now()';

      const [results] = await this.connection.promise().query(query, [name, abbreviation]);

      return results;
    } catch (error) {
      console.error('Error en Modelo de Nacionalidad: ' + error);
      throw new Error('Ha ocurrido un error al actualizar la nacionalidad');
    }
  }

  async toggleStatusNacionality(value) {
    try {
      const query = "UPDATE nacionality SET status_nacionality = ?, SET updated_at = now()";
  
      const [results] = await this.connection.promise().query(query, [value]);
      return results;
    } catch(error) {
      console.error(`Error en modelo de Nacionalidad:`+error);
      throw new Error(`Error al Cambiar el estado de la nacionalidad`);
    }
  }

  async deleteNacionality(id) {
    try {
      const query = "DELETE nacionality where id_nacionality = ?";
  
      const [results] = await this.connection.promise().query(query, [id]);
      return results;
    } catch(error) {
      console.error(`Error en modelo de Nacionalidad: `+error);
      throw new Error(`Error al Eliminar la nacionalidad`);
    }
  }

}

export default Nacionality;
