import Connection from '../config/connection.js'

class BaseModel {
    constructor(model) {
        this.model = model;
        this.db = new Connection();
        this.con = this.db.createCon();
        this.defaultLimitPagination = 10;
        this.defaultOffsetPagination = 0;
        this.defaultOrderPagination = 'ASC';
    }

    async getAll() {
        try {
            const query = `SELECT * FROM ${this.model}`;
            const [results] = await this.con.promise().query(query);
            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }
    }

    async getAllPagination(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = 'id', order = this.defaultOrderPagination) {
        try {
            const query = `SELECT * FROM ${this.model} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
            const [results] = await this.con.promise().query(query, [limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en getAllPagination:", error.message);
            throw new Error("Error en getAllPagination: " + error.message);
        }
    }

    async getAllPaginationWhere(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = 'id', order = this.defaultOrderPagination, filters = {}) {
        try {
            const whereClause = this.buildWhereClause(filters);
            const query = `SELECT * FROM ${this.model} ${whereClause} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
            const [results] = await this.con.promise().query(query, [...Object.values(filters), limit, offset]);
            return results;
        } catch (error) {
            console.error("Error en getAllPaginationWhere:", error.message);
            throw new Error("Error en getAllPaginationWhere: " + error.message);
        }
    }

    async getBetween(field, startValue, endValue) {
        try {
            const query = `SELECT * FROM ${this.model} WHERE ${field} BETWEEN ? AND ?`;
            const [results] = await this.con.promise().query(query, [startValue, endValue]);
            return results;
        } catch (error) {
            console.error("Error en getBetween:", error.message);
            throw new Error("Error en getBetween: " + error.message);
        }
    }

    async getOne(value, field) {
        try {
            const query = `SELECT * FROM ${this.model} WHERE ${field} = ?`;
            const [results] = await this.con.promise().query(query, [value]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error("Error en getOne:", error.message);
            throw new Error("Error en getOne: " + error.message);
        }
    }

    async deleteOne(value, field) {
        try {
            const query = `DELETE FROM ${this.model} WHERE ${field} = ?`;
            const [results] = await this.con.promise().query(query, [value]);
            return {
                affectedRows: results.affectedRows,
                message: results.message
            };
        } catch (error) {
            console.error("Error en deleteOne:", error.message);
            throw new Error("Error en deleteOne: " + error.message);
        }
    }

    async updateOne(data, field) {
        try {
            const dataToUpdate = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const query = `UPDATE ${this.model} SET ${dataToUpdate}, updated_at = NOW() WHERE ${field[0]} = ?`;
            const values = [...Object.values(data), field[1]];
            const [results] = await this.con.promise().query(query, values);
            return {
                affectedRows: results.affectedRows,
                message: results.message
            };
        } catch (error) {
            console.error("Error en updateOne:", error.message);
            throw new Error("Error en updateOne: " + error.message);
        }
    }

    async createOne(data) {
        try {
            const fields = Object.keys(data).join(", ");
            const placeholders = Object.keys(data).map(() => '?').join(", ");
            const values = Object.values(data);
            const query = `INSERT INTO ${this.model} (${fields}) VALUES (${placeholders})`;
            const [results] = await this.con.promise().query(query, values);
            return {
                lastId: results.insertId,
                affectedRows: results.affectedRows,
                message: results.message
            };
        } catch (error) {
            console.error("Error en createOne:", error.message);
            throw new Error("Error en createOne: " + error.message);
        }
    }

    buildWhereClause(filters) {
        const keys = Object.keys(filters);
        if (keys.length === 0) return '';
        const conditions = keys.map(key => `${key} = ?`).join(' AND ');
        return `WHERE ${conditions}`;
    }
}

export default BaseModel;