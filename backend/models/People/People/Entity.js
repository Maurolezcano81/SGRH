import BaseModel from "../../BaseModel.js";
import Connection from "../../../config/connection.js";

class EntityModel extends BaseModel {
    constructor() {
        super('entity', 'id_entity');
        this.db = new Connection();
        this.conn = this.db.createCon();
    }

    async getDataPersonal(fk_entity) {
        try {
            const query = "SELECT id_entity, name_entity, lastname_entity, name_nacionality, id_nacionality, sex_fk, name_sex, TIMESTAMPDIFF(YEAR, date_birth_entity, CURDATE()) as edad, date_birth_entity from entity e join nacionality n on e.nacionality_fk = n.id_nacionality join sex s on e.sex_fk = s.id_sex where e.id_entity = ?";

            const [results] = await this.conn.promise().query(query, [fk_entity]);

            return results;
        } catch (error) {
            console.error(`Error en modelo de Entity: ` + error);
            throw new Error(`Error al obtener los datos de la persona`);
        }
    }

    async getEntityOccupation(fk_entity) {

        try {
            const query = "SELECT id_entity, id_occupation, id_edo, name_occupation, salary_occupation FROM occupation join entity_department_occupation edo on occupation_fk = id_occupation   join entity on id_entity = entity_fk where edo.entity_fk = ?";

            const [results] = await this.conn.promise().query(query, [fk_entity]);

            return results;
        } catch (error) {
            console.error(`Error en modelo de Entity: ` + error);
            throw new Error(`Error al obtener los datos de la persona`);
        }
    }

    async getEntityDepartment(fk_entity) {
        try {
            const query = "SELECT id_entity, id_department, id_edo, name_department FROM department join entity_department_occupation edo on department_fk = id_department  join entity on id_entity = entity_fk where edo.entity_fk = ?";

            const [results] = await this.conn.promise().query(query, [fk_entity]);

            return results;
        } catch (error) {
            console.error(`Error en modelo de Entidad: ` + error);
            throw new Error(`Error al obtener los datos de la persona`);
        }
    }

    async getEntityDocuments(fk_entity) {
        try {
            const query = "SELECT id_entity, id_document, id_ed, name_document, value_ed from entity e join entity_document ed on e.id_entity = ed.entity_fk join document d on ed.document_fk = d.id_document where id_entity = ?";

            const [results] = await this.conn.promise().query(query, [fk_entity]);

            return results;
        } catch (error) {
            console.error(`Error en modelo de Entidad: ` + error);
            throw new Error(`Error al obtener los datos de la persona`);
        }
    }

    async getEntityContacts(fk_entity) {
        try {
            const query = "SELECT id_entity, id_contact, id_ec, name_contact, value_ec from entity e join entity_contact ec on e.id_entity = ec.entity_fk join contact c on ec.contact_fk = c.id_contact where id_entity = ?";

            const [results] = await this.conn.promise().query(query, [fk_entity]);

            return results;
        } catch (error) {
            console.error(`Error en modelo de Entidad: ` + error);
            throw new Error(`Error al obtener los datos de la persona`);
        }
    }

    async getEntityAddress(fk_entity) {
        try {
            const query = "SELECT id_address, id_state, id_country, id_city, description_address, name_city, name_state, name_country from address a join city c on a.city_fk = c.id_city join state s on c.state_fk = s.id_state join country co on s.country_fk = co.id_country";
            const [results] = await this.conn.promise().query(query, [fk_entity]);

            return results;
        } catch (error) {
            console.error(`Error en modelo de Entidad: ` + error);
            throw new Error(`Error al obtener los datos de la persona`);
        }
    }

    async getEntityEmployee(fk_entity) {
        try {
            const query = `
                    select id_employee, 
                        file_employee, 
                        date_entry_employee, 
                        TIMESTAMPDIFF(YEAR, date_entry_employee, CURDATE()) as antiguedad,
                        name_tse,
                        status_employee 
                        FROM employee e 
                        join entity en on e.entity_fk = en.id_entity
                        join type_status_employee tse on e.tse_fk = tse.id_tse
                        where id_entity = ?;
             `;
            const [results] = await this.conn.promise().query(query, [fk_entity]);

            return results;
        } catch (error) {
            console.error(`Error en modelo de Entidad: ` + error);
            throw new Error(`Error al obtener los datos de la persona`);
        }
    }

    async getDataBasicEmployeeByIdUser(id_user) {
        try {
            const query = `
                SELECT 
                    name_entity,
                    lastname_entity,
                    name_department,
                    name_occupation,
                    avatar_user
                    from user u
                join entity e on u.entity_fk = e.id_entity 
                join entity_department_occupation edo on edo.entity_fk = e.id_entity 
                join department d on edo.department_fk = d.id_department 
                join occupation o on edo.occupation_fk = o.id_occupation 
                    where id_user = ?
                group by name_entity, lastname_entity, avatar_user;
        `;

            const [results] = await this.con.promise().query(query, [id_user]);
            return results;
        } catch (error) {
            console.error("Error en getAll:", error.message);
            throw new Error("Error en getAll: " + error.message);
        }
    }
}

export default EntityModel;