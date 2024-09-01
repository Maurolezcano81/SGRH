import BaseModel from "../../BaseModel.js";
import Connection from "../../../config/connection.js";

class OccupationModel extends BaseModel{
  constructor(){
    super('occupation', 'id_occupation');
    this.db = new Connection();
    this.conn = this.db.createCon();
  }

  async getEntityOccupation(fk_entity) {

    try{
        const query = "SELECT * FROM occupation join entity_department_occupation on occupation_fk = id_occupation where entity_fk = ?";

        const [results] = await this.conn.promise().query(query, [fk_entity]);
        
        return results;
    } catch(error){
    console.error(`Error en modelo de Occupation: ` + error);
    throw new Error(`Error al obtener los datos de la ocupacion`);
  }
}
}

export default OccupationModel;