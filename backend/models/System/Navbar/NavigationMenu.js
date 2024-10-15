import BaseModel from "../../BaseModel.js";
import Connection from "../../../config/connection.js";

class NavigationMenu extends BaseModel {
  constructor() {
    super('navigation_menu', 'id_nm');
    this.db = new Connection();
    this.conn = this.db.createCon();
    this.model = new BaseModel('navigation_menu', 'name_nm');
  }

  async getMenuParentsByIdProfile(id_profile) {
    try {
      const query =
        `
        select 
        pm.id_pm, 
        pm.name_pm 
        from parent_menu pm 
        join navigation_menu nm on pm.nm_fk = nm.id_nm 
        join profile p on nm.id_nm = p.nm_fk 
        where id_profile = ? 
        group by name_pm order by pm.order_pm asc
`
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

  async getMenuParentsByIdMenu(id_menu) {
    try {
      const query =
        `
        SELECT 
            pa_me.nm_fk,
            pa_me.id_pm, 
            pa_me.name_pm,
            pa_me.order_pm 
        FROM 
            parent_menu pa_me 
        WHERE 
            pa_me.nm_fk = ?
        GROUP BY 
            pa_me.name_pm
        ORDER BY 
            pa_me.order_pm ASC;
        `;

      const [results] = await this.conn.promise().query(query, [id_menu]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }


  async getMenuChildrensByIdParent(id_pm) {
    try {

      const query = `
          SELECT 
              pa_me.id_pm,
              mp.id_mp,
              id_module, 
              name_module, 
              url_module,
              mp.order_mp
          FROM 
              module_parent mp 
          JOIN 
              module m ON mp.module_fk = m.id_module 
          JOIN 
              parent_menu pa_me ON mp.pm_fk = pa_me.id_pm 
          WHERE 
              pa_me.id_pm = ?
          ORDER BY 
              mp.order_mp asc;
      `

      const [results] = await this.conn.promise().query(query, [id_pm]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }


  async getChildrensToAdd(
    id_nm,
    limit = this.defaultLimitPagination,
    offset = this.defaultOffsetPagination,
    orderBy = this.defaultOrderBy,
    order = this.defaultOrderPagination,
    filters = {},
    arrayExcludes = []
  ) {

    const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
    try {
      const excludeClause = arrayExcludes.length > 0
        ? `id_module NOT IN (${arrayExcludes.map(() => '?').join(', ')})`
        : '';

      const query = `
            select 
              id_module, 
              name_module 
            from module m
            ${whereClause.length > 0 || excludeClause ? 'WHERE' : ''}
            ${excludeClause} 
            ${excludeClause && whereClause.length > 0 ? 'AND' : ''}
            ${whereClause}
            GROUP BY id_module, name_module 
            ORDER BY ${orderBy} ${order} 
            LIMIT ? OFFSET ? ;
            `;

      const [results] = await this.conn.promise().query(query, [...arrayExcludes, ...values, limit, offset]);
      return results;

    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }


  async getTotalChildrensToAdd(
    id_nm,
    limit = this.defaultLimitPagination,
    offset = this.defaultOffsetPagination,
    orderBy = this.defaultOrderBy,
    order = this.defaultOrderPagination,
    filters = {},
    arrayExcludes = []
  ) {

    const { whereClause, values } = this.buildWhereClauseNotStarting(filters);
    try {
      const excludeClause = arrayExcludes.length > 0
        ? `id_module NOT IN (${arrayExcludes.map(() => '?').join(', ')})`
        : '';

      const query = `
            select 
              COUNT( m.id_module) as total 
            from module m
            ${whereClause.length > 0 || excludeClause ? 'WHERE' : ''}
            ${excludeClause} 
            ${excludeClause && whereClause.length > 0 ? 'AND' : ''}
            ${whereClause}
            ORDER BY ${orderBy} ${order} 
            `;


      const [results] = await this.conn.promise().query(query, [id_nm, ...arrayExcludes, ...values]);
      return results;

    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }

  async getAllIdModulesInMenu(id_nm) {
    try {

      const query = `
        SELECT 
           id_module
        FROM 
            module m
        join module_parent mp on m.id_module = mp.module_fk 
        join parent_menu pm on mp.pm_fk = pm.id_pm 
        WHERE 
            pm.nm_fk = ?;
      `

      const [results] = await this.conn.promise().query(query, [id_nm]);
      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }

  async getParentMenuByNameAndNavMenuId(name_pm, nm_fk){
    try {

      const query = `
            select * from parent_menu pm 
            where pm.name_pm = ?
            and pm.nm_fk = ?;
      `
      
      const [results] = await this.conn.promise().query(query, [name_pm, nm_fk])

      return results;
    } catch (error) {
      console.error(`Error en modelo de Profile: ` + error);
      throw new Error(`Error al obtener el menu`);
    }
  }

}


export default NavigationMenu;