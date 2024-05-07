import Entity from '../models/Entity.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ, isNotDate } from '../middlewares/Validations.js';

const entityInstance = new Entity()

export const createEntity = async (req, res) => {
    const { name, lastname, date_birth, sex, nacionality } = req;
    try {
        if (isInputEmpty(name) || isInputEmpty(lastname) || isInputEmpty(date_birth) || isInputEmpty(sex) || isInputEmpty(nacionality)) {
            return res.status(403).json({
                message: "Debe completar todos los campos"
            })
        }

        if(isNotNumber(sex) || isInputWithWhiteSpaces(sex)){
            return res.status(403).json({
                message: "Ha ocurrido un error al introducir el sexo"
            })
        }

        if(isNotNumber(nacionality) || isInputWithWhiteSpaces(nacionality)){
            return res.status(403).json({
                message: "Ha ocurrido un error al introducir la nacionalidad"
            })
        };

        if(isNotAToZ(name) || isNotAToZ(lastname)){
            return res.status(403).json({
                message: "El nombre y apellido no deben contener caracteres especiales"
            })
        }
        
        if(isNotDate(date_birth)){
            return res.status(403).json({
                message: "Debe introducir una fecha correcta"
            })
        }

        const queryResponse = await entityInstance.createEntity(name, lastname, date_birth, sex, nacionality);
        if(!queryResponse){
            return res.status(403).json({
                message: "Ha ocurrido un error, intentalo nuevamente"
            });
        }

        return queryResponse;
    } catch (error) {
        console.error(error)
        console.error("Controlador")
    }
}
