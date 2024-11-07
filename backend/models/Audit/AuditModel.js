import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class AuditModel extends BaseModel {
    constructor() {
        super('audit_general', 'id_ag');
        this.db = new Connection();
        this.conn = this.db.createCon();
        this.defaultLimitPagination = 100;
    }

}

export default AuditModel