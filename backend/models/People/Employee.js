import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class EmployeeModel extends BaseModel {
  constructor() {
    super('employee', 'employee_file');
    this.db = new Connection();
    this.conn = this.db.createCon();
  }

  async getData(id_edo) {
    try {
        const query = `
            select 
                id_edo, 
                name_entity, 
                lastname_entity,
                name_department 
            from entity_department_occupation edo 
            join entity e on edo.entity_fk = e.id_entity
            join department d on edo.department_fk = d.id_department 
            where edo.id_edo = ?
        `


        const [results] = await this.conn.promise().query(query, [id_edo])

        return results

    } catch (error) {
        console.error("Error en Users EmployeeModels:", error.message);
        throw new Error("Error en Users EmployeeModels: " + error.message);
    }
}

}

export default EmployeeModel