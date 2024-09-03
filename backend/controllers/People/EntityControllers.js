import { isInputEmpty, isNotDate, isNotAToZ, isNotNumber } from '../../middlewares/Validations.js';
import BaseModel from '../../models/BaseModel.js';
import EntityModel from "../../models/People/People/Entity.js";

class EntityController {
    constructor() {
        this.model = new EntityModel();
        this.address = new BaseModel('address', 'id_address');
        this.city = new BaseModel('city', 'name_city');

        this.nameFieldId = 'id_entity';
        this.nameFieldToSearch = 'name_entity';
    }

    async updateName(req, res) {
        const { id_entity, name_entity } = req.body;

        try {
            if (isNotNumber(id_entity)) {
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
        } catch (error) {
            console.error('Error en controlador de Entity: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateLastName(req, res) {
        const { id_entity, lastname_entity } = req.body;

        try {
            if (isNotNumber(id_entity)) {
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
        } catch (error) {
            console.error('Error en controlador de sexo: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateDateBirth(req, res) {
        const { id_entity, date_birth_entity } = req.body;

        try {
            if (isNotNumber(id_entity)) {
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
        } catch (error) {
            console.error('Error en controlador de sexo: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateNacionality(req, res) {
        const { id_entity, nacionality_fk } = req.body;

        try {
            if (isNotNumber(nacionality_fk)) {
                return res.status(403).json({
                    message: "Los datos de la nacionalidad son incorrectos, intente nuevamente actualizando la pagina"
                })
            }

            if (isNotNumber(id_entity)) {
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
        } catch (error) {
            console.error('Error en controlador de sexo: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateSex(req, res) {
        const { id_entity, sex_fk } = req.body;

        try {
            if (isNotNumber(sex_fk)) {
                return res.status(403).json({
                    message: "Los datos del sexo son incorrectos, intente nuevamente actualizando la pagina"
                })
            }

            if (isNotNumber(id_entity)) {
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
        } catch (error) {
            console.error('Error en controlador de sexo: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async updateAddress(req, res) {
        const { id_address, description_address, city_fk } = req.body;

        try {

            if(isInputEmpty(description_address)){
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            if (isNotNumber(id_address)) {
                return res.status(403).json({
                    message: "Los datos de la direccion a actualizar son incorrectos, intente nuevamente actualizando la pagina"
                })
            }

            if (isNotNumber(city_fk)) {
                return res.status(403).json({
                    message: "Los datos de la direccion a actualizar son incorrectos, intente nuevamente actualizando la pagina"
                })
            }

            const checkExistCity = await this.city.getOne(city_fk, 'id_city');

            if (checkExistCity.length < 1) {
                return res.status(403).json({
                    message: "Los datos de la direccion a actualizar son incorrectos, intente nuevamente actualizando la pagina"
                })
            }

            const update = await this.address.updateOne({ description_address: description_address, city_fk: city_fk }, ['id_address', id_address])

            if (update.affectedRows < 1) {
                return res.status(403).json({
                    message: "No se ha podido actualizar"
                })
            }

            return res.status(200).json({
                message: "Nombre actualizado correctamente"
            })
        } catch (error) {
            console.error('Error en controlador de sexo: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }
}

export default EntityController