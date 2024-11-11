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
                        e.name_entity,
                        e.lastname_entity,
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

    async getTotalQuestionnairesInformation(filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
                select 
                    count(distinct id_sq) as total
                from satisfaction_questionnaire sq 
                    join question_satisfaction_questionnaire qsq on sq.id_sq = qsq.sq_fk 
                    join user u on sq.author_fk = u.id_user
                    join entity e on u.entity_fk = e.id_entity  
                    left join entity_department_occupation edo on edo.entity_fk = e.id_entity
                ${whereClause}
                `
            const [results] = await this.con.promise().query(query, [...values]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getDataQuizForAudit(id_sq) {
        try {
            const query = `
                select 
                id_sq, 
                name_sq, 
                start_sq, 
                end_sq,
                (
                select count(id_asq) 
                from answer_satisfaction_questionnaire asq 
                where asq.sq_fk = sq.id_sq
                ) as "quantity_questions"
                from satisfaction_questionnaire sq
                join user u on sq.author_fk = u.id_user 
                join entity e on u.entity_fk = e.id_entity
                where id_sq = ?
                `
            const [results] = await this.conn.promise().query(query, [id_sq])
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getAnswersForQuiz(id_sq, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {

            const query = `
                SELECT 
                    u.avatar_user,
                    e.name_entity,
                    e.lastname_entity,
                    sq.id_sq, 
                    asq2.id_asq, 
                    sq.name_sq, 
                    sq.start_sq, 
                    sq.end_sq, 
                    sq.created_at,
                    asq2.date_complete,
                    asq2.user_fk as answered_by,
                    name_department,
                    name_occupation,
                    (
                        SELECT ROUND(AVG(dsq.score_dsq), 2)
                        FROM detail_satisfaction_questionnaire dsq
                        JOIN answer_satisfaction_questionnaire asq 
                            ON dsq.asq_fk = asq.id_asq
                        WHERE asq.sq_fk = ?
                    ) AS average
                FROM satisfaction_questionnaire sq
                JOIN answer_satisfaction_questionnaire asq2 
                    ON asq2.sq_fk = sq.id_sq
                JOIN user u on asq2.user_fk = u.id_user
                join entity e on e.id_entity = u.entity_fk
                join entity_department_occupation edo on edo.entity_fk = e.id_entity 
                join department d on edo.department_fk = d.id_department 
                join occupation o on edo.occupation_fk = o.id_occupation 
                WHERE id_sq = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                GROUP BY sq.id_sq, sq.name_sq
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [id_sq, id_sq, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getQuizHeader(id_sq) {
        try {
            const query = `
                select id_sq, name_sq, start_sq, end_sq, concat(name_entity," ",lastname_entity) as "author",                (
                select count(id_qsq) 
                from question_satisfaction_questionnaire qsq 
                where qsq.sq_fk = sq.id_sq
                ) as "quantity_questions"
                from satisfaction_questionnaire sq
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
                SELECT 
                    author.avatar_user,
                    concat(authentity.name_entity,+" ",authentity.lastname_entity) as author,
                    sq.id_sq, 
                    asq2.id_asq, 
                    sq.name_sq, 
                    sq.start_sq, 
                    sq.end_sq, 
                    sq.created_at,
                    asq2.user_fk as answered_by,
                    asq2.date_complete,
                    (
                        SELECT COUNT(qsq.id_qsq) 
                        FROM question_satisfaction_questionnaire qsq 
                        WHERE qsq.sq_fk = sq.id_sq
                    ) AS quantity_questions,
                    (
                        SELECT ROUND(AVG(dsq.score_dsq), 2)
                        FROM detail_satisfaction_questionnaire dsq
                        JOIN answer_satisfaction_questionnaire asq 
                            ON dsq.asq_fk = asq.id_asq
                        WHERE asq.sq_fk = sq.id_sq
                        AND asq.user_fk = ?
                    ) AS average
                FROM satisfaction_questionnaire sq
                JOIN answer_satisfaction_questionnaire asq2 
                    ON asq2.sq_fk = sq.id_sq
                JOIN user author on sq.author_fk = author.id_user
                join entity authentity on authentity.id_entity = author.entity_fk
                WHERE asq2.user_fk = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                GROUP BY sq.id_sq, sq.name_sq
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;
            const [results] = await this.con.promise().query(query, [id_user, id_user, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getTotalResultsQuizAnsweredByEmployee(id_user, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
                SELECT 
                    count(distinct asq2.id_asq) as total
                FROM satisfaction_questionnaire sq
                JOIN answer_satisfaction_questionnaire asq2 
                    ON asq2.sq_fk = sq.id_sq
                JOIN user author on sq.author_fk = author.id_user
                join entity authentity on authentity.id_entity = author.entity_fk
                WHERE asq2.user_fk = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                `
            const [results] = await this.con.promise().query(query, [id_user, id_user, ...values]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getTotalResultsQuizAnsweredByEmployeeAndSq(id_sq) {
        try {
            const query = `SELECT COUNT(id_asq) as total FROM answer_satisfaction_questionnaire
            where sq_fk = ?
            group by sq_fk`;
            const [results] = await this.con.promise().query(query, [id_sq]);
            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }
    }

    async getCompleteHeaderQuiz(id_sq) {
        try {
            const query = `
            select 
                id_sq,
                name_sq,
                start_sq,
                u.avatar_user,
                end_sq,
                concat(e.name_entity ," ", e.lastname_entity) as author,
                (
                SELECT COUNT(qsq.id_qsq) 
                FROM question_satisfaction_questionnaire qsq 
                WHERE qsq.sq_fk = sq.id_sq
                ) AS quantity_questions,
                u.avatar_user,
                name_department
            from satisfaction_questionnaire sq
            join user u on sq.author_fk = u.id_user 
            join entity e on u.entity_fk = e.id_entity 
            join entity_department_occupation edo on edo.entity_fk = e.id_entity 
            join department d on edo.department_fk = d.id_department
            where id_sq = ?;
            `;
            const [results] = await this.con.promise().query(query, [id_sq]);
            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }
    }

    async getBodySqAnswerByIdQuizAndUser(id_sq, id_user) {
        try {
            const query = `
            SELECT 
                description_qsq,
                bad_parameter_qsq,
                best_parameter_qsq,
                score_dsq,
                description_dsq
                from detail_satisfaction_questionnaire dsq 
                join question_satisfaction_questionnaire qsq on dsq.qsq_fk = qsq.id_qsq 
                join answer_satisfaction_questionnaire asq ON dsq.asq_fk = asq.id_asq 
                join satisfaction_questionnaire sq on asq.sq_fk = sq.id_sq 
            where asq.user_fk = ?
            and id_sq = ?
            group by id_qsq;
        
        `;

            const [results] = await this.con.promise().query(query, [id_user, id_sq]);

            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }

    }

    async getAverage(id_sq, id_user) {
        try {
            const query = `
              	SELECT ROUND(AVG(dsq.score_dsq), 2) as average
                FROM detail_satisfaction_questionnaire dsq
                JOIN answer_satisfaction_questionnaire asq 
                    ON dsq.asq_fk = asq.id_asq
                WHERE sq_fk = ?
                AND asq.user_fk = ?    
                ;
            `;

            const [results] = await this.con.promise().query(query, [id_sq, id_user]);
            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }
    }

}

export default SatisfactionModel;