import mysql from 'mysql2';
import { database } from '../config/database.js';

class Employee {
    constructor(){
        this.connection = mysql.createConnection(database);
    }

    async createEmployee(file, date_entry, idEntity){
        try {
            
            const query = "INSERT INTO employee(file_employee, date_entry_employee, status_employee, entity_fk, created_at, updated_at) VALUES(?,?,1,?,now(),now())";

            const [rows, fields] = await this.connection.promise().query(query, [file, date_entry, idEntity]);

            if(rows.length === 0){
                return null;
            }

            const lastInsertId = rows.insertId;
            return lastInsertId;
        } catch (error) {
            console.error("Error en insert empleado: "+error);
        }
    }
}

export default Employee;