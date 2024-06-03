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
}

export default City;