import BaseModel from "../../BaseModel.js";
import Connection from "../../../config/connection.js";

class PerformanceModel extends BaseModel {
    constructor() {
        super('evaluation_performance', 'name_ep');
        this.db = new Connection();
        this.conn = this.db.createCon();

        this.question_qsq = new BaseModel('evaluation_performance_question', 'id_epq');
    }

    async getQuestionnairesInformation(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
                select id_ep, 
                name_ep, start_ep, 
                end_ep, status_ep, 
                concat(name_entity," ",lastname_entity) as "author", 
                ep.created_at, ep.updated_at, count(id_epq) as "quantity_questions",
                (
                    select count(id_epq) 
                    from evaluation_performance_question epq 
                    where epq.ep_fk = ep.id_ep
                ) as "quantity_questions"
                from evaluation_performance ep 
                    join evaluation_performance_question epq on ep.id_ep = epq.ep_fk 
                    join user u on ep.author_fk = u.id_user
                    join entity e on u.entity_fk = e.id_entity  
                    left join entity_department_occupation edo on edo.entity_fk = e.id_entity
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                    group by ep.name_ep, ep.id_ep 
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getQuizHeader(id_ep){
        try {
            const query = `
                select id_ep, name_ep, start_ep, end_ep, concat(name_entity," ",lastname_entity) as "author" from evaluation_performance ep
                join user u on ep.author_fk = u.id_user 
                join entity e on u.entity_fk = e.id_entity
                where id_ep = ?
                `
            const [results] = await this.conn.promise().query(query, [id_ep])
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getQuiz(id_ep) {
        try {
            const query = `
                select id_epq, question_epq ,description_epq, is_obligatory, bad_parameter_epq, best_parameter_epq from evaluation_performance_question epq 
                where ep_fk = ?
                `
            const [results] = await this.conn.promise().query(query, [id_ep])
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

}

export default PerformanceModel;