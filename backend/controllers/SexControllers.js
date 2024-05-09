import Sex from "../models/Sex.js";
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from "../middlewares/Validations.js"

const sexInstance = new Sex();
export const createSex = async (req, res) => {
    const { name } = req.body;
    try {
        const checkExists = await sexInstance.getSex(name);
        if (checkExists) throw new Error("Tipo de sexo ya existente");


        if (isInputEmpty(name)) throw new Error("Debes completar todos los campos");
        if (isNotAToZ(name)) throw new Error("El sexo no debe contener caracteres especiales");
        if (isInputWithWhiteSpaces(name)) throw new Error("El sexo no debe contener espacios en blanco");

        const queryResponse = await sexInstance.createSex(name);

        if (queryResponse) throw new Error("Error al crear sexo, intentelo nuevamente");

        return res.status(200).json({
            message: "Sexo creado exitosamente",
            queryResponse
        })
    } catch (error) {
        console.error("Error en controlador de sexo: " + error)
        return res.status(403).json({
            message: error.message
        })
    }
}

export const getSex = async (req, res) => {
    const { id } = req.params;
    try {
        if (isNotNumber(id)) throw new Error("No se pudo obtener el sexo");

        const queryResponse = await sexInstance.getSex(id);
        if (!queryResponse) throw new Error("Error al obtener el sexo")

        return res.status(200).json({
            queryResponse
        })
    } catch (error) {
        console.error("Error en controlador de sexo: " + error)
        return res.status(403).json({
            message: error.message
        })
    }
}

export const getSexs = async (req, res) => {
    try {
        const queryResponse = await sexInstance.getSexs();

        if (!queryResponse) throw new Error("Error al obtener listados de sexo");

        return res.status(200).json({
            queryResponse
        });
    } catch (error) {
        console.error("Error en controlador de sexo: " + error)
        return res.status(403).json({
            message: error.message
        })
    }
}

export const updateSex = async (req, res) => {
    const { name, status } = req.body;
    const { id } = req.params;
    try {

        if (isInputEmpty(name)) throw new Error("Debes completar todos los campos");
        if (isNotAToZ(name)) throw new Error("El sexo no debe contener caracteres especiales");
        if (isInputWithWhiteSpaces(name)) throw new Error("El sexo no debe contener espacios en blanco");

        if (isNotNumber(id)) throw new Error("Los datos del sexo son invalidos");

        if (isNotNumber(status)) throw new Error("Los datos de estado del sexo son invalidos");

        const responseQuery = await sexInstance.updateSex(id, name, status);

        if (!responseQuery) throw new Error("Error al actualizar datos del sexo");

        return res.status(200).json({
            message: "Campo actualizado correctamente",
            responseQuery
        })

    } catch (error) {
        console.error("Error en controlador de sexo: " + error)
        return res.status(403).json({
            message: error.message
        })
    }
}

export const toggleStatusSex = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        if (isNotNumber(id)) throw new Error("Los datos del sexo son invalidos");

        if (isNotNumber(status)) throw new Error("Los datos de estado del sexo son invalidos");

        const responseQuery = await sexInstance.toggleStatusSex(id, status);

        if (!responseQuery) throw new Error("Error al cambiar estado de sexo");

        return res.status(200).json({
            message: "Estado de tipo de sexo cambiado exitosamente"
        })
    } catch (error) {
        console.error("Error en controlador de sexo: " + error)
        return res.status(403).json({
            message: error.message
        })
    }
}

export const deleteSex = async (req, res) => {
    const { id } = req.params;
    try {
        if (isNotNumber(id)) throw new Error("Los datos del sexo son invalidos");

        const responseQuery = await sexInstance.deleteSex(id);

        if(!responseQuery) throw new Error("Error al eliminar sexo");

        return res.status(200).json({
            message: "Tipo de sexo eliminado exitosamente"
        });
        
    } catch (error) {
        console.error("Error en controlador de sexo: " + error)
        return res.status(403).json({
            message: Error
        })
    }
}