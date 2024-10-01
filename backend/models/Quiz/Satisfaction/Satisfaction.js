import BaseModel from "../../BaseModel.js";
import Connection from "../../../config/connection.js";

class SatisfactionModel extends BaseModel {
    constructor() {
        super('satisfaction_questionnaire', 'name_sq');
        this.db = new Connection();
        this.conn = this.db.createCon();

        this.question_qsq = new BaseModel('question_satisfaction_questionnaire', 'id_qsq');
    }

    async getQuestionnairesInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
                select id_sq,
                        name_sq,
                        start_sq,
                        end_sq,
                        status_sq,
                        concat(name_entity," ",lastname_entity) as "author",
                        sq.created_at,
                        sq.updated_at,
                        (
                        select count(id_qsq) 
                        from question_satisfaction_questionnaire qsq 
                        where qsq.sq_fk = sq.id_sq
                        ) as "quantity_questions"
                        from satisfaction_questionnaire sq 
                    join question_satisfaction_questionnaire qsq on sq.id_sq = qsq.sq_fk 
                    join user u on sq.author_fk = u.id_user
                    join entity e on u.entity_fk = e.id_entity  
                    left join entity_department_occupation edo on edo.entity_fk = e.id_entity
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                    group by sq.name_sq, sq.id_sq 
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getQuizHeader(id_sq) {
        try {
            const query = `
                select id_sq, name_sq, start_sq, end_sq, concat(name_entity," ",lastname_entity) as "author" from satisfaction_questionnaire sq
                join user u on sq.author_fk = u.id_user 
                join entity e on u.entity_fk = e.id_entity
                where id_sq = ?
                `
            const [results] = await this.conn.promise().query(query, [id_sq])
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getQuiz(id_sq) {
        try {
            const query = `
                select id_qsq, description_qsq, is_obligatory, bad_parameter_qsq, best_parameter_qsq from question_satisfaction_questionnaire qsq 
                where sq_fk = ?
                `
            const [results] = await this.conn.promise().query(query, [id_sq])
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getLastFive(id_user) {
        try {
            const query = `
            SELECT id_sq,
                name_sq,
                start_sq,
                end_sq,
                status_sq,
                (
                select count(id_qsq) 
                from question_satisfaction_questionnaire qsq 
                where qsq.sq_fk = sq.id_sq
                ) as "quantity_questions",
                sq.created_at,
                sq.updated_at
            FROM satisfaction_questionnaire sq
            JOIN question_satisfaction_questionnaire qsq ON sq.id_sq = qsq.sq_fk
            LEFT JOIN answer_satisfaction_questionnaire asq ON asq.sq_fk = sq.id_sq 
            AND asq.user_fk = ? 
            LEFT JOIN detail_satisfaction_questionnaire dsq ON asq.id_asq = dsq.asq_fk  
            WHERE asq.id_asq IS NULL  
            GROUP BY sq.name_sq, sq.id_sq
            LIMIT 5 OFFSET 0
                `;

            const [results] = await this.con.promise().query(query, [id_user]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getQuestionnairesInformationByEmployee(id_user, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
                select id_sq,
                        name_sq,
                        start_sq,
                        end_sq,
                        status_sq,
                        sq.created_at,
                        sq.updated_at,
                        (
                        select count(id_qsq) 
                        from question_satisfaction_questionnaire qsq 
                        where qsq.sq_fk = sq.id_sq
                        ) as "quantity_questions",
                        avg(score_dsq) as "average"
                        from satisfaction_questionnaire sq 
                    join question_satisfaction_questionnaire qsq on sq.id_sq = qsq.sq_fk 
                    join user u on sq.author_fk = u.id_user
                    join entity e on u.entity_fk = e.id_entity
                    join answer_satisfaction_questionnaire asq on asq.sq_fk = sq.id_sq
                    join detail_satisfaction_questionnaire dsq on asq.id_asq = dsq.asq_fk  
                    left join entity_department_occupation edo on edo.entity_fk = e.id_entity
                    where u.id_user = ?
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                    group by sq.name_sq, sq.id_sq 
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;
            const [results] = await this.con.promise().query(query, [id_user, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }
}

export default SatisfactionModel;