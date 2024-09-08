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
            const { whereClause, values } = this.whereForOutDepartment(filters);
            const query = `
                select id_sq, name_sq, start_sq, end_sq, status_sq, name_entity, lastname_entity, sq.created_at, sq.updated_at, count(id_qsq) from satisfaction_questionnaire sq 
                    join question_satisfaction_questionnaire qsq on sq.id_sq = qsq.sq_fk 
                    join user u on sq.author_fk = u.id_user
                        join entity e on u.entity_fk = e.id_entity  
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


    async getQuiz(id_sq) {
        try {
            const query = `
                select id_qsq, description_qsq, is_obligatory, bad_parameter_qsq, best_parameter_qsq from question_satisfaction_questionnaire qsq 
                where sq_fk = ?
                `

            const [results] = this.conn.promise().query(query, [id_sq])
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

}

export default SatisfactionModel;