import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class LeaveModel extends BaseModel {
    constructor() {
        super('leave_request', 'created_at');
        this.db = new Connection();
        this.conn = this.db.createCon();
    }


    async getAttachments(lr_fk) {

        try {
            const query = `
                SELECT * from attachment_leave_request alr
                where lr_fk = ?
            `

            const [results] = await this.con.promise().query(query, [lr_fk]);

            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }


    async getLeavesInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
            SELECT 
                lr.id_lr,
                tol.name_tol,
                lr.reason_lr,
                lr.start_lr,
                lr.end_lr,
                u.avatar_user,
                CONCAT(e.name_entity, ' ', e.lastname_entity) AS requestor_name, 
                CONCAT(eaut.name_entity,' ', eaut.lastname_entity) as answered_by,
                lrr.created_at as answered_at,
                name_sr,
                description_lrr,
                lr.created_at
            FROM 
                leave_request lr
            JOIN 
                user u ON lr.user_fk = u.id_user
            JOIN 
                entity e ON u.entity_fk = e.id_entity
            JOIN 
                leave_response_request lrr ON lr.id_lr = lrr.lr_fk
            JOIN
                user uaut on lrr.user_fk = uaut.id_user
            JOIN 
                entity eaut on uaut.entity_fk = eaut.id_entity
            JOIN 
                type_of_leave tol on lr.tol_fk = tol.id_tol
            LEFT JOIN 
                status_request sr ON lrr.sr_fk = sr.id_sr
            ${whereClause}
                group by name_tol, id_lr
            ORDER BY ${orderBy} ${order} 
            LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getLeavesNotAnswered() {
        try {
            const query = `
                SELECT 
                    lr.id_lr,
                    tol.name_tol,
                    lr.reason_lr,
                    lr.start_lr,
                    lr.end_lr,
                    u.avatar_user,
                    CONCAT(e.name_entity, ' ', e.lastname_entity) AS requestor_name, 
                    lr.created_at
                FROM 
                    leave_request lr
                JOIN 
                    user u ON lr.user_fk = u.id_user
                JOIN 
                    entity e ON u.entity_fk = e.id_entity
                JOIN
                    type_of_leave tol on lr.tol_fk = tol.id_tol
                LEFT JOIN 
                    leave_response_request lrr ON lr.id_lr = lrr.lr_fk
                LEFT JOIN 
                    status_request sr ON lrr.sr_fk = sr.id_sr
                    WHERE
                        lrr.lr_fk is null 
                group by tol.name_tol, lr.id_lr 
            ORDER BY created_at desc
            LIMIT 5 OFFSET 0`;

            const [results] = await this.con.promise().query(query, []);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getLeavesInformattionById(id_user, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseCapacitation(filters);
            const query = `
                    SELECT 
                        lr.id_lr,
                        tol.name_tol,
                        CONCAT(e.name_entity, ' ', e.lastname_entity) AS requestor_name, 
                        u.avatar_user,
                        lr.reason_lr,
                        lr.start_lr,
                        lr.end_lr,
                        lr.created_at,
                        COALESCE(lrr.description_lrr, '-') as description_lrr,
                        COALESCE(sr.name_sr, 'No Respondido') as name_sr,
                        COALESCE(CONCAT(eaut.name_entity,' ', eaut.lastname_entity), '-') as answered_by,
                        COALESCE(lrr.created_at, '-') as answered_at
                    FROM 
                        leave_request lr
                    JOIN 
                        user u ON lr.user_fk = u.id_user
                    JOIN 
                        entity e ON u.entity_fk = e.id_entity
                    LEFT JOIN 
                        leave_response_request lrr ON lr.id_lr = lrr.lr_fk
                    LEFT JOIN 
                        user uaut ON lrr.user_fk = uaut.id_user
                    LEFT JOIN 
                        entity eaut ON uaut.entity_fk = eaut.id_entity
                    JOIN 
                        type_of_leave tol ON lr.tol_fk = tol.id_tol
                    LEFT JOIN 
                        status_request sr ON lrr.sr_fk = sr.id_sr
                    WHERE 
                        lr.user_fk = ? ${whereClause.length > 0 ? 'AND' : ''} 
                        ${whereClause}
                    GROUP BY 
                        lr.id_lr, lrr.lr_fk
                    ORDER BY 
                        ${orderBy} ${order} 
                    LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [id_user, ...values, limit, offset]);

            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    buildWhereClauseCapacitation(filters) {
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

export default LeaveModel