import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class CapacitationModel extends BaseModel {
    constructor() {
        super('request_capacitation', 'title_rc');
        this.db = new Connection();
        this.conn = this.db.createCon();

    }


    async getCapacitationInformattion(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
            SELECT 
                rc.id_rc, 
                rc.user_fk, 
                e.id_entity, 
                u.avatar_user, 
                rc.title_rc, 
                rc.description_rc, 
                CONCAT(e.name_entity, ' ', e.lastname_entity) AS requestor_name, 
                CONCAT(eaut.name_entity,' ', eaut.lastname_entity) as answered_by,
                rrc.description_rrc,
                rrc.created_at as answered_at,
                rc.created_at,
                rc.updated_at, 
                name_sr
            FROM 
                request_capacitation rc
            JOIN 
                user u ON rc.user_fk = u.id_user
            JOIN 
                entity e ON u.entity_fk = e.id_entity
            JOIN 
                response_request_capacitation rrc ON rc.id_rc = rrc.rc_fk
            JOIN
                user uaut on rrc.user_fk = uaut.id_user
            JOIN 
                entity eaut on uaut.entity_fk = eaut.id_entity
            LEFT JOIN 
                status_request sr ON rrc.sr_fk = sr.id_sr
            ${whereClause}
                group by rc.title_rc, rc.id_rc 
            ORDER BY ${orderBy} ${order} 
            LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getCapacitationsNotAnswered() {
        try {
            const query = `
                SELECT 
                    rc.id_rc, 
                    rc.user_fk, 
                    e.id_entity, 
                    u.avatar_user, 
                    rc.title_rc, 
                    rc.description_rc, 
                    CONCAT(e.name_entity, ' ', e.lastname_entity) AS requestor_name, 
                    rc.created_at, 
                    rc.updated_at
                FROM 
                    request_capacitation rc
                JOIN 
                    user u ON rc.user_fk = u.id_user
                JOIN 
                    entity e ON u.entity_fk = e.id_entity
                LEFT JOIN 
                    response_request_capacitation rrc ON rc.id_rc = rrc.rc_fk
                LEFT JOIN 
                    status_request sr ON rrc.sr_fk = sr.id_sr
                    WHERE
                        rrc.rc_fk is null 
                group by rc.title_rc, rc.id_rc 
            ORDER BY created_at asc
            LIMIT 5 OFFSET 0`;

            const [results] = await this.con.promise().query(query, []);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getCapacitationInformattionById(id_user, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseCapacitation(filters);
            const query = `
                    SELECT 
                        rc.id_rc, 
                        rc.user_fk, 
                        rc.title_rc, 
                        rc.description_rc, 
                        rc.created_at, 
                        rc.updated_at,
                        COALESCE(sr.name_sr, 'No Respondido') as "name_sr"
                    FROM 
                        request_capacitation rc
                    LEFT JOIN 
                        response_request_capacitation rrc
                        ON rc.id_rc = rrc.rc_fk
                    LEFT JOIN
                        status_request sr on rrc.sr_fk = sr.id_sr
                    WHERE 
                        rc.user_fk = ? ${whereClause.length > 0 ? 'AND' : ''} 
                        ${whereClause}
                    GROUP BY 
                        rc.id_rc, rrc.rc_fk
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

export default CapacitationModel