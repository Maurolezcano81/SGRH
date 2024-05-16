import mysql from 'mysql2';
import { database } from '../config/database.js';

class Contact {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getContacts() {
    try {
      const query = 'SELECT id_contact, name_contact FROM contact';
      const [results] = await this.connection.promise().query(query, []);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Contacto: ` + error);
      throw new Error(`Error al obtener el listado de contactos`);
    }
  }

  async getContact(value) {
    try {
      const query = 'SELECT id_contact, name_contact FROM contact where id_contact = ? or name_contact = ?';

      const [results] = await this.connection.promise().query(query, [value, value]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Contacto: ` + error);
      throw new Error(`Error al obtener el tipo de contacto`);
    }
  }

  async createContact(name) {
    try {
      const query = 'INSERT INTO contact(name_contact, status_contact, created_at, updated_at) values(?,1,now(),now())';

      const [results] = await this.connection.promise().query(query, [name]);

      return results;
    } catch (error) {
      console.error(`Error en modelo de Contacto: ` + error);
      throw new Error(`Error al crear el tipo de contacto`);
    }
  }

  async updateContact(id, name, status) {
    try {
      const query = 'UPDATE contact SET name_contact = ?, status_contact = ?, updated_at = now() where id_contact = ?';

      const [results] = await this.connection.promise().query(query, [name, status, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Contacto: ` + error);
      throw new Error(`Error al actualizar el tipo de contacto`);
    }
  }

  async toggleStatusContact(id, status) {
    try {
      const query = 'UPDATE contact SET status_contact = ?, updated_at = now() where id_contact = ?';

      const [results] = await this.connection.promise().query(query, [status, id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Contacto: ` + error);
      throw new Error(`Error al cambiar el estado de tipo de contacto`);
    }
  }

  async deleteContact(id) {
    try {
      const query = 'DELETE from contact where id_contact = ?';

      const [results] = await this.connection.promise().query(query, [id]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Contacto: ` + error);
      throw new Error(`Error al eliminar tipo de contacto`);
    }
  }
}

export default Contact;
