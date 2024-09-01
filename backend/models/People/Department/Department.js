import BaseModel from "../../BaseModel.js";
import Connection from "../../../config/connection.js";

class DeparmentModel extends BaseModel {
    constructor() {
        super('department', 'id_department');
        this.db = new Connection();
        this.conn = this.db.createCon();
    }

    async getEntityDepartment(fk_entity) {

        try{
            const query = "SELECT * FROM department join entity_department_occupation on department_fk = id_department where entity_fk = ?";

            const [results] = await this.conn.promise().query(query, [fk_entity]);
            
            return results;
        } catch(error){
        console.error(`Error en modelo de Department: ` + error);
        throw new Error(`Error al obtener los datos del Departamento`);
        }
    }

}

export default DeparmentModel;