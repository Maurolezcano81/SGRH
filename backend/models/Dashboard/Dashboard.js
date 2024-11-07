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
                    status_request sr ON lrr.sr_fk = sr.id_sr AND sr.name_sr = 'Aprobado' 
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
                status_request sr ON lrr.sr_fk = sr.id_sr AND sr.name_sr = 'Aprobado'
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


}


export default DashboardModel