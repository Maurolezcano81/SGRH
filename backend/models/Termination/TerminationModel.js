import BaseModel from "../../models/BaseModel.js";
import Connection from "../../config/connection.js";


class TerminationModel extends BaseModel {
    constructor() {
        super('termination_employee', 'id_te');
        this.db = new Connection();
        this.conn = this.db.createCon();

    }

    async getUserData(id_employee) {
        try {
            const query = `
            select 
                id_user, 
                id_entity, 
                id_employee 
            from employee emp
                join entity e on emp.entity_fk = e.id_entity 
                join user u on e.id_entity = u.entity_fk 
                where emp.id_employee = ?
            `

            const [results] = await this.conn.promise().query(query, [id_employee])

            return results[0];

        } catch (error) {
            console.error(error.message);
        }
    }


    async getLastTerminationsByEmployee(id_employee) {
        try {
            const query = `
            select 
                id_te,
                description_tot,
                te.date_te
            from termination_employee te
            join type_of_termination tot on te.tot_fk = tot.id_tot 
            where te.employee_fk = ?
           	and te.status_tot = 1
           	group by id_te 
           	order by date_te asc
            `

            const [results] = await this.conn.promise().query(query, [id_employee])

            return results;

        } catch (error) {
            console.error(error.message);
        }
    }

    async UpdateAllTerminationByEmployee(id_employee, id_last_termination) {

        try {
            const query = `
            update termination_employee
            set status_tot = 0
            where employee_fk = ?
            and id_te = ?
            `
            const [results] = await this.conn.promise().query(query, [id_employee, id_last_termination])

            return results;

        } catch (error) {
            console.error(error.message);
        }
    }

}


export default TerminationModel;