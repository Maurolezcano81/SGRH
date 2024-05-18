import Country from '../models/Country.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ, isNotDate } from '../middlewares/Validations.js';

const instanceCountry = new Country();

export const getCountries = async (req, res) => {
  try {
    const queryResponse = await instanceCountry.getCountries();

    if (queryResponse.length < 1) {
      return res.status(200).json({
        message: 'No hay paises disponibles',
      });
    }

    return res.status(200).json({
      message: 'Listado de paises',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Country' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const getCountry = async (req, res) => {
  const { value_country } = req.body;
  try {
    if (isInputEmpty(value_country)) {
      throw new Error('Los datos que estas utilizando para la busqueda de pais son invalidos');
    }

    const queryResponse = await instanceCountry.getCountry(value_country);

    if (queryResponse.length < 1) {
      throw new Error('El pais no existe');
    }

    return res.status(200).json({
      message: 'Pais obtenido correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Country' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const createCountry = async (req, res) => {
  const { name_country, abbreviation_country } = req.body;
  try {
    if (isInputEmpty(name_country) || isInputEmpty(abbreviation_country)) {
      throw new Error('Debe completar todos los campos');
    }

    if (isNotAToZ(name_country) || isNotAToZ(abbreviation_country)) {
      throw new Error('No estan permitidos los caracteres especiales');
    }

    const checkExistsName = await instanceCountry.getCountry(name_country);
    const checkExistsAbbrev = await instanceCountry.getCountry(abbreviation_country);

    if (checkExistsName && checkExistsName.length > 0) {
      throw new Error('Ya existe un pais con este nombre, ingrese otro');
    }

    if (checkExistsAbbrev && checkExistsAbbrev.length > 0) {
      throw new Error('Ya existe esta abreviacion relacionada a un pais, ingrese otra');
    }

    const queryResponse = await instanceCountry.createCountry(name_country, abbreviation_country);

    if (!queryResponse) {
      throw new Error('Error al crear el país');
    }

    return res.status(200).json({
      message: 'Pais creado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de pais' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateCountry = async (req, res) => {
  const { country_data } = req.body;

  try {
    if (isInputEmpty(country_data.id_country)) {
      throw new Error('Los datos que esta usando para la busqueda son invalidos');
    }

    if (
      isInputEmpty(country_data.name_country) ||
      isInputEmpty(country_data.abbreviation_country) ||
      isInputEmpty(country_data.status_country)
    ) {
      throw new Error('Debe completar todos los campos');
    }

    const checkExists = await instanceCountry.getCountry(country_data.id_country);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el pais, debido a que no existe');
    }


    const queryResponse = await instanceCountry.updateCountry(country_data);
    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el pais');
    }
    return res.status(200).json({
      message: 'Pais actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de pais' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const toggleStatusCountry = async (req, res) => {
  const { status_country, id_country } = req.body;
  try {
    if (isNotNumber(status_country)) {
      throw new Error('Ha ocurrido un error al actualizar el estado del pais, intente reiniciando sitio');
    }

    const checkExists = await instanceCountry.getCountry(id_country);

    if (checkExists.length < 1) {
      throw new Error('No se puede actualizar el pais, debido a que no existe');
    }

    const queryResponse = await instanceCountry.toggleStatusCountry(id_country, status_country);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al actualizar el estado del pais');
    }

    return res.status(200).json({
      message: 'Pais actualizado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de pais' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};

export const deleteCountry = async (req, res) => {
  const { id_country } = req.body;

  try {

    if (isNotNumber(id_country)) {
      throw new Error('Ha ocurrido un error al eliminar el pais, intente reiniciando el sitio');
    }
    
    const queryResponse = await instanceCountry.deleteCountry(id_country);

    if (queryResponse.affectedRows < 1) {
      throw new Error('Error al eliminar el pais');
    }
    
    return res.status(200).json({
      message: 'Pais eliminado correctamente',
      queryResponse,
    });
  } catch (error) {
    console.error('Ha ocurrido un error en controlador de Pais' + error);
    res.status(403).json({
      message: error.message,
    });
  }
};
