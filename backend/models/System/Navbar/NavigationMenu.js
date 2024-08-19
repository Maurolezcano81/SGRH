import {database} from "../../../config/database.js"
import mysql from "mysql2";

class NavigationMenu{
    constructor(){
        this.connection = mysql.createConnection(database);
    }

    async getNavigationMenus() {
        try {
          const query = 'SELECT * FROM navigation_menu';
    
          const [results] = await this.connection.promise().query(query);
          return results;
        } catch (error) {
          console.error(`Error en modelo de tipo de NavigationMenu: ` + error);
          throw new Error(`Error al obtener los tipos de menues de navegacion`);
        }
      }
    
      async getNavigationMenu(value_nm) {
        try {
          const query = 'SELECT * FROM navigation_menu where id_nm = ? or name_nm = ?';
    
          const [results] = await this.connection.promise().query(query, [value_nm, value_nm]);
          return results;
        } catch (error) {
          console.error(`Error en modelo de tipo de menues de navegacion: ` + error);
          throw new Error(`Error al obtener el tipo de menu de navegacion`);
        }
      }
    
      async createNavigationMenu(name_nm) {
        try {
          const query =
            'INSERT INTO navigation_menu(name_nm, status_nm, created_at, updated_at) values(?, 1, now(), now())';
    
          const [results] = await this.connection.promise().query(query, [name_nm]);
          return results;
        } catch (error) {
          console.error(`Error en modelo de tipo de menues de navegacion: ` + error);
          throw new Error(`Error al crear el tipo de tipo de menu de navegacion`);
        }
      }
    
      async updateNavigationMenu(id_nm, name_nm, status_nm) {
        try {
          const query = 'UPDATE navigation_menu SET name_nm = ?, status_nm = ?, updated_at = now() where id_nm = ?';
    
          const [results] = await this.connection.promise().query(query, [name_nm, status_nm, id_nm]);
          return results;
        } catch (error) {
          console.error(`Error en modelo de tipo de menues de navegacion: ` + error);
          throw new Error(`Error al actualizar datos del tipo de tipo de menu de navegacion`);
        }
      }
    
      async toggleStatusNavigationMenu(id_nm, status_nm) {
        try {
          const query = 'UPDATE navigation_menu SET status_nm = ?, updated_at = now() where id_nm = ?';
    
          const [results] = await this.connection.promise().query(query, [status_nm, id_nm]);
          return results;
        } catch (error) {
          console.error(`Error en modelo de tipo de menu de navegacion: ` + error);
          throw new Error(`Error al actualizar el estado del tipo de tipo de menu de navegacion`);
        }
      }
    
      async deleteNavigationMenu(value_nm) {
        try {
          const query = 'DELETE from navigation_menu where id_nm = ? or name_nm = ?';
    
          const [results] = await this.connection.promise().query(query, [value_nm, value_nm]);
          return results;
        } catch (error) {
          console.error(`Error en modelo de tipo de menu de navegacion: ` + error);
          throw new Error(`Error al eliminar este registro, debido a que esta relacionado con datos importantes`);
        }
      }
}

export default NavigationMenu;