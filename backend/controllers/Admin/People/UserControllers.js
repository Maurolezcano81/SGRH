import Employee from '../../../models/Admin/People/Employee.js';
import Entity from '../../../models/Admin/People/Entity.js';
import User from '../../../models/Admin/People/User.js';
import Profile from '../../../models/Auth/Profile.js';

import {
  isInputEmpty,
  isInputWithWhiteSpaces,
  isNotNumber,
  isNotAToZ,
  isNotDate,
} from '../../../middlewares/Validations.js';

import { encryptPwd } from '../../../middlewares/Authorization.js';

const instanceEmployee = new Employee();
const instanceEntity = new Entity();
const instanceUser = new User();
const instanceProfile = new Profile();

export const createUser = async (req, res) => {
  try {
    // DESESTRUCTURACIONES

    const { entity_data, employee_data, user_data, value_profile } = req.body;

    const avatar_url = req.fileUrl;

    // PARSED DATA IN JSON
    const entity_dataInJson = JSON.parse(entity_data);
    const employee_dataInJson = JSON.parse(employee_data);
    const user_dataInJson = JSON.parse(user_data);


    const { name_entity, lastname_entity, date_birth_entity, sex_fk, nacionality_fk } = entity_dataInJson;

    console.log(name_entity);
    const { file_employee, date_entry_employee } = employee_dataInJson;

    const { username_user, pwd_user } = user_dataInJson;

    // DESESTRUCTURACIONES

    // VALIDACIONES ENTIDAD

    if (
      isInputEmpty(name_entity) ||
      isInputEmpty(lastname_entity) ||
      isInputEmpty(date_birth_entity) ||
      isInputEmpty(sex_fk) ||
      isInputEmpty(nacionality_fk)
    ) {
      throw new Error('Debes completar todos los datos de la persona');
    }

    if (isNotDate(date_birth_entity)) {
      throw new Error('La fecha de nacimiento debe ser una fecha valida');
    }

    // VALIDACIONES EMPLEADO
    if (isInputEmpty(file_employee) || isInputEmpty(date_entry_employee)) {
      throw new Error('Debes completar todos los datos del empleado');
    }

    if (isNotDate(date_entry_employee)) {
      throw new Error('La fecha de ingreso del empleado debe ser valida');
    }

    // VALIDACIONES USUARIO

    if (isInputEmpty(username_user) || isInputEmpty(pwd_user) || !avatar_url) {
      throw new Error('Debes completar todos los campos de usuario');
    }

    // COMPROBACIONES SI EXISTEN EN BD

    const checkExistFileEmployee = await instanceEmployee.getEmployee(file_employee);

    if (checkExistFileEmployee.length > 0) {
      throw new Error('El numero de legajo ya existe');
    }

    const checkExistUser = await instanceUser.getUserByUsername(username_user);

    if (checkExistUser.length > 0) {
      throw new Error('Este nombre de usuario ya esta siendo utilizado');
    }

    // INSERTS EN LA BD

    // PERSONA
    const insertEntity = await instanceEntity.createEntity(entity_dataInJson);

    if (!insertEntity) {
      throw new Error('Error al crear usuario, comprueba los datos de la persona');
    }

    const idEntity = insertEntity.insertId;

    // EMPLEADO
    const employee_data_completed = {
      file_employee: file_employee,
      date_entry_employee: date_entry_employee,
      entity_fk: idEntity,
    };

    const insertEmployee = await instanceEmployee.createEmployee(employee_data_completed);

    if (!insertEmployee) {
      throw new Error('Error al crear usuario, comprueba los datos de empleado');
    }
    // USUARIO
    const pwdHashed = await encryptPwd(pwd_user);

    const user_data_completed = {
      username_user: username_user,
      pwd_user: pwdHashed,
      avatar_user: avatar_url,
      entity_fk: idEntity,
      profile_fk: value_profile,
    };

    const insertUser = await instanceUser.createUser(user_data_completed);

    if (!insertUser) {
      throw new Error('Error al crear usuario, comprueba los datos de usuario');
    }

    res.status(200).json({
      message: 'La cuenta del personal ha sido dada de alta satisfactoriamente',
      userId: insertUser.insertId,
    });
  } catch (error) {
    console.error('Error en UserController :' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
