import State from '../../models/Address/State.js';
import Country from '../../models/System/Country.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';

const instanceState = new State();
const instanceCountry = new Country();

export const getStatesByCountry = async (req, res) => {
  const { country_fk } = req.body;
  try {
    if (isInputEmpty(country_fk)) {
      throw new Error('Debe completar todos los campos de Domicilio');
    }

    const checkExistCountry = await instanceCountry.getCountry(country_fk);
    if (checkExistCountry.length < 1) {
      return res.status(200).json({
        message: 'Este pais no existe',
      });
    }

    const queryResponse = await instanceState.getStatesByCountry(country_fk);

    return res.status(200).json({
      message: 'Provincias obtenidas correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Error en controlador: State' + error);
    return res.status(403).json({
      message: error.message,
    });
  }
};
