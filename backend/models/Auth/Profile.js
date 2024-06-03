import { database } from '../../config/database.js';
import mysql from 'mysql2';

class Profile {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getProfile(value_profile) {
    try {
      const query = 'Select * from profile where id_profile = ? or name_profile = ?';

      const [results] = await this.connection.promise().query(query, [value_profile, value_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el perfil`);
    }
  }
}

export default Profile;