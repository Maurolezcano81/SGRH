import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class DepartmentModel extends BaseModel {
    constructor() {
        super('department', 'name_department');
        this.db = new Connection();
        this.conn = this.db.createCon();
        this.edo = new BaseModel('entity_department_edo', 'id_edo')
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

    async rotationPersonalOnDepartment(id_edo, department_fk) {
        try {
            const query = `UPDATE entity_department_occupation 
            SET department_fk = ?,
            status_edo = 0,
            updated_at = now()
            WHERE id_edo = ?
            `

            const [results] = await this.edo.updateOne({ department_fk: department_fk }, ['id_edo', id_edo])

            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

    async getEmployeesInOtherDepartment(id_department, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.whereForOutDepartment(filters);
            const query = `
            SELECT
                    id_department,
                        id_user,
                        avatar_user, 
                        name_entity,
                        lastname_entity,
                        name_occupation,
                        status_employee,
                        status_edo,
                        file_employee,
                        name_department
                    FROM department d
                    RIGHT JOIN entity_department_occupation edo ON d.id_department = edo.department_fk 
                    LEFT JOIN occupation o ON edo.occupation_fk = o.id_occupation 
                    JOIN entity e ON edo.entity_fk = e.id_entity
                    LEFT JOIN employee emp ON e.id_entity = emp.entity_fk
                    JOIN user u ON u.entity_fk = e.id_entity 
                WHERE edo.department_fk != ${id_department} ${whereClause.length > 0 ? 'AND' : ''}
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


    whereForOutDepartment(filters) {
        const whereClauses = [];
        const values = [];

        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                if (typeof value === 'string') {
                    whereClauses.push(`${key} LIKE ?`);
                    values.push(`%${value}%`);
                } else {
                    whereClauses.push(`${key} = ?`);
                    values.push(value);
                }
            }
        }

        const whereClause = whereClauses.length ? whereClauses.join(' AND ') : '';
        return { whereClause, values };
    }
}

export default DepartmentModel