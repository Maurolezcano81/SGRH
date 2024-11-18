import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class DashboardModel extends BaseModel {
    constructor() {
        super('user', 'username_user');
        this.db = new Connection();
        this.conn = this.db.createCon();

        this.terminationEmployee = new BaseModel('termination_employee', 'id_te')

    }

    async percentOfDismiss(year) {
        try {
            const query = `
                WITH months AS (
                    SELECT 1 AS month
                    UNION ALL SELECT 2
                    UNION ALL SELECT 3
                    UNION ALL SELECT 4
                    UNION ALL SELECT 5
                    UNION ALL SELECT 6
                    UNION ALL SELECT 7
                    UNION ALL SELECT 8
                    UNION ALL SELECT 9
                    UNION ALL SELECT 10
                    UNION ALL SELECT 11
                    UNION ALL SELECT 12
                )
                SELECT 
                    m.month AS month_number,              
                    CASE m.month
                        WHEN 1 THEN 'Enero'
                        WHEN 2 THEN 'Febrero'
                        WHEN 3 THEN 'Marzo'
                        WHEN 4 THEN 'Abril'
                        WHEN 5 THEN 'Mayo'
                        WHEN 6 THEN 'Junio'
                        WHEN 7 THEN 'Julio'
                        WHEN 8 THEN 'Agosto'
                        WHEN 9 THEN 'Septiembre'
                        WHEN 10 THEN 'Octubre'
                        WHEN 11 THEN 'Noviembre'
                        WHEN 12 THEN 'Diciembre'
                    END AS month_name,                         
                    IFNULL(COUNT(te.id_te), 0) AS total_terminations 
                FROM 
                    months m
                LEFT JOIN 
                    termination_employee te 
                    ON MONTH(te.date_te) = m.month
                    AND YEAR(te.date_te) = ?
                GROUP BY 
                    m.month
                ORDER BY 
                    m.month;
            `

            const [results] = await this.conn.promise().query(query, [year]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getMinAndMaxYearsForDismiss() {
        try {
            const query = `
                SELECT 
                    MIN(YEAR(date_te)) AS 'min', 
                    MAX(YEAR(date_te)) AS 'max' 
                FROM 
                    termination_employee te;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }

    }


    async getMinAndMaxDatesForMovementsOnDepartments() {
        try {
            const query = `
                SELECT 
                    (SELECT MIN(date_te) FROM termination_employee) AS min_date_te,
                    (SELECT MIN(date_entry_employee) FROM employee) AS min_date_entry_employee,
                    (SELECT MAX(date_te) FROM termination_employee) as max_date_te,
                    (SELECT MAX(date_entry_employee) FROM employee) AS max_date_entry_employee;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getQuantitiesForMovementsOnDepartments(year) {
        try {
            const query = `
                    WITH months AS (
                        SELECT 1 AS month
                        UNION ALL SELECT 2
                        UNION ALL SELECT 3
                        UNION ALL SELECT 4
                        UNION ALL SELECT 5
                        UNION ALL SELECT 6
                        UNION ALL SELECT 7
                        UNION ALL SELECT 8
                        UNION ALL SELECT 9
                        UNION ALL SELECT 10
                        UNION ALL SELECT 11
                        UNION ALL SELECT 12
                    )
                    SELECT 
                        m.month AS month_number,
                        CASE m.month
                        WHEN 1 THEN 'Enero'
                        WHEN 2 THEN 'Febrero'
                        WHEN 3 THEN 'Marzo'
                        WHEN 4 THEN 'Abril'
                        WHEN 5 THEN 'Mayo'
                        WHEN 6 THEN 'Junio'
                        WHEN 7 THEN 'Julio'
                        WHEN 8 THEN 'Agosto'
                        WHEN 9 THEN 'Septiembre'
                        WHEN 10 THEN 'Octubre'
                        WHEN 11 THEN 'Noviembre'
                        WHEN 12 THEN 'Diciembre'
                        END AS month_name,
                        COALESCE(terminations.total_terminations, 0) AS total_terminations,
                        COALESCE(entries.total_entries, 0) AS total_entries
                    FROM 
                        months m
                    LEFT JOIN 
                        (SELECT 
                            MONTH(te.date_te) AS month,
                            COUNT(te.id_te) AS total_terminations
                        FROM 
                            termination_employee te
                        WHERE 
                            YEAR(te.date_te) = ?
                            and te.status_tot = 1
                        GROUP BY 
                            MONTH(te.date_te)
                        ) AS terminations ON m.month = terminations.month
                    LEFT JOIN 
                        (SELECT 
                            MONTH(e.date_entry_employee) AS month,
                            COUNT(e.id_employee) AS total_entries
                        FROM 
                            employee e
                        WHERE 
                            YEAR(e.date_entry_employee) = ?
                        GROUP BY 
                            MONTH(e.date_entry_employee)
                        ) AS entries ON m.month = entries.month
                    ORDER BY 
                        m.month;
            `

            const [results] = await this.conn.promise().query(query, [year, year]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getReasonsForDismiss() {
        try {
            const query = `
                SELECT 
                    tot.description_tot,
                    COUNT(te.tot_fk) AS 'total_terminations'
                FROM 
                    type_of_termination tot
                LEFT JOIN 
                    termination_employee te 
                    ON te.tot_fk = tot.id_tot
                GROUP BY 
                    tot.description_tot;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getQuantityDaysForLeaves() {
        try {
            const query = `
                SELECT 
                    tol.name_tol, 
                    COALESCE(SUM(DATEDIFF(lr.end_lr, lr.start_lr) + 1), 0) AS total_days 
                FROM 
                    type_of_leave tol 
                LEFT JOIN 
                    leave_request lr ON lr.tol_fk = tol.id_tol 
                LEFT JOIN 
                    leave_response_request lrr ON lrr.lr_fk = lr.id_lr 
                LEFT JOIN 
                    status_request sr ON lrr.sr_fk = sr.id_sr AND sr.name_sr = 'Completado' 
                GROUP BY 
                    tol.name_tol 
                ORDER BY 
                    tol.name_tol;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getQuantityDaysForLeavesAndDepartment() {
        try {
            const query = `
            SELECT 
                d.name_department,               
                COALESCE(tol.name_tol, 'Sin Tipo de Licencia') AS type_of_leave, 
                COALESCE(SUM(DATEDIFF(lr.end_lr, lr.start_lr) + 1), 0) AS total_days 
            FROM 
                department d                      
            LEFT JOIN 
                entity_department_occupation edo ON d.id_department = edo.department_fk 
            LEFT JOIN 
                entity e ON edo.entity_fk = e.id_entity 
            LEFT JOIN 
                user u ON e.id_entity = u.entity_fk 
            LEFT JOIN 
                leave_request lr ON lr.user_fk = u.id_user 
            LEFT JOIN 
                leave_response_request lrr ON lrr.lr_fk = lr.id_lr 
            LEFT JOIN 
                status_request sr ON lrr.sr_fk = sr.id_sr AND sr.name_sr = 'Completado'
            LEFT JOIN 
                type_of_leave tol ON lr.tol_fk = tol.id_tol 
            GROUP BY 
                d.name_department,                
                tol.name_tol                     
            ORDER BY 
                d.name_department,                
                tol.name_tol;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getLeavesOnPeriodOfTime(firstTime, secondTime) {


        try {
            const query =
                `
   WITH months AS (
    SELECT 1 AS month
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
    UNION ALL SELECT 5
    UNION ALL SELECT 6
    UNION ALL SELECT 7
    UNION ALL SELECT 8
    UNION ALL SELECT 9
    UNION ALL SELECT 10
    UNION ALL SELECT 11
    UNION ALL SELECT 12
)
SELECT 
    m.month AS month_number,
    CASE m.month
        WHEN 1 THEN 'Enero'
        WHEN 2 THEN 'Febrero'
        WHEN 3 THEN 'Marzo'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Mayo'
        WHEN 6 THEN 'Junio'
        WHEN 7 THEN 'Julio'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Septiembre'
        WHEN 10 THEN 'Octubre'
        WHEN 11 THEN 'Noviembre'
        WHEN 12 THEN 'Diciembre'
    END AS month_name,
    COALESCE(licenses.total_licenses, 0) AS total_licenses,
    COALESCE(licenses.total_days, 0) AS total_days
FROM 
    months m
LEFT JOIN (
    SELECT 
        MONTH(lr.start_lr) AS month,
        COUNT(lr.id_lr) AS total_licenses,
        SUM(DATEDIFF(lr.end_lr, lr.start_lr) + 1) AS total_days
    FROM 
        leave_request lr
    JOIN 
        leave_response_request lrr ON lr.id_lr = lrr.lr_fk
    JOIN 
        status_request sr ON lrr.sr_fk = sr.id_sr
    WHERE 
        sr.name_sr = 'Completado'
            AND lr.start_lr BETWEEN ? and ? 
    GROUP BY 
        MONTH(lr.start_lr)
) AS licenses ON m.month = licenses.month
ORDER BY 
    m.month;                           
           `

            const [results] = await this.conn.promise().query(query, [firstTime, secondTime]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getMinAndMaxLeavesOnPeriodOfTime(firstTime, secondTime) {
        try {
            const query =
                `
                SELECT 
                    MIN(lr.start_lr) AS earliest_start,   
                    MAX(lr.end_lr) AS latest_end        
                FROM 
                    leave_request lr 
                JOIN 
                    leave_response_request lrr ON lr.id_lr = lrr.lr_fk 
                JOIN 
                    status_request sr ON lrr.sr_fk = sr.id_sr 
                JOIN 
                    type_of_leave tol ON lr.tol_fk = tol.id_tol 
                JOIN 
                    user u ON lr.user_fk = u.id_user 
                WHERE 
                    sr.name_sr = 'Aprobado'                              
           `

            const [results] = await this.conn.promise().query(query, [firstTime, secondTime]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }


    async getAveragePerformanceByEmployee(id_user) {
        try {
            const query =
                `
                SELECT 
                    ep.name_ep,        
                    AVG(ROUND(dep.score_dep, 2)) AS average_score,      
                    u.username_user,                          
                    e.name_entity,                           
                    e.lastname_entity                         
                FROM 
                    user u
                JOIN 
                    entity e ON e.id_entity = u.entity_fk 
                JOIN 
                    answer_performance ap ON u.id_user = ap.evaluated_fk 
                JOIN 
                    detail_evaluation_performance dep ON ap.id_ap = dep.ap_fk 
                JOIN 
                    evaluation_performance ep ON ap.ep_fk = ep.id_ep 
                    where id_user = ?
                GROUP BY 
                    ep.name_ep
                ORDER BY 
                    ep.name_ep;                                
           `

            const [results] = await this.conn.promise().query(query, [id_user]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getAveragePerformanceByEmployee(id_user) {
        try {
            const query =
                `
                               SELECT 
                    ep.name_ep,        
                    AVG(ROUND(dep.score_dep, 2)) AS average_score,      
                    u.username_user,                          
                    e.name_entity,                           
                    e.lastname_entity,
                    date_complete,
                    eanswered.name_entity as answered_name,
                    eanswered.lastname_entity as answered_lastname                       
                FROM 
                    user u
                JOIN 
                    entity e ON e.id_entity = u.entity_fk 
                JOIN 
                    answer_performance ap ON u.id_user = ap.evaluated_fk 
                JOIN 
                    detail_evaluation_performance dep ON ap.id_ap = dep.ap_fk 
                JOIN 
                    evaluation_performance ep ON ap.ep_fk = ep.id_ep 
                left JOIN user uanswered on uanswered.id_user = ap.author_fk
                left JOIN entity eanswered on uanswered.entity_fk = eanswered.id_entity
                    where u.id_user = ?
                GROUP BY 
                    ep.name_ep
                ORDER BY 
                    ep.name_ep;                              
           `

            const [results] = await this.conn.promise().query(query, [id_user]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }


    async getAveragePerformanceByDepartments() {
        try {
            const query =
                `
                     SELECT 
                        d.name_department,        
                        AVG(ROUND(dep.score_dep, 2)) AS average_score  
                    FROM 
                        department d 
                    JOIN 
                        entity_department_occupation edo ON d.id_department = edo.department_fk 
                    JOIN 
                        entity e ON e.id_entity = edo.entity_fk
                    JOIN 
                        user u ON e.id_entity = u.id_user 
                    JOIN 
                        answer_performance ap ON u.id_user = ap.evaluated_fk
                    LEFT JOIN 
                        user uanswered ON uanswered.id_user = ap.author_fk
                    LEFT JOIN 
                        entity eanswered ON uanswered.entity_fk = eanswered.id_entity
                    JOIN 
                        detail_evaluation_performance dep ON ap.id_ap = dep.ap_fk 
                    JOIN 
                        evaluation_performance ep ON ap.ep_fk = ep.id_ep 
                    GROUP BY 
                        d.name_department 
                    ORDER BY 
                        d.name_department;               
           `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async getAveragePerformanceByDepartmentsAndQuizzes(id_ep, id_department) {
        try {
            const query =
                `
                   SELECT 
                    ep.id_ep,
                    d.id_department,
                    ep.name_ep,        
                    AVG(ROUND(dep.score_dep, 2)) AS average_score,      
                    e.name_entity,      
                    e.lastname_entity,
                    date_complete
                FROM 
                    department d 
                join entity_department_occupation edo on d.id_department = edo.department_fk 
                JOIN 
                    entity e ON e.id_entity = edo.entity_fk
                    join user u on e.id_entity = u.id_user 
                JOIN 
                    answer_performance ap ON u.id_user = ap.evaluated_fk  
                    left JOIN user uanswered on uanswered.id_user = ap.author_fk
                                left JOIN entity eanswered on uanswered.entity_fk = eanswered.id_entity
                JOIN 
                    detail_evaluation_performance dep ON ap.id_ap = dep.ap_fk 
                JOIN 
                    evaluation_performance ep ON ap.ep_fk = ep.id_ep 
                        where ep.id_ep = ?
                    and d.id_department = ?
                GROUP BY 
                    ep.name_ep, d.name_department, e.name_entity, e.lastname_entity 
                ORDER BY 
                    ep.name_ep;
           `

           

            const [results] = await this.conn.promise().query(query, [id_ep, id_department]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }
}


export default DashboardModel