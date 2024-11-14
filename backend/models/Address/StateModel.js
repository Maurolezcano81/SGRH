import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class StateModel extends BaseModel {
    constructor() {
        super('state', 'id_state');
        this.db = new Connection();
        this.conn = this.db.createCon();

    }

    async getStatesByCountry(country_fk, limit, offset, orderBy, order, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
                SELECT 
                    *
                from state s
                where country_fk = ?
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                GROUP BY name_state
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?
                `;

            const [results] = await this.con.promise().query(query, [country_fk, ...values, limit, offset]);

            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

    async getTotalStatesByCountry(country_fk, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
                SELECT 
                    count(distinct id_state) as total
                from state s
                where country_fk = ?
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                `;

            const [results] = await this.con.promise().query(query, [country_fk, ...values]);

            return results[0];
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }


    async getStatesActivesByCountry(country_fk, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
                SELECT 
                    s.*
                from state s
                where country_fk = ?
                and status_state = 1
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                GROUP BY name_state
                `;

            const [results] = await this.con.promise().query(query, [country_fk, ...values]);

            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

    async getOneByCountryAndNameState(country_fk, name_state) {
        try {
            const query = `
                SELECT 
                    *
                from state s
                where country_fk = ?
                and name_state = ?
                `;

            const [results] = await this.con.promise().query(query, [country_fk, name_state]);

            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

}

export default StateModel