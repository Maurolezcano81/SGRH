import Connection from '../config/connection.js'

class BaseModel {
    constructor(model, defaultOrderBy) {
        this.model = model;
        this.db = new Connection();
        this.con = this.db.createCon();
        this.defaultLimitPagination = 10;
        this.defaultOffsetPagination = 0;
        this.defaultOrderPagination = 'ASC';
        this.defaultOrderBy = defaultOrderBy
    }


    async getAllPaginationWhere(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
                SELECT 
                *
                FROM ${this.model}
                ${whereClause}
                ORDER BY ${order} ${orderBy} 
                LIMIT ? OFFSET ?
                `
            const [results] = await this.con.promise().query(query, [...values, limit, offset]);

            return results;
        } catch (error) {
            console.error("Error en getAllPaginationWhere:", error.message);
            throw new Error("Error en getAllPaginationWhere: " + error.message);
        }
    }

    async getTotalResultsAllPaginationWhere(field_to_count, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClause(filters);
            const query = `
            SELECT 
            count(DISTINCT ${field_to_count}) as 'total' 
            FROM ${this.model} 
                ${whereClause}
                
                `

            const [results] = await this.con.promise().query(query, [...values]);
            return results;
        } catch (error) {
            console.error("Error en getAllPaginationWhere:", error.message);
            throw new Error("Error en getAllPaginationWhere: " + error.message);
        }
    }

    async getOne(value, field) {
        try {
            const query = `SELECT * FROM ${this.model} WHERE ${field} = ?`;
            const [results] = await this.con.promise().query(query, [value]);
            return results
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
        const whereClauses = [];
        const values = [];

        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                if (typeof value === 'string') {
                    whereClauses.push(`${key} LIKE ?`);
                    values.push(`%${value}%`);
                } else {
                    whereClauses.push(`${key} = ?`);
                    values.push(value);
                }
            }
        }

        const whereClause = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';
        return { whereClause, values };
    }

    buildWhereClauseNotStarting(filters) {
        const whereClauses = [];
        const values = [];

        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                if (typeof value === 'string') {
                    whereClauses.push(`${key} LIKE ?`);
                    values.push(`%${value}%`);
                } else {
                    whereClauses.push(`${key} = ?`);
                    values.push(value);
                }
            }
        }

        const whereClause = whereClauses.length ? whereClauses.join(' AND ') : '';
        return { whereClause, values };
    }

    async testConnection() {
        try {
            await this.con.promise().query('SELECT 1');
            console.log('Conexión a la base de datos exitosa');
        } catch (error) {
            console.error('Error en la conexión a la base de datos:', error.message);
            throw new Error('Error en la conexión a la base de datos: ' + error.message);
        }
    }

    async getAllPaginationWhereFilteredActives(field_status, filters = {}) {
        try {
            const { whereClause, values } = this.buildWhereClauseNotStarting(filters);

            const query = `SELECT 
            * 
            FROM ${this.model} 
            WHERE ${field_status} = 1 ${whereClause.length > 0 ? 'AND' : ''}
            ${whereClause} 
            `;

            const [results] = await this.con.promise().query(query, [...values]);
            return results;
        } catch (error) {
            console.error("Error en getAllPaginationWhere:", error.message);
            throw new Error("Error en getAllPaginationWhere: " + error.message);
        }
    }

    // async getAll() {
    //     try {
    //         const query = `SELECT * FROM ${this.model}`;
    //         const [results] = await this.con.promise().query(query);
    //         return results;
    //     } catch (error) {
    //         console.error("Error en getAll:", error.message);
    //         throw new Error("Error en getAll: " + error.message);
    //     }
    // }


    // async getTotalResults(field) {
    //     try {
    //         const query = `SELECT COUNT(${field}) as total FROM ${this.model}`;
    //         const [results] = await this.con.promise().query(query);
    //         return results;
    //     } catch (error) {
    //         console.error("Error en getAll:", error.message);
    //         throw new Error("Error en getAll: " + error.message);
    //     }
    // }



    // async getTotalResultsExcludes(field, excludeArray) {
    //     try {
    //         const excludeClause = excludeArray.length > 0
    //             ? `WHERE ${field} NOT IN (${excludeArray.map(() => '?').join(', ')})`
    //             : '';

    //         const query = `SELECT COUNT(${field}) as total FROM ${this.model} ${excludeClause};`;

    //         const [results] = await this.con.promise().query(query, excludeArray);
    //         return results;
    //     } catch (error) {
    //         console.error("Error en getTotalResultsExcludes:", error.message);
    //         throw new Error("Error en getTotalResultsExcludes: " + error.message);
    //     }
    // }

    // async getAllPagination(limit = this.defaultLimitPagination, offset = this.defaultOffsetPagination, orderBy = this.defaultOrderBy, order = this.defaultOrderPagination) {
    //     try {
    //         const query = `SELECT * FROM ${this.model} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
    //         const [results] = await this.con.promise().query(query, [limit, offset]);
    //         return results;
    //     } catch (error) {
    //         console.error("Error en getAllPagination:", error.message);
    //         throw new Error("Error en getAllPagination: " + error.message);
    //     }
    // }


    // async getBetween(field, startValue, endValue) {
    //     try {
    //         const query = `SELECT * FROM ${this.model} WHERE ${field} BETWEEN ? AND ?`;
    //         const [results] = await this.con.promise().query(query, [startValue, endValue]);
    //         return results;
    //     } catch (error) {
    //         console.error("Error en getBetween:", error.message);
    //         throw new Error("Error en getBetween: " + error.message);
    //     }
    // }
}

export default BaseModel;