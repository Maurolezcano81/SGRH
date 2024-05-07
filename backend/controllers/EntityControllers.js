import Entity from '../models/Entity.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ, isNotDate } from '../middlewares/Validations.js';

const entityInstance = new Entity()

export const createEntity = async (entity_data) => {
    const { name, lastname, date_birth, sex, nacionality } = entity_data;
    try {
        if (isInputEmpty(name) || isInputEmpty(lastname) || isInputEmpty(date_birth) || isInputEmpty(sex) || isInputEmpty(nacionality)) {
            throw new Error("Debe completar todos los campos");
        }

        if(isNotNumber(sex) || isInputWithWhiteSpaces(sex)){
            throw new Error("Ha ocurrido un error al introducir el sexo");
        }

        if(isNotNumber(nacionality) || isInputWithWhiteSpaces(nacionality)){
            throw new Error("Ha ocurrido un error al introducir la nacionalidad");
        };

        if(isNotAToZ(name) || isNotAToZ(lastname)){
            throw new Error("El nombre y apellido no deben contener caracteres especiales");
        }
        
        if(isNotDate(date_birth)){
            throw new Error("Debe introducir una fecha correcta");
        }

        const queryResponse = await entityInstance.createEntity(name, lastname, date_birth, sex, nacionality);
        if(!queryResponse){
            throw new Error("Ha ocurrido un error, intentalo nuevamente");
        }

        return queryResponse;
    } catch (error) {
        throw new Error(error.message);
    }
};