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


    async getLeavesInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy, order, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
            SELECT 
                lrr.id_lrr,
                lr.id_lr,
                tol.name_tol,
                lr.reason_lr,
                lr.start_lr,
                lr.end_lr,
                u.avatar_user,
                e.name_entity,
                e.lastname_entity,
                uaut.avatar_user as author_profile,
                eaut.name_entity as author_name,
                eaut.lastname_entity as author_lastname,
                lrr.created_at as answered_at,
                name_sr,
                description_lrr,
                lr.created_at  as "date_requested"
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

    async getTotalLeavesInformation(filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
            SELECT 
                count(distinct lr.id_lr) as total
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
`;


            const [results] = await this.con.promise().query(query, [...values]);
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

    async getDataForResponse(id_lrr) {
        try {
            const query = `
               select id_lrr ,e.name_entity, e.lastname_entity, sr.name_sr, tol.name_tol  from leave_response_request lrr 
                    left join status_request sr on sr.id_sr = lrr.sr_fk 
                    left join leave_request lr on lrr.lr_fk = lr.id_lr 
                    left join user u on lr.user_fk = u.id_user
                    left join entity e on e.id_entity = u.entity_fk 
                    join type_of_leave tol on lr.tol_fk = tol.id_tol 
                where id_lrr = ?;
                                         `

            const [results] = await this.conn.promise().query(query, [id_lrr])

            return results

        } catch (error) {
            console.error("Error en Users LeaveModels:", error.message);
            throw new Error("Error en Users LeaveModels: " + error.message);
        }
    }

    async getDataCreatedRequest(id_lr) {
        try {
            const query = `
                select 
                id_lr,
                name_entity, 
                lastname_entity, 
                tol.name_tol, 
                lr.reason_lr, 
                lr.start_lr, 
                lr.end_lr 
                from leave_request lr
                    left join type_of_leave tol on lr.tol_fk = tol.id_tol 
                    left join user u on lr.user_fk = u.id_user 
                    left join entity e on u.entity_fk = e.id_entity 
                    where lr.id_lr = ?   
            `

            const [results] = await this.conn.promise().query(query, [id_lr])

            return results

        } catch (error) {
            console.error("Error en Users LeaveModels:", error.message);
            throw new Error("Error en Users LeaveModels: " + error.message);
        }
    }

    async getLeavesInformattionById(id_user, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy, order, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseCapacitation(filters);

            const query = `
                    SELECT 
                        lr.id_lr,
                        tol.name_tol,
                        e.name_entity,
                        e.lastname_entity,
                        u.avatar_user,
                        lr.reason_lr,
                        lr.start_lr,
                        lr.end_lr,
                        lr.created_at as date_requested,
                        COALESCE(lrr.description_lrr, '-') as description_lrr,
                        COALESCE(sr.name_sr, 'No Respondido') as name_sr,
                        eaut.name_entity as author_name,
                        eaut.lastname_entity as author_lastname,
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
                        ORDER BY ${orderBy} ${order}
                    LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [id_user, ...values, limit, offset]);

            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getTotalLeavesInformattionById(id_user, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseCapacitation(filters);
            const query = `
                    SELECT 
                        count(lr.id_lr) as total
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
`;
            const [results] = await this.con.promise().query(query, [id_user, ...values]);

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

    async getEmployeeData(id_lr) {

        try {
            const query = `
                        select emp.* from leave_request lr 
            join user u on lr.user_fk = u.id_user 
            join entity e on u.entity_fk = e.id_entity 
            join employee emp on e.id_entity = emp.entity_fk 
            where id_lr = ?
            group by emp.id_employee
            ;
            `


            const [results] = await this.conn.promise().query(query, [id_lr])

            return results[0]

        } catch (error) {
            console.error("Error en Users LeaveModels:", error.message);
            throw new Error("Error en Users LeaveModels: " + error.message);
        }
    }

    async getLeavesForStartFieldForJobSchedule(date) {
        try {

            const query = `
            select 
                lrr.id_lrr,
                u.id_user,
                e.id_entity,
                emp.id_employee,
                lr.start_lr,
                lr.end_lr
            from leave_response_request lrr
            join leave_request lr on lrr.lr_fk = lr.id_lr 
            join status_request sr on lrr.sr_fk = sr.id_sr
            join user u on lr.user_fk = u.id_user
            join entity e on u.entity_fk = e.id_entity
            left join employee emp on e.id_entity = emp.entity_fk
            where start_lr = ?
            and name_sr = 'Aprobado'
        `

            const [results] = await this.conn.promise().query(query, [date])

            return results

        } catch (error) {
            console.error("Error en Users LeaveModels:", error.message);
            throw new Error("Error en Users LeaveModels: " + error.message);
        }
    }


    async getLeavesForEndFieldForJobSchedule(date) {
        try {

            const query = `
            select 
                lrr.id_lrr,
                u.id_user,
                e.id_entity,
                emp.id_employee,
                lr.start_lr,
                lr.end_lr
            from leave_response_request lrr
            join leave_request lr on lrr.lr_fk = lr.id_lr 
            join status_request sr on lrr.sr_fk = sr.id_sr
            join user u on lr.user_fk = u.id_user
            join entity e on u.entity_fk = e.id_entity
            left join employee emp on e.id_entity = emp.entity_fk
            where end_lr = ?
            and name_sr = 'En Proceso'
        `

            const [results] = await this.conn.promise().query(query, [date])

            return results

        } catch (error) {
            console.error("Error en Users LeaveModels:", error.message);
            throw new Error("Error en Users LeaveModels: " + error.message);
        }
    }

}

export default LeaveModel