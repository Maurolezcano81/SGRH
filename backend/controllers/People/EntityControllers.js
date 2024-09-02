import { isInputEmpty, isNotDate, isNotAToZ, isNotNumber } from '../../middlewares/Validations.js';
import EntityModel from "../../models/People/People/Entity.js";

class EntityController {
    constructor() {
        this.model = new EntityModel();
        this.nameFieldId = 'id_entity';
        this.nameFieldToSearch = 'name_entity';
    }

    async updateName(req, res) {
        const { id_entity, name_entity } = req.body;

        if(isNotNumber(id_entity)){
            return res.status(403).json({
                message: "Los datos de la persona a actualizar son incorrectos, intente nuevamente actualizando la pagina"
            })
        }

        if (isInputEmpty(name_entity)) {
            return res.status(403).json({
                message: "Debe completar todos los campos"
            })
        }

        if (isNotAToZ(name_entity)) {
            return res.status(403).json({
                message: "No se permiten caracteres especiales"
            })
        }

        const update = await this.model.updateOne({ id_entity: id_entity, name_entity: name_entity }, [this.nameFieldId, id_entity]);

        if (update.affectedRows < 1) {
            return res.status(403).json({
                message: "No se ha podido actualizar"
            })
        }

        return res.status(200).json({
            message: "Nombre actualizado correctamente"
        })
    }

    async updateLastName(req, res) {
        const { id_entity, lastname_entity } = req.body;

        if(isNotNumber(id_entity)){
            return res.status(403).json({
                message: "Los datos de la persona a actualizar son incorrectos, intente nuevamente actualizando la pagina"
            })
        }

        if (isInputEmpty(lastname_entity)) {
            return res.status(403).json({
                message: "Debe completar todos los campos"
            })
        }

        if (isNotAToZ(lastname_entity)) {
            return res.status(403).json({
                message: "No se permiten caracteres especiales"
            })
        }

        const update = await this.model.updateOne({ id_entity: id_entity, lastname_entity: lastname_entity }, [this.nameFieldId, id_entity]);

        if (update.affectedRows < 1) {

            return res.status(403).json({
                message: "No se ha podido actualizar"
            })
        }

        return res.status(200).json({
            message: "Nombre actualizado correctamente"
        })
    }

    async updateDateBirth(req, res) {
        const { id_entity, date_birth_entity } = req.body;

        if(isNotNumber(id_entity)){
            return res.status(403).json({
                message: "Los datos de la persona a actualizar son incorrectos, intente nuevamente actualizando la pagina"
            })
        }

        if (isInputEmpty(date_birth_entity)) {
            return res.status(403).json({
                message: "Debe completar todos los campos"
            })
        }

        if (isNotDate(date_birth_entity)) {
            return res.status(403).json({
                message: "Debe incluir una fecha valida"
            })
        }

        const update = await this.model.updateOne({ id_entity: id_entity, date_birth_entity: date_birth_entity }, [this.nameFieldId, id_entity]);

        if (update.affectedRows < 1) {
            return res.status(403).json({
                message: "No se ha podido actualizar"
            })
        }

        return res.status(200).json({
            message: "Nombre actualizado correctamente"
        })
    }

    async updateNacionality(req, res) {
        const { id_entity, nacionality_fk } = req.body;

        if(isNotNumber(nacionality_fk)){
            return res.status(403).json({
                message: "Los datos de la nacionalidad son incorrectos, intente nuevamente actualizando la pagina"
            })
        }

        if(isNotNumber(id_entity)){
            return res.status(403).json({
                message: "Los datos de la persona a actualizar son incorrectos, intente nuevamente actualizando la pagina"
            })
        }

        const update = await this.model.updateOne({ id_entity: id_entity, nacionality_fk: nacionality_fk }, [this.nameFieldId, id_entity]);

        if (update.affectedRows < 1) {
            return res.status(403).json({
                message: "No se ha podido actualizar"
            })
        }

        return res.status(200).json({
            message: "Nombre actualizado correctamente"
        })
    }

    async updateSex(req, res) {
        const { id_entity, sex_fk } = req.body;

        if(isNotNumber(sex_fk)){
            return res.status(403).json({
                message: "Los datos del sexo son incorrectos, intente nuevamente actualizando la pagina"
            })
        }

        if(isNotNumber(id_entity)){
            return res.status(403).json({
                message: "Los datos de la persona a actualizar son incorrectos, intente nuevamente actualizando la pagina"
            })
        }

        const update = await this.model.updateOne({ id_entity: id_entity, sex_fk: sex_fk }, [this.nameFieldId, id_entity]);

        if (update.affectedRows < 1) {
            return res.status(403).json({
                message: "No se ha podido actualizar"
            })
        }

        return res.status(200).json({
            message: "Nombre actualizado correctamente"
        })
    }
}

export default EntityController