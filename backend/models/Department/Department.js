import { database } from '../../config/database.js';
import mysql from 'mysql2';

class Department {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getDepartments() {
    try {
      const query = 'SELECT * FROM department';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Departments: ` + error);
      throw new Error(`Error al obtener todos los departamentos`);
    }
  }

  async getDepartment(id_department) {
    try {
      const query = 'SELECT * FROM department where id_department = ? or name_department = ?';

      const [results] = await this.connection.promise().query(query, [id_department, id_department]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Department: ` + error);
      throw new Error(`Error al obtener el departamento`);
    }
  }

  async createDepartment(name_department) {
    try {
      const query =
        'INSERT INTO department(name_department, status_department, created_at, updated_at) VALUES(? , 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [name_department]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Department: ` + error);
      throw new Error(`Error al crear el departamento`);
    }
  }

  async updateDepartment(id_department, name_department, status_department) {
    try {
      const query =
        'UPDATE department SET name_department = ?, status_department = ?, updated_at = now() where id_department = ?';

      const [results] = await this.connection
        .promise()
        .query(query, [name_department, status_department, id_department]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Department: ` + error);
      throw new Error(`Error al crear el departamento`);
    }
  }

  async toggleStatusDepartment(id_department, status_department) {
    try {
      const query = 'UPDATE department SET status_department = ?, updated_at = now() where id_department =?';

      const [results] = await this.connection.promise().query(query, [status_department, id_department]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Department: ` + error);
      throw new Error(`Error al actualizar el estado del departamento`);
    }
  }

  async deleteDepartment(id_department) {
    try {
      const query = 'DELETE from department where id_department = ?';

      const [results] = await this.connection.promise().query(query, [id_department]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Department: ` + error);
      throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
    }
  }
}

export default Department;
