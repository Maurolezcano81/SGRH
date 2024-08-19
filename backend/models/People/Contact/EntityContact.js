import { database } from '../../../config/database.js';
import mysql from "mysql2"

class EntityContact {
    constructor(){
        this.connection = mysql.createConnection(database)
    }

    async createEntityContact(entity_contact_data) {
      try {
        
        const {value_ec, entity_fk, contact_fk} = entity_contact_data

        const query = "Insert into entity_contact(value_ec, entity_fk, contact_fk, status_ec, created_at, updated_at) Values(?, ?, ?, 1, now(), now())";

        const [results] = await this.connection.promise().query(query, [value_ec, entity_fk, contact_fk]);

        return results;
      } catch(error) {
        console.error(`Error en modelo de EntityController: `+error);
        throw new Error(`Error al crear el contacto`);
      }
    }
}

export default EntityContact;