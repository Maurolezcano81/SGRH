import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class DepartmentModel extends BaseModel {
    constructor() {
        super('department', 'name_department');
        this.db = new Connection();
        this.conn = this.db.createCon();
    }

    async getDepartmentsInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
                SELECT 
                    id_department, 
                    name_department, 
                    COUNT(id_edo) AS "quantity_department", 
                    SUM(salary_occupation) AS "salary_total_department"
                FROM department d
                LEFT JOIN entity_department_occupation edo ON d.id_department = edo.department_fk 
                LEFT JOIN occupation o ON edo.occupation_fk = o.id_occupation 
                LEFT JOIN entity e ON edo.entity_fk = e.id_entity
                LEFT JOIN user u ON u.entity_fk = e.id_entity 
                ${whereClause}
                GROUP BY id_department, name_department
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

    async getDepartmentInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
                SELECT 
                    id_department,
                    id_user,
                    avatar_user, 
                    name_entity,
                    lastname_entity,
                    file_employee,
                    salary_occupation,
                    name_occupation,
                    status_employee
                FROM department d
                JOIN entity_department_occupation edo ON d.id_department = edo.department_fk 
                LEFT JOIN occupation o ON edo.occupation_fk = o.id_occupation 
                JOIN entity e ON edo.entity_fk = e.id_entity
                LEFT JOIN employee emp ON e.id_entity = emp.entity_fk
                JOIN user u ON u.entity_fk = e.id_entity 
                ${whereClause}
                GROUP BY id_user, name_entity, lastname_entity
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

}

export default DepartmentModel