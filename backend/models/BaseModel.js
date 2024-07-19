import Connection from "../config/connection.js";

class BaseModel {
    constructor(model) {
        this.model = model;
        this.db = new Connection();
        this.con = this.db.createCon();
        //PAGINATION

        // BETWEEN
    }


    
    async getAll() {
        try {
            const query = `SELECT * FROM ${this.model}`;

            const [results] = await this.con.promise().query(query);

            return results;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }

    async getOne(value, field) {
        try {
            const query = `SELECT * FROM ${this.model} where ${field} = ?;`

            const [results] = await this.con.promise().query(query, [value]);

            console.log(results);
            return results
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }


    async deleteOne(value, field){
        try {
            const query = `delete from ${this.model} where ${field} = ?`

            const [results] = await this.con.promise().query(query, [value]);

            return { 
                results: results.affectedRows,
                info: results.message
             };
        } catch (error) {
            console.error(error.message);
            throw new Error("Error en BASECRUD: " + error.message);
        }
    }

    async updateOne(data, field){

        const dataToUpdate = Object.keys(data).map( key => `${key} = "${data[key]}"`).join(', ');

        const query = `UPDATE ${this.model} SET ${dataToUpdate}, updated_at = now() where ${field[0]} = ?`;

        const [results] = await this.con.promise().query(query, [field[1]]);

        return {
            results: results.affectedRows,
            info: results.message
        }
    }

    async createOne(data){
        try {
            
        const fields = Object.keys(data).map((key) => `${key}`).join(", ")
        const placeholders = Object.keys(data).map( (key) => `'${data[key]}'`).join(", ");
        const values = Object.values(data);
        const query = `INSERT INTO ${this.model} (${fields}) VALUES (${placeholders})`;
        const [results] = await this.con.promise().query(query, values);

        console.log(results);
        return {
            lastId: results.insertId,
            results: results.affectedRows,
            info: results.message
        }
        } catch (error) {
            console.error("ERROR EN CREATEONE")
        }

    }
}

export default BaseModel;
