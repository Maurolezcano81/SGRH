import mysql from 'mysql2';
import { database } from '../config/database.js';

class Country {
    contructor() {
        this.connection = mysql.createConnection(database);
    }

    async getCountries() {
        try {
            const query = "SELECT * FROM country";

            const [results] = await this.connection.promise().query(query);
            return results;
        } catch (error) {
            console.error(`Error en modelo de Pais: ` + error);
            throw new Error(`Error al obtener listado de paises`);
        }
    }

    async getCountry(value) {
        try {
            const query = "SELECT name_country, abbreviation_country, status_country from country where id_country = ? or name_country = ? or abbreviation_country = ? ";

            const [results] = await this.connection.promise().query(query, [value, value, value]);
            return results[0];
        } catch (error) {
            console.error(`Error en modelo de Pais: ` + error);
            throw new Error(`Error al obtener el país`);
        }
    }

    async updateCountry(country_data) {
        try {
            const { id, name, abbreviation, status } = { country_data }
            const query = 'UPDATE country SET name_country = ?, SET abbreviation_country = ?, status_country = ?, updated_at = now() where id_country = ?';

            const [results] = await this.connection.promise().query(query, [name, abbreviation, status, id]);
            return results[0];
        } catch (error) {
            console.error(`Error en modelo de Pais: ` + error);
            throw new Error(`Error al actualizar el país`);
        }
    }

    async toggleStatusCountry(id, value) {
      try {
        const query = "UPDATE country SET status_country = ?, updated_at = now() where id_country = ?";
    
        const [results] = await this.connection.promise().query(query, [value, id]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de Pais: `+error);
        throw new Error(`Error al cambiar el estado del país`);
      }
    }

    async deleteCountry(value) {
      try {
        const query = "DELETE FROM country where id_country = ? or name_country = ? or abbreviation_country =?";
    
        const [results] = await this.connection.promise().query(query, [value, value, value]);
        return results;
      } catch(error) {
        console.error(`Error en modelo de Pais: `+error);
        throw new Error(`Error al eliminar el país`);
      }
    }
}

export default Country;