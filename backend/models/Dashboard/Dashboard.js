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


}


export default DashboardModel