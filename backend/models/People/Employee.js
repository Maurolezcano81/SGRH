import { database } from '../../config/database.js';
import mysql from 'mysql2';

class Employee {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getEmployee(value_employee) {
    try {
      const query = 'Select * from employee where id_employee = ? or file_employee = ?';

      const [results] = await this.connection.promise().query(query, [value_employee, value_employee]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Employee: ` + error);
      throw new Error(`Error al obtener el legajo de empleado`);
    }
  }

  async createEmployee(employee_data) {
    try {
      const {file_employee, date_entry_employee, entity_fk} = employee_data

      const query =
        'Insert into employee(file_employee, date_entry_employee, status_employee, entity_fk, created_at, updated_at) values(?,?,1,?,now(),now())';

      const [results] = await this.connection.promise().query(query, [file_employee, date_entry_employee, entity_fk]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Employee: ` + error);
      throw new Error(`Error al crear los datos de empleado`);
    }
  }
}


export default Employee