import { database } from '../../config/database.js';
import mysql from 'mysql2';

class Profile {
  constructor() {
    this.connection = mysql.createConnection(database);
  }

  async getProfile(value_profile) {
    try {
      const query = 'Select * from profile where id_profile = ? or name_profile = ?';

      const [results] = await this.connection.promise().query(query, [value_profile, value_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el perfil`);
    }
  }

  async getProfiles() {
    try {
      const query = 'SELECT * FROM profile';

      const [results] = await this.connection.promise().query(query);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el listado tipo de perfiles`);
    }
  }

  async createProfile(name_profile) {
    try {
      const query =
        'INSERT INTO profile(name_profile, status_profile, created_at, updated_at) values(?, 1, now(), now())';

      const [results] = await this.connection.promise().query(query, [name_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al crear el tipo de perfil`);
    }
  }

  async updateProfile(id_profile, name_profile, status_profile) {
    try {
      const query = 'UPDATE profile SET name_profile = ?, status_profile = ?, updated_at = now() where id_profile = ?';

      const [results] = await this.connection.promise().query(query, [name_profile, status_profile, id_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al actualizar el tipo de perfil`);
    }
  }

  async toggleStatusProfile(id_profile, status_profile) {
    try {
      const query = 'UPDATE profile SET status_profile = ?, updated_at = now() where id_profile = ?';

      const [results] = await this.connection.promise().query(query, [status_profile, id_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al actualizar el estado del tipo de perfil`);
    }
  }

  async deleteProfile(value_profile) {
    try {
      const query = 'DELETE from profile where id_profile = ? or name_profile = ?';

      const [results] = await this.connection.promise().query(query, [value_profile, value_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al eliminar el tipo de perfil`);
    }
  }

  async getMenuParentsByIdProfile(id_profile) {
    try {
      const query =
        'select pa_me.id_pm, name_pm from module_parent mp join module m on mp.module_fk = m.id_module join profile_module pm on m.id_module = pm.module_fk join profile p on pm.profile_fk = p.id_profile join parent_menu pa_me on mp.pm_fk = pa_me.id_pm where id_profile = ? group by name_pm order by pa_me.order_pm asc';

      const [results] = await this.connection.promise().query(query, [id_profile]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }

  async getMenuChildrensByIdProfileAndIdParent(id_profile, id_pm) {
    try {
      const query =
        'select id_module, name_module, url_module  from module_parent mp join module m on mp.module_fk = m.id_module join profile_module pm on m.id_module = pm.module_fk join profile p on pm.profile_fk = p.id_profile join parent_menu pa_me on mp.pm_fk = pa_me.id_pm where id_profile = ? and pa_me.id_pm = ? order by mp.order_mp asc';

      const [results] = await this.connection.promise().query(query, [id_profile, id_pm]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }
}

export default Profile;
