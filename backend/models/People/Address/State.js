import { database } from '../../../config/database.js';
import mysql from 'mysql2';

class State{
    constructor(){
        this.connection = mysql.createConnection(database);
    };

    async getStatesByCountry(fk_country) {
      try {
        const query = "SELECT * FROM state where country_fk = ?";
    
        const [results] = await this.connection.promise().query(query, [fk_country]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de State: `+error);
        throw new Error(`Error al obtener el listado de provincias`);
      }
    }

    async getStateById(id_state) {
      try {
        const query = "SELECT * FROM state where id_state = ?";
    
        const [results] = await this.connection.promise().query(query, [id_state]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de State: `+error);
        throw new Error(`Error al obtener la provincia`);
      }
    }
}

export default State;