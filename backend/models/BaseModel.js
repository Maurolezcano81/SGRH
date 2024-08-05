import Connection from "../config/connection.js";

class BaseModel {
    constructor(model) {
        this.model = model;
        this.db = new Connection();
        this.con = this.db.createCon();
    }

    async getAll(){
        try {
            const query = `SELECT * FROM ${this.model}`;
            const [results] = await this.con.promise().query(query, []);

            return results.length;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }

    async getAllPagination(limit = 10, offset = 0, orderBy, order = 'ASC') {
        try {
            const query = `SELECT * FROM ${this.model} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
            const [results] = await this.con.promise().query(query, [limit, offset]);

            return results;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }

    async getBetween(field, startValue, endValue) {
        try {
            const query = `SELECT * FROM ${this.model} WHERE ${field} BETWEEN ? AND ?`;

            const [results] = await this.con.promise().query(query, [startValue, endValue]);

            return results;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }

    async getOne(value, field) {
        try {
            const query = `SELECT * FROM ${this.model} WHERE ${field} = ?;`;

            const [results] = await this.con.promise().query(query, [value]);

            console.log(results);
            return results;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }

    async deleteOne(value, field) {
        try {
            const query = `DELETE FROM ${this.model} WHERE ${field} = ?`;

            const [results] = await this.con.promise().query(query, [value]);

            return {
                results: results.affectedRows,
                info: results.message,
            };
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }

    async updateOne(data, field) {
        const dataToUpdate = Object.keys(data).map((key) => `${key} = ?`).join(', ');

        const query = `UPDATE ${this.model} SET ${dataToUpdate}, updated_at = now() WHERE ${field[0]} = ?`;

        const values = [...Object.values(data), field[1]];

        const [results] = await this.con.promise().query(query, values);

        return {
            results: results.affectedRows,
            info: results.message,
        };
    }

    async createOne(data) {
        try {
            const fields = Object.keys(data).join(", ");
            const placeholders = Object.keys(data).map(() => '?').join(", ");
            const values = Object.values(data);
            const query = `INSERT INTO ${this.model} (${fields}) VALUES (${placeholders})`;
            const [results] = await this.con.promise().query(query, values);

            console.log(results);
            return {
                lastId: results.insertId,
                results: results.affectedRows,
                info: results.message,
            };
        } catch (error) {
            console.error("ERROR EN CREATEONE");
            throw new Error("Error en CREATEONE: " + error.message);
        }
    }
}

export default BaseModel;
