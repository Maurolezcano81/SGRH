import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class SummariesModel extends BaseModel {
    constructor() {
        super('user', 'username_user');
        this.db = new Connection();
        this.conn = this.db.createCon();
    }

    async PercentOfDismissByYear(year) {
        try {
            const query = `
                WITH DespidosPorMes AS (
                    SELECT 
                        DATE_FORMAT(date_te, '%Y-%m') AS mes,
                        COUNT(*) AS despidos
                    FROM 
                        termination_employee
                    WHERE 
                        YEAR(date_te) = ?
                        AND status_tot = 1
                    GROUP BY 
                        DATE_FORMAT(date_te, '%Y-%m')
                ),
                TotalEmpleadosContratados AS (
                    SELECT 
                        DATE_FORMAT(date_entry_employee, '%Y-%m') AS mes,
                        COUNT(*) AS empleados_mes
                    FROM 
                        employee
                    WHERE 
                        YEAR(date_entry_employee) <= ?
                    GROUP BY 
                        DATE_FORMAT(date_entry_employee, '%Y-%m')
                )
                SELECT 
                    d.mes,
                    d.despidos,
                    COALESCE(
                        (SELECT SUM(e.empleados_mes) 
                        FROM TotalEmpleadosContratados e 
                        WHERE e.mes <= d.mes), 0
                    ) AS total_empleados,
                    (COALESCE(
                        (SELECT SUM(e.empleados_mes) 
                        FROM TotalEmpleadosContratados e 
                        WHERE e.mes <= d.mes), 0
                    ) - d.despidos) AS total_restantes,
                    ROUND(
                        (d.despidos / COALESCE(
                            (SELECT SUM(e.empleados_mes) 
                            FROM TotalEmpleadosContratados e 
                            WHERE e.mes <= d.mes), 1
                        )) * 100, 2
                    ) AS porcentaje_despidos
                FROM 
                    DespidosPorMes d
                ORDER BY 
                    d.mes;
            `

            const [results] = await this.conn.promise().query(query, [year, year]);

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

    async getMinAndMaxDiffsOnDepartmentsInYear() {
        try {
            const query = `
                SELECT 
            MIN(YEAR(edo.created_at)) AS min,
            MAX(YEAR(edo.created_at)) AS max
            from entity_department_occupation edo
            `

            console.log(query)
            const [results] = await this.conn.promise().query(query, []);

            console.log(results)

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }


    async getDiffsOnDepartmentsInYear(year) {
        try {
            const query = `
            SELECT
                d.name_department,
                COUNT(CASE WHEN edo.status_edo = 1 THEN 1 END) as ups,
                COUNT(CASE WHEN edo.status_edo = 0 THEN 1 END) as downs,
                (COUNT(CASE WHEN edo.status_edo = 1 THEN 1 END) - COUNT(CASE WHEN edo.status_edo = 0 THEN 1 END)) as diff
            FROM
                entity_department_occupation edo
            JOIN 
                department d ON edo.department_fk = d.id_department
            JOIN 
                entity e ON edo.entity_fk = e.id_entity
            JOIN 
                employee emp ON e.id_entity = emp.entity_fk
            WHERE
                YEAR(edo.created_at) = ?
            GROUP BY
                d.name_department
            ORDER by
                d.name_department;
            `

            const [results] = await this.conn.promise().query(query, [year]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async DaysLeavesForDepartment(id_department) {
        try {
            const query = `
            SELECT 
                COALESCE(tol.name_tol, 'Sin Tipo de Licencia') AS type_of_leave, 
                COALESCE(SUM(DATEDIFF(lr.end_lr, lr.start_lr) + 1), 0) AS total_days,
                -- Total de días de ausencia por departamento
                (
                    SELECT 
                        COALESCE(SUM(DATEDIFF(lr_inner.end_lr, lr_inner.start_lr) + 1), 0) 
                    FROM 
                        leave_request lr_inner
                    LEFT JOIN 
                        user u_inner ON lr_inner.user_fk = u_inner.id_user
                    LEFT JOIN 
                        entity_department_occupation edo_inner ON u_inner.entity_fk = edo_inner.entity_fk
                    WHERE 
                        edo_inner.department_fk = d.id_department
                ) AS total_department_days,
                -- Porcentaje del total por tipo de ausencia
                ROUND(
                    (
                        COALESCE(SUM(DATEDIFF(lr.end_lr, lr.start_lr) + 1), 0) / 
                        (
                            SELECT 
                                COALESCE(SUM(DATEDIFF(lr_inner.end_lr, lr_inner.start_lr) + 1), 1) 
                            FROM 
                                leave_request lr_inner
                            LEFT JOIN 
                                user u_inner ON lr_inner.user_fk = u_inner.id_user
                            LEFT JOIN 
                                entity_department_occupation edo_inner ON u_inner.entity_fk = edo_inner.entity_fk
                            WHERE 
                                edo_inner.department_fk = d.id_department
                        )
                    ) * 100, 2
                ) AS percentage_of_total
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
            WHERE 
                d.id_department = ?
            GROUP BY 
                tol.name_tol, d.id_department                   
            ORDER BY 
                d.name_department,                
                tol.name_tol;
            `

            const [results] = await this.conn.promise().query(query, [id_department]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async MinAndMaxYearsDaysLeavesForYear() {
        try {
            const query = `
               SELECT 
                MIN(YEAR(lr.start_lr)) AS min,
                MAX(YEAR(lr.start_lr)) AS max
            FROM 
                leave_request lr
            join leave_response_request lrr on  lr.id_lr = lrr.lr_fk 
            join status_request sr on sr.id_sr = lrr.lr_fk 
            where sr.name_sr = "Completado"
            ;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async DaysLeavesForYear(year) {
        try {
            const query = `
                    SELECT 
                        tol.name_tol, 
                        COALESCE(SUM(DATEDIFF(lr.end_lr, lr.start_lr) + 1), 0) AS total_days,
                        (
                            SELECT 
                                COALESCE(SUM(DATEDIFF(lr_inner.end_lr, lr_inner.start_lr) + 1), 0) 
                            FROM 
                                leave_request lr_inner
                            LEFT JOIN 
                                leave_response_request lrr_inner ON lrr_inner.lr_fk = lr_inner.id_lr
                            LEFT JOIN 
                                status_request sr_inner ON lrr_inner.sr_fk = sr_inner.id_sr AND sr_inner.name_sr = 'Completado'
                            WHERE 
                                YEAR(lr_inner.start_lr) = ? 
                        ) AS total_all_days,
                        ROUND(
                            (
                                COALESCE(SUM(DATEDIFF(lr.end_lr, lr.start_lr) + 1), 0) / 
                                (
                                    SELECT 
                                        COALESCE(SUM(DATEDIFF(lr_inner.end_lr, lr_inner.start_lr) + 1), 1) 
                                    FROM 
                                        leave_request lr_inner
                                    LEFT JOIN 
                                        leave_response_request lrr_inner ON lrr_inner.lr_fk = lr_inner.id_lr
                                    LEFT JOIN 
                                        status_request sr_inner ON lrr_inner.sr_fk = sr_inner.id_sr AND sr_inner.name_sr = 'Completado'
                                    WHERE 
                                        YEAR(lr_inner.start_lr) = ?
                                )
                            ) * 100, 2
                        ) AS percentage_of_total
                    FROM 
                        type_of_leave tol 
                    LEFT JOIN 
                        leave_request lr ON lr.tol_fk = tol.id_tol 
                    LEFT JOIN 
                        leave_response_request lrr ON lrr.lr_fk = lr.id_lr 
                    LEFT JOIN 
                        status_request sr ON lrr.sr_fk = sr.id_sr AND sr.name_sr = 'Completado' 
                    WHERE 
                        YEAR(lr.start_lr) = ?
                    GROUP BY 
                        tol.name_tol 
                    ORDER BY 
                        tol.name_tol;
            `

            const [results] = await this.conn.promise().query(query, [year, year, year]);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async DiversityOfSexs() {
        try {
            const query = `
                SELECT
                    s.name_sex, 
                    COUNT(e.id_entity) AS total_employees,  
                    ROUND((COUNT(e.id_entity) * 100.0) / 
                        (SELECT COUNT(*) FROM entity
                        join employee emp on e.id_entity = emp.entity_fk
                        WHERE status_entity = 1 AND status_employee = 1), 2) AS percentage, 
                    (SELECT COUNT(*) FROM entity
                    join employee emp on e.id_entity = emp.entity_fk
                    WHERE status_entity = 1 AND status_employee = 1) AS total_all_employees  
                FROM 
                    sex s
                JOIN 
                    entity e ON e.sex_fk = s.id_sex
                    join employee emp on e.id_entity = emp.entity_fk
                WHERE 
                    e.status_entity = 1 AND emp.status_employee = 1
                GROUP BY 
                    s.name_sex
                ORDER BY 
                    total_employees DESC;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async longevityEmployees() {
        try {
            const query = `
                SELECT
                    CASE
                        WHEN TIMESTAMPDIFF(YEAR, e.date_birth_entity, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
                        WHEN TIMESTAMPDIFF(YEAR, e.date_birth_entity, CURDATE()) BETWEEN 26 AND 30 THEN '26-30'
                        WHEN TIMESTAMPDIFF(YEAR, e.date_birth_entity, CURDATE()) BETWEEN 31 AND 40 THEN '31-40'
                        WHEN TIMESTAMPDIFF(YEAR, e.date_birth_entity, CURDATE()) BETWEEN 41 AND 50 THEN '41-50'
                        WHEN TIMESTAMPDIFF(YEAR, e.date_birth_entity, CURDATE()) BETWEEN 51 AND 70 THEN '51-70'
                        ELSE 'Más de 70'
                    END AS age_range, 
                    COUNT(e.id_entity) AS total_employees, 
                    ROUND((COUNT(e.id_entity) * 100.0) / 
                        (SELECT COUNT(*) 
                        FROM entity 
                            join employee emp on e.id_entity = emp.entity_fk
                        WHERE status_entity = 1 AND status_employee = 1), 2) AS percentage  
                FROM 
                    entity e
                    join employee emp on e.id_entity = emp.entity_fk
                WHERE 
                    e.status_entity = 1 AND emp.status_employee = 1
                GROUP BY 
                    age_range
                ORDER BY 
                    age_range;
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async DiversityOfNacionalities() {
        try {
            const query = `
                SELECT
                    n.name_nacionality,
                    COUNT(e.id_entity) AS total_nacionalities,  
                    ROUND(COUNT(e.id_entity) * 100.0 / 
                        (SELECT COUNT(*) 
                        FROM entity e
                                    join employee emp on e.id_entity = emp.entity_fk
                        WHERE status_entity = 1
                        AND status_employee = 1), 2) AS percentage, 
                    (SELECT COUNT(*) 
                                FROM entity e
                                        join employee emp on e.id_entity = emp.entity_fk
                    WHERE status_entity = 1 AND status_employee = 1) AS total_employees 
                FROM 
                    entity e
                JOIN 
                    nacionality n ON e.nacionality_fk = n.id_nacionality  
                                        join employee emp on e.id_entity = emp.entity_fk
                WHERE 
                    e.status_entity = 1 AND emp.status_employee = 1
                GROUP BY 
                    n.name_nacionality
                ORDER BY 
                    total_nacionalities DESC;

            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async expensesByDepartments() {
        try {
            const query = `
                    SELECT
                        d.name_department AS name_department,  
                        SUM(o.salary_occupation) AS total_salary,  
                        (SELECT SUM(o2.salary_occupation) 
                        FROM entity_department_occupation edo2 
                        JOIN occupation o2 ON edo2.occupation_fk = o2.id_occupation
                        JOIN entity e2 ON edo2.entity_fk = e2.id_entity 
                        join 
                        employee emp on e2.id_entity = emp.entity_fk  AND emp.status_employee = 1
                        AND emp.status_employee = 1) AS total_company_costs,  
                        ROUND(SUM(o.salary_occupation) * 100.0 / 
                            (SELECT SUM(o2.salary_occupation) 
                            FROM entity_department_occupation edo2 
                            JOIN occupation o2 ON edo2.occupation_fk = o2.id_occupation
                            JOIN entity e2 ON edo2.entity_fk = e2.id_entity 
                            join 
                        employee emp on e.id_entity = emp.entity_fk  AND emp.status_employee = 1
                            AND emp.status_employee = 1), 2) AS percentage 
                    FROM 
                        department d
                    JOIN 
                        entity_department_occupation edo ON d.id_department = edo.department_fk
                    JOIN 
                        occupation o ON edo.occupation_fk = o.id_occupation
                    JOIN 
                        entity e ON edo.entity_fk = e.id_entity 
                        join 
                        employee emp on e.id_entity = emp.entity_fk  AND emp.status_employee = 1
                        AND emp.status_employee = 1
                    GROUP BY 
                        d.name_department  -- Agrupar por nombre del departamento
                    ORDER BY 
                        total_salary DESC;  -- Ordenar por el total de salarios de mayor a menor
            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }

    async expensesByRanges() {
        try {
            const query = `
                WITH SalaryBounds AS (
                    SELECT 
                        MIN(o.salary_occupation) AS min_salary, 
                        MAX(o.salary_occupation) AS max_salary
                    FROM 
                        occupation o
                        JOIN entity_department_occupation edo ON edo.occupation_fk = o.id_occupation AND edo.status_edo = 1 
                        JOIN entity e ON edo.entity_fk = e.id_entity
                        join 
                    employee emp on e.id_entity = emp.entity_fk  AND emp.status_employee = 1
                ), 
                SalaryRanges AS (
                    SELECT
                        min_salary + ((max_salary - min_salary) / 8) * (level - 1) AS range_start,
                        CASE 
                            WHEN level = 8 THEN max_salary
                            ELSE min_salary + ((max_salary - min_salary) / 8) * level
                        END AS range_end,
                        level
                    FROM 
                        SalaryBounds, 
                        (SELECT 1 AS level UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) levels
                ), 
                EmployeeSalaryCounts AS (
                    SELECT
                        sr.range_start,
                        sr.range_end,
                        COUNT(e.id_entity) AS total_employees
                    FROM 
                        SalaryRanges sr
                    LEFT JOIN 
                        occupation o 
                        ON 
                        (o.salary_occupation >= sr.range_start AND o.salary_occupation < sr.range_end)
                        OR (sr.level = 8 AND o.salary_occupation = sr.range_end)
                    LEFT JOIN 
                        entity_department_occupation edo 
                        ON edo.occupation_fk = o.id_occupation AND edo.status_edo = 1
                    LEFT JOIN 
                        entity e         ON edo.entity_fk = e.id_entity 
                    join 
                    employee emp on e.id_entity = emp.entity_fk  AND emp.status_employee = 1
                    GROUP BY 
                        sr.range_start, sr.range_end, sr.level
                )
                SELECT
                    CONCAT('De ', FORMAT(range_start, 2), ' a ', FORMAT(range_end, 2)) AS salary_range,
                    total_employees,
                    ROUND(total_employees * 100.0 / SUM(total_employees) OVER (), 2) AS percentage
                FROM 
                    EmployeeSalaryCounts
                ORDER BY 
                    range_start;

            `

            const [results] = await this.conn.promise().query(query, []);

            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadisticas para este apartado')
        }
    }
}


export default SummariesModel