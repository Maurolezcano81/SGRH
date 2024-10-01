import BaseModel from "../../BaseModel.js";
import Connection from "../../../config/connection.js";

class NavigationMenu extends BaseModel{
  constructor(){
    super('navigation_menu', 'id_nm');
    this.db = new Connection();
    this.conn = this.db.createCon();
    this.model = new BaseModel('navigation_menu', 'name_nm');
  }

  async getMenuParentsByIdProfile(id_profile) {
    try {
      const query =
        'select pa_me.id_pm, name_pm from module_parent mp join module m on mp.module_fk = m.id_module join profile_module pm on m.id_module = pm.module_fk join profile p on pm.profile_fk = p.id_profile join parent_menu pa_me on mp.pm_fk = pa_me.id_pm where id_profile = ? group by name_pm order by pa_me.order_pm asc';

      const [results] = await this.conn.promise().query(query, [id_profile]);
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

      const [results] = await this.conn.promise().query(query, [id_profile, id_pm]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }

  async getProfileHome(id_user) {
    try {
      const query =
        'select * from profile_module pm join module m on pm.module_fk = m.id_module join profile p on pm.profile_fk = p.id_profile join user u on p.id_profile = u.profile_fk where u.id_user = ? and m.url_module = "/admin/inicio"';

      const [results] = await this.conn.promise().query(query, [id_user]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }
}


export default NavigationMenu;