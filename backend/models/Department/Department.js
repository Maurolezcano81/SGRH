import { database } from "../../config/database.js";
import mysql from "mysql2";

class Department{
    constructor(){
        this.connection = mysql.createConnection(database)
    }

    async getDepartments() {
      try {
        const query = "SELECT * FROM departments";
    
        const [results] = await this.connection.promise().query(query);
        return results;
      } catch(error) {
        console.error(`Error en modelo de Departments: `+error);
        throw new Error(`Error al obtener todos los departamentos`);
      }
    }
    
    async getDepartmentById(id_department) {
      try {
        const query = "SELECT * FROM department where id_department = ?";
    
        const [results] = await this.connection.promise().query(query, [id_department]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de Department: `+error);
        throw new Error(`Error al obtener el departamento`);
      }
    }

}

export default Department;