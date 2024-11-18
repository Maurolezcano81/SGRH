import BaseModel from "../BaseModel.js";
import Connection from "../../config/connection.js";

class CityModel extends BaseModel {
    constructor() {
        super('city', 'id_city');
        this.db = new Connection();
        this.conn = this.db.createCon();

    }

    async getStatesByCountry(state_fk, limit, offset, orderBy, order, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
                SELECT 
                    *
                from city s
                where state_fk = ?
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                GROUP BY name_city
                ORDER BY ${orderBy} ${order} 
                LIMIT ? OFFSET ?
                `;

            const [results] = await this.con.promise().query(query, [state_fk, ...values, limit, offset]);

            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

    async getTotalStatesByCountry(state_fk, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
            const query = `
                SELECT 
                    count(distinct id_city) as total
                from city s
                where state_fk = ?
                ${whereClause.length > 0 ? 'AND' : ''}
                ${whereClause}
                `;

            const [results] = await this.con.promise().query(query, [state_fk, ...values]);

            return results[0];
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }


    async getStatesActivesByCountry(state_fk) {
        try {
            const query = `
                SELECT 
                    *
                from city c
                where state_fk = ?
                and status_city = 1
                GROUP BY name_city
                `;

            const [results] = await this.con.promise().query(query, [state_fk]);

            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

    async getOneByStateAndNameCity(state_fk ,name_city) {
        try {
            const query = `
                SELECT 
                    *
                from city s
                where state_fk = ?
                and name_city = ?
                `;

            const [results] = await this.con.promise().query(query, [state_fk, name_city]);

            return results;
        } catch (error) {
            console.error("Error en Users Model:", error.message);
            throw new Error("Error en Users Model: " + error.message);
        }
    }

}

export default CityModel