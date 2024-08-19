import City from '../../models/Address/City.js';
import State from '../../models/Address/State.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../../middlewares/Validations.js';

const instanceCity = new City();
const instanceState = new State();

export const getCitiesByState = async (req, res) => {
  const { state_fk } = req.body;
  try {
    if (isInputEmpty(state_fk)) {
      throw new Error('Debe completar todos los campos de Domicilio');
    }

    const checkExistState = await instanceState.getStateById(state_fk);
    if (checkExistState.length < 1) {
      return res.status(200).json({
        message: 'Esta provincia no existe',
      });
    }

    const queryResponse = await instanceCity.getCitiesByState(state_fk);

    return res.status(200).json({
      message: 'Ciudades obtenidas correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador: City' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
