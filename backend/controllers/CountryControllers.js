import Country from '../models/Country.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ, isNotDate } from '../middlewares/Validations.js';

const instanceCountry = new Country();

export const getCountries = async (req, res) => {

    try {
        const queryResponse = await instanceCountry.getCountries();

        if (!queryResponse) {
            throw new Error("No hay paises registrados")
        };

        return res.status(200).json({
            message: "Listado de paises",
            queryResponse
        })
    } catch (error) {
        console.error("Ha ocurrido un error en controlador de " + error);
        res.status(403).json({
            message: error.message
        });
    }
}

export const getCountry = async (req, res) => {
    const { value } = req.params
    try {
        const queryResponse = await instanceCountry.getCountry(value);

        if (isInputEmpty(value)) {
            throw new Error("Los datos que esta usando para la busqueda son invalidos")
        };

        if (!queryResponse) {
            throw new Error('El pais que esta buscando no existe')
        };
        return res.status(200).json({
            message: 'Pais obtenido correctamente',
            queryResponse
        })
    } catch (error) {
        console.error('Ha ocurrido un error en controlador de Pais' + error);
        res.status(403).json({
            message: error.message
        });
    }
}

export const updateCountry = async (req, res) => {
    const { country_data } = req.body;
    const { id } = req.params;

    const country_data_completed = {
        id,
        ...country_data
    }
    try {

        if (isInputEmpty(id)) {
            throw new Error("Los datos que esta usando para la busqueda son invalidos")
        };

        if (isInputEmpty(country_data_completed.name) || isInputEmpty(country_data_completed.abbreviation) || isInputEmpty(country_data_completed.status)) {
            throw new Error("Debe completar todos los campos")
        };

        const checkExists = await instanceCountry.getCountry(id);

        if (!checkExists) {
            throw new Error("No se puede actualizar el pais, debido a que no existe");
        }

        const queryResponse = await instanceCountry.updateCountry(country_data);

        if (!queryResponse) {
            throw new Error('Ocurrio un error al encontrar el país')
        };
        return res.status(200).json({
            message: 'Pais actualizado correctamente',
            queryResponse
        })
    } catch (error) {
        console.error('Ha ocurrido un error en controlador de pais' + error);
        res.status(403).json({
            message: error.message
        });
    }
}

export const toggleStatusCountry = async (req, res) => {
    const { value } = req.body
    const { id } = req.params
    try {
        const checkExists = await instanceCountry.getCountry(id);

        if (!checkExists) {
            throw new Error("No se puede actualizar el pais, debido a que no existe");
        }

        const queryResponse = await instanceCountry.toggleStatusCountry(id, value);

        if (!queryResponse) {
            throw new Error('Error al cambiar de estado el pais')
        };
        return res.status(200).json({
            message: 'Pais actualizado correctamente',
            queryResponse
        })
    } catch (error) {
        console.error('Ha ocurrido un error en controlador de pais' + error);
        res.status(403).json({
            message: error.message
        });
    }
}

export const deleteCountry = async (req, res) => {
    const { value } = req.params

    try {
        const checkExists = await instanceCountry.getCountry(id);

        if (!checkExists) {
            throw new Error("No se puede actualizar el pais, debido a que no existe");
        }
        const queryResponse = await instanceCountry.deleteCountry(value);

        if (!queryResponse) {
            throw new Error('No se pudo eliminar el pais')
        };
        return res.status(200).json({
            message: 'Pais eliminado correctamente',
            queryResponse
        })
    } catch (error) {
        console.error('Ha ocurrido un error en controlador de Pais' + error);
        res.status(403).json({
            message: error.message
        });
    }
}