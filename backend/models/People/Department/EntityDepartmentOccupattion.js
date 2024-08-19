import { database } from '../../../config/database.js';
import mysql from "mysql2";

class EntityDepartmentOccupation{
    constructor(){
        this.connection = mysql.createConnection(database);
    }

    async createEntityDepartmentOccupation(entity_department_occupation_data) {
      try {
        const {entity_fk, department_fk, occupation_fk} = entity_department_occupation_data
        const query = "INSERT INTO entity_department_occupation(entity_fk, department_fk, occupation_fk, status_edo, created_at, updated_at) VALUES(?, ?, ?, 1, now(), now())";
    
        const [results] = await this.connection.promise().query(query, [entity_fk, department_fk, occupation_fk]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de : `+error);
        throw new Error(`Error al `);
      }
    }

}

export default EntityDepartmentOccupation;