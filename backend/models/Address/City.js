import { database } from "../../config/database.js"
import mysql from "mysql2";

class City{
    constructor(){
        this.connection = mysql.createConnection(database)
    }

    async getCityById(id_city) {
      try {
        const query = "Select * from city where id_city = ?";
    
        const [results] = await this.connection.promise().query(query, [id_city]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de City: `+error);
        throw new Error(`Error al obtener los datos de la ciudad`);
      }
    }

    async getCitiesByState(state_fk) {
      try {
        const query = "SELECT * FROM city where state_fk = ?";
    
        const [results] = await this.connection.promise().query(query, [state_fk]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de City: `+error);
        throw new Error(`Error al obtener las ciudades`);
      }
    }
}

export default City;