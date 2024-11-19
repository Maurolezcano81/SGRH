import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class DashboardPersonalModel extends BaseModel {
    constructor() {
        super('user', 'username_user');
        this.db = new Connection();
        this.conn = this.db.createCon();

    }

    async getLast3SatisfactionQuizzes(id_user) {
        try {
            const query = `
                SELECT
                    u.avatar_user,
                    sq.name_sq,
                    sq.start_sq,
                    sq.end_sq,
                    e.name_entity,
                    e.lastname_entity
                FROM satisfaction_questionnaire sq
                JOIN user u ON sq.author_fk = u.id_user  -- Obtiene el autor del cuestionario
                JOIN entity e ON u.entity_fk = e.id_entity
                LEFT JOIN answer_satisfaction_questionnaire asq ON sq.id_sq = asq.id_asq AND asq.user_fk = ?  -- Filtra las respuestas del usuario específico
                WHERE sq.author_fk = u.id_user  -- El autor del cuestionario
                AND asq.id_asq IS NULL  -- Solo cuestionarios sin respuestas para el usuario especificado
                LIMIT 3;
                ;
            `

            const [results] = await this.conn.promise().query(query, [id_user]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getLastPerformanceQuiz(id_user) {
        try {
            const query = `
                SELECT 
                    u.avatar_user,
                    ep.name_ep,
                    ap.date_complete,
                    e.name_entity,
                    e.lastname_entity,
                    AVG(dep.score_dep) AS average
                FROM evaluation_performance ep
                JOIN answer_performance ap ON ap.ep_fk = ep.id_ep
                JOIN detail_evaluation_performance dep ON ap.id_ap = dep.ap_fk
                JOIN supervisor_performance_questionnaire spq ON ap.author_fk = spq.id_spq
                JOIN user u ON spq.user_fk = u.id_user
                JOIN entity e ON u.entity_fk = e.id_entity
                WHERE evaluated_fk = ?
                GROUP BY ep.name_ep, ap.date_complete, e.name_entity, e.lastname_entity
                ORDER BY ap.date_complete DESC
                LIMIT 1;
            `

            const [results] = await this.conn.promise().query(query, [id_user]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getLast3LeavesRequest(id_user) {
        try {
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
                        lr.user_fk = ?
                    GROUP BY 
                        lr.id_lr, lrr.lr_fk
                        ORDER BY lrr.created_at desc ,lr.created_at desc
                    LIMIT 3;
            `

            const [results] = await this.conn.promise().query(query, [id_user]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getLast3CapacitationsRequest(id_user) {
        try {
            const query = `
   					 SELECT 
                rc.id_rc, 
                rrc.id_rrc,
                rc.user_fk, 
                u.avatar_user,
                e.id_entity, 
                rc.title_rc, 
                rc.description_rc, 
                e.name_entity,
                e.lastname_entity, 
                uaut.avatar_user as author_profile,
                eaut.name_entity as author_name,
                eaut.lastname_entity as author_lastname,
                rrc.description_rrc,
                rrc.created_at as answered_at,
                rc.created_at as date_requested,
                rc.updated_at, 
                COALESCE(sr.name_sr, 'No Respondido') as "name_sr"
            FROM 
                request_capacitation rc
            LEFT JOIN 
                user u ON rc.user_fk = u.id_user
            LEFT JOIN 
                entity e ON u.entity_fk = e.id_entity
            LEFT JOIN 
                response_request_capacitation rrc ON rc.id_rc = rrc.rc_fk
            LEFT JOIN
                user uaut on rrc.user_fk = uaut.id_user
            LEFT JOIN 
                entity eaut on uaut.entity_fk = eaut.id_entity
            LEFT JOIN 
                        status_request sr on rrc.sr_fk = sr.id_sr
                    WHERE 
                        rc.user_fk = 11
                    GROUP BY 
                        rc.id_rc, rrc.rc_fk
                    ORDER BY 
                        rrc.created_at desc, rc.created_at desc 
                    LIMIT 3;

            `

            const [results] = await this.conn.promise().query(query, [id_user]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }
}


export default DashboardPersonalModel