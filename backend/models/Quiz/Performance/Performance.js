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
                ep.created_at, 
                ep.updated_at,
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

    async getQuizHeader(id_ep) {
        try {
            const query = `
                select id_ep, name_ep, start_ep, end_ep,
                concat(name_entity," ",lastname_entity) as "author",
                (
                select count(id_epq) 
                from evaluation_performance_question epq 
                where epq.ep_fk = ep.id_ep
                ) as "quantity_questions"
                from evaluation_performance ep
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


    async getPeopleForSupervisor(
        limit = this.defaultLimitPagination,
        offset = this.defaultOffsetPagination,
        orderBy = this.defaultOrderBy,
        order = this.defaultOrderPagination,
        filters = {},
        supervisorsToExclude = []
    ) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {
            const excludeClause = supervisorsToExclude.length > 0
                ? `id_user NOT IN (${supervisorsToExclude.map(() => '?').join(', ')})`
                : '';

            const query = `
            SELECT 
                id_user,
                id_entity,
                name_entity,
                lastname_entity,
                name_department,
                name_occupation,
                avatar_user
            FROM entity e
                JOIN user u ON e.id_entity = u.entity_fk
                JOIN entity_department_occupation edo ON e.id_entity = edo.entity_fk
                JOIN department d ON edo.department_fk = d.id_department
                JOIN occupation o ON edo.occupation_fk = o.id_occupation
            ${whereClause.length > 0 || excludeClause ? 'WHERE' : ''}
            ${excludeClause} 
            ${excludeClause && whereClause.length > 0 ? 'AND' : ''}
            ${whereClause}
            GROUP BY id_user, id_entity 
            ORDER BY ${orderBy} ${order} 
            LIMIT ? OFFSET ? ;
            `;

            const [results] = await this.conn.promise().query(query, [...supervisorsToExclude, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en getPeopleForSupervisor Quiz Performance:", error.message);
            throw new Error("Error en getPeopleForSupervisor Quiz Performance: " + error.message);
        }
    }

    async getSupervisorsQuiz(id_ep) {
        try {
            const query = `
            SELECT 
                id_user,
                id_entity,
                name_entity,
                lastname_entity,
                name_department,
                name_occupation,
                id_spq,
                ep_fk,
                avatar_user
            FROM entity e
                JOIN user u ON e.id_entity = u.entity_fk
                JOIN entity_department_occupation edo ON e.id_entity = edo.entity_fk
                JOIN department d ON edo.department_fk = d.id_department
                JOIN occupation o ON edo.occupation_fk = o.id_occupation
                JOIN supervisor_performance_questionnaire spq on u.id_user = spq.user_fk
                where spq.ep_fk = ?
            GROUP BY id_user, id_entity 
            `;

            const [results] = await this.conn.promise().query(query, [id_ep]);
            return results;
        } catch (error) {
            console.error("Error en getPeopleForSupervisor Quiz Performance:", error.message);
            throw new Error("Error en getPeopleForSupervisor Quiz Performance: " + error.message);
        }
    }

    async getTotalResultsExclude(
        limit = this.defaultLimitPagination,
        offset = this.defaultOffsetPagination,
        orderBy = this.defaultOrderBy,
        order = this.defaultOrderPagination,
        filters = {},
        supervisorsToExclude = []
    ) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {
            const excludeClause = supervisorsToExclude.length > 0
                ? `id_user NOT IN (${supervisorsToExclude.map(() => '?').join(', ')})`
                : '';

            const query = `
            SELECT 
                COUNT(DISTINCT u.id_user) AS total
            FROM entity e
                JOIN user u ON e.id_entity = u.entity_fk
                JOIN entity_department_occupation edo ON e.id_entity = edo.entity_fk
                JOIN department d ON edo.department_fk = d.id_department
                JOIN occupation o ON edo.occupation_fk = o.id_occupation
            ${whereClause.length > 0 || excludeClause ? 'WHERE' : ''}
            ${excludeClause} 
            ${excludeClause && whereClause.length > 0 ? 'AND' : ''}
            ${whereClause}
            ORDER BY ${orderBy} ${order} 
            LIMIT ? OFFSET ?;
            `;

            const [results] = await this.conn.promise().query(query, [...supervisorsToExclude, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en getTotalResultsExcludes:", error.message);
            throw new Error("Error en getTotalResultsExcludes: " + error.message);
        }
    }

    async getTotalResults(field) {
        try {
            const query = `SELECT COUNT(${field}) as total FROM ${this.model}`;
            const [results] = await this.con.promise().query(query);
            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }
    }

    async isSupervisorInSomeQuiz(id_user) {
        try {
            const query = `
            select id_spq from supervisor_performance_questionnaire spq 
            where spq.user_fk = ?
            `
            const [results] = await this.con.promise().query(query, [id_user])

            return results;
        } catch (error) {
            console.error("Error en CheckIfIsSupervisor:", error.message);
            throw new Error("Error en CheckIfIsSupervisor: " + error.message);
        }
    }

    async getLastFive(id_user) {
        try {
            const query = `
            SELECT id_ep,
                id_spq,
                name_ep,
                start_ep,
                end_ep,
                status_ep,
                (
                select count(id_epq) 
                from evaluation_performance_question epq 
                where epq.ep_fk = ep.id_ep
                ) as "quantity_questions",
                ep.created_at,
                ep.updated_at
           from evaluation_performance ep 
           join supervisor_performance_questionnaire spq on ep.id_ep = spq.ep_fk 
           where spq.user_fk = ?
           group by name_ep, id_ep
           order by start_ep desc
           limit 5 offset 0
                `;

            const [results] = await this.con.promise().query(query, [id_user]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getEmployeesToEvaluate(department_supervisor, limit = this.defaultLimitPagination,
        offset = this.defaultOffsetPagination,
        orderBy = this.defaultOrderBy,
        order = this.defaultOrderPagination,
        filters = {},
        EmployeesToExclude = []) {

        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);

        try {
            const excludeClause = EmployeesToExclude.length > 0
                ? `id_user NOT IN (${EmployeesToExclude.map(() => '?').join(', ')})`
                : '';

            const query = `
                SELECT 
                    e.id_entity,
                    u.id_user,
                    e.name_entity,
                    e.lastname_entity,
                    o.name_occupation,
                    u.avatar_user
                FROM 
                    entity e
                JOIN 
                    user u ON e.id_entity = u.entity_fk
                JOIN 
                    entity_department_occupation edo ON e.id_entity = edo.entity_fk
                JOIN 
                    department d ON edo.department_fk = d.id_department
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation
                LEFT JOIN 
                    answer_performance ap ON ap.evaluated_fk = u.id_user 
                LEFT JOIN 
                    detail_evaluation_performance dep ON ap.id_ap = dep.ap_fk  
                WHERE 
                    dep.id_dep IS NULL
                    AND d.id_department = ? 
                    ${whereClause.length > 0 || excludeClause ? 'AND' : ''}
                    ${excludeClause} 
                    ${excludeClause && whereClause.length > 0 ? 'AND' : ''}
                    ${whereClause}
                GROUP BY 
                    u.id_user, e.id_entity
                ORDER BY 
                    ${orderBy} ${order} 
                LIMIT ? OFFSET ?
            `;

            const [results] = await this.conn.promise().query(query, [department_supervisor, ...EmployeesToExclude, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en getTotalResultsExcludes:", error.message);
            throw new Error("Error en getTotalResultsExcludes: " + error.message);
        }
    }

    async getTotalEmployeesToEvaluate(department_supervisor, limit = this.defaultLimitPagination,
        offset = this.defaultOffsetPagination,
        orderBy = this.defaultOrderBy,
        order = this.defaultOrderPagination,
        filters = {},
        EmployeesToExclude = []) {

        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);

        try {
            const excludeClause = EmployeesToExclude.length > 0
                ? `id_user NOT IN (${EmployeesToExclude.map(() => '?').join(', ')})`
                : '';

            const query = `
            SELECT 
                COUNT(DISTINCT u.id_user) AS total
            FROM 
            entity e
                JOIN 
                    user u ON e.id_entity = u.entity_fk
                JOIN 
                    entity_department_occupation edo ON e.id_entity = edo.entity_fk
                JOIN 
                    department d ON edo.department_fk = d.id_department
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation
                LEFT JOIN 
                    answer_performance ap ON ap.evaluated_fk = u.id_user 
                LEFT JOIN 
                    detail_evaluation_performance dep ON ap.id_ap = dep.ap_fk  
                WHERE 
                    dep.id_dep IS NULL
                    AND d.id_department = ? 
                    ${whereClause.length > 0 || excludeClause ? 'AND' : ''}
                    ${excludeClause} 
                    ${excludeClause && whereClause.length > 0 ? 'AND' : ''}
                    ${whereClause}
                ORDER BY 
                    ${orderBy} ${order} 
                LIMIT ? OFFSET ?
            `;

            const [results] = await this.conn.promise().query(query, [department_supervisor, ...EmployeesToExclude, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en getTotalResultsExcludes:", error.message);
            throw new Error("Error en getTotalResultsExcludes: " + error.message);
        }
    }

    async getDepartmentForSupervisor(id_user) {
        try {
            const query = `
               
                SELECT id_department,
                id_user
                from user u
                join entity e on u.entity_fk = e.id_entity
                join entity_department_occupation edo on e.id_entity = edo.entity_fk
                join department d on edo.department_fk = d.id_department
                where u.id_user = ?
                group by id_user
                `
            const [results] = await this.conn.promise().query(query, [id_user])
            return results[0];
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getQuizzesInformationForSupervisor(id_supervisor, limit = this.defaultLimitPagination,
        offset = this.defaultOffsetPagination,
        orderBy = this.defaultOrderBy,
        order = this.defaultOrderPagination,
        filters = {}
    ) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
               
                        select id_ep,
                        name_ep,
                        start_ep,
                        end_ep,
                        concat(name_entity," ",lastname_entity) as "author",
                        ep.created_at,
                        ep.updated_at,
                        (
                        select count(id_epq) 
                        from evaluation_performance_question epq
                        where epq.ep_fk = ep.id_ep
                        ) as "quantity_questions"
                        from evaluation_performance ep
                    join evaluation_performance_question epq on ep.id_ep = epq.ep_fk
                    join user u on ep.author_fk = u.id_user
                    join entity e on u.entity_fk = e.id_entity  
                    join supervisor_performance_questionnaire spq on ep.id_ep = spq.ep_fk 
                    left join entity_department_occupation edo on edo.entity_fk = e.id_entity
                    where spq.user_fk = ?
                    ${whereClause.length > 0 ? 'AND' : ''}
                    ${whereClause}
                    group by name_ep
                    ORDER BY ${orderBy} ${order} 
                    LIMIT ? OFFSET ?;
                `

            const [results] = await this.conn.promise().query(query, [id_supervisor, ...values, limit, offset])
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getTotalQuizzesInformationForSupervisor(id_supervisor, limit = this.defaultLimitPagination,
        offset = this.defaultOffsetPagination,
        orderBy = this.defaultOrderBy,
        order = this.defaultOrderPagination,
        filters = {}
    ) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);


            const query = `
                        select 
                        COUNT(DISTINCT ep.id_ep) AS total
                        from evaluation_performance ep
                    join evaluation_performance_question epq on ep.id_ep = epq.ep_fk
                    join user u on ep.author_fk = u.id_user
                    join entity e on u.entity_fk = e.id_entity  
                    join supervisor_performance_questionnaire spq on ep.id_ep = spq.ep_fk 
                    left join entity_department_occupation edo on edo.entity_fk = e.id_entity
                    where spq.user_fk = ?
                    ${whereClause.length > 0 ? 'AND' : ''}
                    ${whereClause}
                    ORDER BY ${orderBy} ${order} 
                    LIMIT ? OFFSET ?;
                `
            const [results] = await this.conn.promise().query(query, [id_supervisor, ...values, limit, offset])
            return results[0];
        } catch (error) {
            console.error("Error en Users Quiz Performance:", error.message);
            throw new Error("Error en Users Quiz Performance: " + error.message);
        }
    }

    async getAnswersForQuizForSupervisor(id_ep, id_department, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {

            
            const query = `
                SELECT 
                    uevaluated.avatar_user,
                    evaluated.name_entity as evaluated_name,
                    evaluated.lastname_entity as evaluated_lastname,
                    uevaluated.id_user as evaluated_id,
                    ep.id_ep,
                    ap2.id_ap,
                    ep.name_ep,
                    ep.start_ep,
                    ep.end_ep,
                    ep.created_at,
                    ap2.date_complete,
                    d.name_department,
                    o.name_occupation,
                    (
                        SELECT ROUND(AVG(dep.score_dep), 2)
                        FROM detail_evaluation_performance dep
                        JOIN answer_performance ap ON dep.ap_fk = ap.id_ap
                        WHERE ap.ep_fk = ?
                    ) AS average,
                    esupervisor.name_entity as supervisor_name, 
                    esupervisor.lastname_entity as supervisor_lastname,
                    usupervisor.id_user as supervisor_id
                FROM 
                    evaluation_performance ep 
                JOIN 
                    answer_performance ap2 ON ap2.ep_fk = ep.id_ep 
                JOIN 
                    user uevaluated ON ap2.evaluated_fk = uevaluated.id_user 
                JOIN 
                    entity evaluated ON uevaluated.entity_fk = evaluated.id_entity 
                JOIN 
                    entity_department_occupation edo ON edo.entity_fk = evaluated.id_entity 
                JOIN 
                    department d ON edo.department_fk = d.id_department 
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation 
                JOIN 
                    supervisor_performance_questionnaire spq ON spq.id_spq = ap2.author_fk
                JOIN 
                    answer_performance apsupervisor ON spq.id_spq = apsupervisor.author_fk
                JOIN 
                    user usupervisor ON spq.user_fk = usupervisor.id_user
                JOIN 
                    entity esupervisor ON usupervisor.entity_fk = esupervisor.id_entity
                WHERE 
                    ep.id_ep = ?
                    and d.id_department = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                GROUP BY 
                    uevaluated.id_user, evaluated.id_entity
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [id_ep, id_ep, id_department, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getTotalAnswersForQuizForSupervisor(id_ep, id_department, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {

            const query = `
                SELECT 
                    count(DISTINCT ap2.id_ap) as total
                FROM 
                    evaluation_performance ep 
                JOIN 
                    answer_performance ap2 ON ap2.ep_fk = ep.id_ep 
                JOIN 
                    user uevaluated ON ap2.evaluated_fk = uevaluated.id_user 
                JOIN 
                    entity evaluated ON uevaluated.entity_fk = evaluated.id_entity 
                JOIN 
                    entity_department_occupation edo ON edo.entity_fk = evaluated.id_entity 
                JOIN 
                    department d ON edo.department_fk = d.id_department 
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation 
                JOIN 
                    supervisor_performance_questionnaire spq ON spq.id_spq = ap2.author_fk
                JOIN 
                    answer_performance apsupervisor ON spq.id_spq = apsupervisor.author_fk
                JOIN 
                    user usupervisor ON spq.user_fk = usupervisor.id_user
                JOIN 
                    entity esupervisor ON usupervisor.entity_fk = esupervisor.id_entity
                WHERE 
                    ep.id_ep = ?
                    and d.id_department = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;


            const [results] = await this.con.promise().query(query, [id_ep, id_department, ...values, limit, offset]);
            return results[0];
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getBodySpAnswerByIdQuizAndUser(id_ep, id_user) {
        try {
            const query = `
            SELECT 
                description_epq,
                bad_parameter_epq,
                best_parameter_epq,
                score_dep,
                description_dep
                from detail_evaluation_performance dep 
                join evaluation_performance_question epq on dep.epq_fk = epq.id_epq 
                join answer_performance ap ON dep.ap_fk = ap.id_ap 
                join evaluation_performance ep on ap.ep_fk = ep.id_ep 
            where ap.evaluated_fk = ?
            and id_ep = ?
            group by id_epq;
        `;

            const [results] = await this.con.promise().query(query, [id_user, id_ep]);

            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }

    }

    async getCompleteHeaderQuiz(id_ep) {
        try {
            const query = `
            select 
                id_ep,
                name_ep,
                start_ep,
                u.avatar_user,
                end_ep,
                concat(e.name_entity ," ", e.lastname_entity) as author,
                (
                SELECT COUNT(epq.id_epq) 
                FROM evaluation_performance_question epq 
                WHERE epq.ep_fk = ep.id_ep
                ) AS quantity_questions,
                u.avatar_user,
                name_department
            from evaluation_performance ep
            join user u on ep.author_fk = u.id_user 
            join entity e on u.entity_fk = e.id_entity 
            join entity_department_occupation edo on edo.entity_fk = e.id_entity 
            join department d on edo.department_fk = d.id_department
            where id_ep = ?;
            `;
            const [results] = await this.con.promise().query(query, [id_ep]);
            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }
    }

    async getQuizInformationAnsweredForRrhh(id_ep, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {
            
            const query = `
                SELECT 
                    uevaluated.avatar_user,
                    evaluated.name_entity as evaluated_name,
                    evaluated.lastname_entity as evaluated_lastname,
                    uevaluated.id_user as evaluated_id,
                    ep.id_ep,
                    ap2.id_ap,
                    ep.name_ep,
                    ep.start_ep,
                    ep.end_ep,
                    ep.created_at,
                    ap2.date_complete,
                    d.name_department,
                    o.name_occupation,
                    (
                        SELECT ROUND(AVG(dep.score_dep), 2)
                        FROM detail_evaluation_performance dep
                        JOIN answer_performance ap ON dep.ap_fk = ap.id_ap
                        WHERE ap.ep_fk = ?
                    ) AS average,
                    esupervisor.name_entity as supervisor_name, 
                    esupervisor.lastname_entity as supervisor_lastname,
                    usupervisor.id_user as supervisor_id
                FROM 
                    evaluation_performance ep 
                JOIN 
                    answer_performance ap2 ON ap2.ep_fk = ep.id_ep 
                JOIN 
                    user uevaluated ON ap2.evaluated_fk = uevaluated.id_user 
                JOIN 
                    entity evaluated ON uevaluated.entity_fk = evaluated.id_entity 
                JOIN 
                    entity_department_occupation edo ON edo.entity_fk = evaluated.id_entity 
                JOIN 
                    department d ON edo.department_fk = d.id_department 
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation 
                JOIN 
                    supervisor_performance_questionnaire spq ON spq.id_spq = ap2.author_fk
                JOIN 
                    answer_performance apsupervisor ON spq.id_spq = apsupervisor.author_fk
                JOIN 
                    user usupervisor ON spq.user_fk = usupervisor.id_user
                JOIN 
                    entity esupervisor ON usupervisor.entity_fk = esupervisor.id_entity
                WHERE 
                    ep.id_ep = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                GROUP BY 
                    uevaluated.id_user, evaluated.id_entity
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            const [results] = await this.con.promise().query(query, [id_ep, id_ep, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getTotalQuizInformationAnsweredForRrhh(id_ep,limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {

            const query = `
                SELECT 
                    count(DISTINCT ap2.id_ap) as total
                FROM 
                    evaluation_performance ep 
                JOIN 
                    answer_performance ap2 ON ap2.ep_fk = ep.id_ep 
                JOIN 
                    user uevaluated ON ap2.evaluated_fk = uevaluated.id_user 
                JOIN 
                    entity evaluated ON uevaluated.entity_fk = evaluated.id_entity 
                JOIN 
                    entity_department_occupation edo ON edo.entity_fk = evaluated.id_entity 
                JOIN 
                    department d ON edo.department_fk = d.id_department 
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation 
                JOIN 
                    supervisor_performance_questionnaire spq ON spq.id_spq = ap2.author_fk
                JOIN 
                    answer_performance apsupervisor ON spq.id_spq = apsupervisor.author_fk
                JOIN 
                    user usupervisor ON spq.user_fk = usupervisor.id_user
                JOIN 
                    entity esupervisor ON usupervisor.entity_fk = esupervisor.id_entity
                WHERE 
                    ep.id_ep = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;


            const [results] = await this.con.promise().query(query, [id_ep, ...values, limit, offset]);
            return results[0];
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getAnswersForQuizForPersonal(id_user, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {

            
            const query = `
                SELECT 
                    uevaluated.avatar_user,
                    evaluated.name_entity AS evaluated_name,
                    evaluated.lastname_entity AS evaluated_lastname,
                    uevaluated.id_user AS evaluated_id,
                    ep.id_ep,
                    ap2.id_ap,
                    ep.name_ep,
                    ep.start_ep,
                    ep.end_ep,
                    ep.created_at,
                    ap2.date_complete,
                    d.name_department,
                    o.name_occupation,
                    (
                        SELECT ROUND(AVG(dep.score_dep), 2)
                        FROM detail_evaluation_performance dep
                        JOIN answer_performance ap ON dep.ap_fk = ap.id_ap
                        WHERE ap.ep_fk = ep.id_ep 
                    ) AS average,
                    esupervisor.name_entity AS supervisor_name, 
                    esupervisor.lastname_entity AS supervisor_lastname,
                    usupervisor.id_user AS supervisor_id
                FROM 
                    evaluation_performance ep
                JOIN 
                    answer_performance ap2 ON ap2.ep_fk = ep.id_ep 
                JOIN 
                    user uevaluated ON ap2.evaluated_fk = uevaluated.id_user 
                JOIN 
                    entity evaluated ON uevaluated.entity_fk = evaluated.id_entity 
                JOIN 
                    entity_department_occupation edo ON edo.entity_fk = evaluated.id_entity 
                JOIN 
                    department d ON edo.department_fk = d.id_department 
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation 
                JOIN 
                    supervisor_performance_questionnaire spq ON spq.id_spq = ap2.author_fk
                JOIN 
                    answer_performance apsupervisor ON spq.id_spq = apsupervisor.author_fk
                JOIN 
                    user usupervisor ON spq.user_fk = usupervisor.id_user
                JOIN 
                    entity esupervisor ON usupervisor.entity_fk = esupervisor.id_entity
                WHERE 
                    ap2.date_complete IS NOT NULL 
                    AND uevaluated.id_user = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                GROUP BY 
                    uevaluated.id_user, evaluated.id_entity
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;

            console.log(whereClause);

            const [results] = await this.con.promise().query(query, [id_user, ...values, limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

    async getTotalAnswersForQuizForPersonal(id_user, limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
        try {

            const query = `
                SELECT 
                    count(DISTINCT ap2.id_ap) as total
                FROM 
                    evaluation_performance ep 
                JOIN 
                    answer_performance ap2 ON ap2.ep_fk = ep.id_ep 
                JOIN 
                    user uevaluated ON ap2.evaluated_fk = uevaluated.id_user 
                JOIN 
                    entity evaluated ON uevaluated.entity_fk = evaluated.id_entity 
                JOIN 
                    entity_department_occupation edo ON edo.entity_fk = evaluated.id_entity 
                JOIN 
                    department d ON edo.department_fk = d.id_department 
                JOIN 
                    occupation o ON edo.occupation_fk = o.id_occupation 
                JOIN 
                    supervisor_performance_questionnaire spq ON spq.id_spq = ap2.author_fk
                JOIN 
                    answer_performance apsupervisor ON spq.id_spq = apsupervisor.author_fk
                JOIN 
                    user usupervisor ON spq.user_fk = usupervisor.id_user
                JOIN 
                    entity esupervisor ON usupervisor.entity_fk = esupervisor.id_entity
                WHERE 
                    uevaluated.id_user = ?
                                ${whereClause.length > 0 ? 'AND' : ''}
                                ${whereClause}
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?`;


            const [results] = await this.con.promise().query(query, [id_user, ...values, limit, offset]);
            return results[0];
        } catch (error) {
            console.error("Error en Users Quiz Satisfaction:", error.message);
            throw new Error("Error en Users Quiz Satisfaction: " + error.message);
        }
    }

}

export default PerformanceModel;