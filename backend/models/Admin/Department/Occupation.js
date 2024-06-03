import { database } from "../../../config/database.js";
import mysql from "mysql2";

class Occupation{
    constructor(){
        this.connection = mysql.createConnection(database)
    }

    async getOccupationById(id_occupation) {
      try {
        const query = "SELECT * FROM occupation where id_occupation = ?";
    
        const [results] = await this.connection.promise().query(query, [id_occupation]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de Occupation: `+error);
        throw new Error(`Error al obtener el puesto de trabajo`);
      }
    }
}

export default Occupation;