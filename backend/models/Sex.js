import mysql from 'mysql2';
import { database } from '../config/database.js';

class Sex {
    constructor() {
        this.connection = mysql.createConnection(database);
    }

    async createSex(name) {
        try {
            const query = "INSERT INTO sex(id_sex,name_sex, status_sex,created_at,updated_at) VALUES(?, 1, now(),now())";

            const [results] = await this.connection.promise().query(query, [name]);

            return results[0];
        } catch (error) {
            console.error("Error en Sexo: " + error);
            throw new Error("Error al crear el sexo, intentelo nuevamente");
        }
    }

    async getSex(value) {
        try {
            const query = "SELECT id_sex, name_sex from sex where id_sex = ? or name_sex = ?";

            const [results] = await this.connection.promise().query(query, [value, value]);

            return results;
        } catch (error) {
            console.error("Error en Sexo: " + error);
            throw new Error("Error al consultar sexo");
        }
    }

    async getSexs() {
        try {
            const query = "SELECT id_sex, name_sex, status_sex FROM sex";

            const [results] = await this.connection.promise().query(query);
            console.log(results);
            return results
        } catch (error) {
            console.error("Error en sexo: " + error)
            throw new Error("Error al consultar listado de sexo");
        }
    }

    async updateSex(id, name, status) {
        try {
            const query = "UPDATE sex SET name_sex = ?, status_sex = ?, updated_at = now() where id_sex = ?"

            const [results] = await this.connection.promise().query(query, [name, status, id]);

            return results;
        } catch (error) {
            console.error("Error en sexo: " + error)
            throw new Error("Error al actualizar sexo");
        }
    }

    async toggleStatusSex(id, value){
        try{
            const query = "UPDATE sex SET status_sex = ? where id_sex = ?";

            const [results] = await this.connection.promise().query(query, [value,id]);
            return results;
        }  catch(error){
            console.error("Error en sexo: "+ error)
            throw new Error("Error al actualizar estado de sexo");
        }
    }

    async deleteSex(id){
        try{
            const query = "DELETE from Sex where id_sex = ?"

            const [results] = await this.connection.promise().query(query, [id]);
            
            return results;
        } catch(error){
            console.error("Error en sexo: "+ error)
            throw new Error("Error al actualizar estado de sexo");
        }
    }
}

export default Sex;