import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isInputWithWhiteSpaces, isNotNumber, isNotAToZ } from '../../../middlewares/Validations.js';

class ModuleControllersClass {
    constructor() {
        this.model = new BaseModel('module', 'id_module');
        this.nameFieldId = 'id_module';
        this.nameFieldToSearch = 'name_module';
    }

    async getAllWPagination(req, res) {
        try {
            const { limit, offset, order, orderBy, filters } = req.body;

            const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

            if (!list) {
                return res.status(500).json({
                    message: 'No se pudo obtener los tipos de modulo, compruebe su conexión a internet e intente reiniciando el sitio',
                });
            }

            if (list.length < 1) {
                return res.status(200).json({
                    list: []
                });
            }

            const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_module', filters)

            if (getTotalResults.length < 1) {
                return res.status(200).json({
                    message: 'No hay tipos de modulo disponibles',
                    total: 0
                });
            }


            return res.status(200).json({
                message: 'Tipos de modulo obtenidos correctamente',
                list,
                total: getTotalResults[0].total
            });
        } catch (error) {
            console.error('Error en controlador de modulo: ' + error);
            return res.status(500).json({
                message: "Ha occurrido un error al obtener los tipos de modulo",
            });
        }
    }

    async getActives(req, res) {
        try {
            const { filters } = req.body;

            const list = await this.model.getAllPaginationWhereFilteredActives('status_module', filters);

            if (!list) {
                return res.status(500).json({
                    message: 'No se pudo obtener los tipos de modulo, compruebe su conexión a internet e intente reiniciando el sitio',
                });
            }

            if (list.length < 1) {
                return res.status(200).json({
                    list: []
                });
            }

            return res.status(200).json({
                message: 'Tipos de modulo obtenidos correctamente',
                list,
            });
        } catch (error) {
            console.error('Error en controlador de modulo: ' + error);
            return res.status(500).json({
                message: "Ha occurrido un error al obtener los tipos de modulo",
            });
        }
    }

    async getOne(req, res) {
        const { value_module } = req.body;
        try {
            if (isInputEmpty(value_module)) {
                throw new Error('Los datos que estás utilizando para la búsqueda de tipo de modulo son inválidos');
            }

            const queryResponse = await this.model.getOne(value_module, this.nameFieldId);

            if (queryResponse.length < 1) {
                throw new Error('Error al obtener el país');
            }

            return res.status(200).json({
                message: 'Tipo de modulo obtenido correctamente',
                queryResponse,
            });
        } catch (error) {
            console.error('Error en controlador de modulo: ' + error);
            return res.status(403).json({
                message: error.message,
            });
        }
    }

    async createOne(req, res) {
        const { name_module, url_module } = req.body;

        try {
            if (isInputEmpty(name_module) || isInputEmpty(url_module)) {
                return res.status(422).json({
                    message: "Debes completar todos los campos"
                })
            }

            if (isNotAToZ(url_module)) {
                return res.status(422).json({
                    message: "El modulo no puede contener caracteres especiales"
                })
            }

            if (isNotAToZ(name_module)) {
                return res.status(422).json({
                    message: "El modulo no puede contener caracteres especiales"
                })
            }

            const checkExists = await this.model.getOne(name_module, this.nameFieldToSearch);

            if (checkExists && checkExists.length > 0) {
                return res.status(403).json({
                    message: "Ya existe un modulo con este nombre, por favor ingrese uno distinto"
                })
            }

            const checkExistsAbbr = await this.model.getOne(url_module, 'url_module');

            if (checkExistsAbbr && checkExistsAbbr.length > 0) {
                return res.status(403).json({
                    message: "Esta url ya esta asociado a un modulo, por favor ingrese uno distinto"
                })
            }

            const queryResponse = await this.model.createOne({ name_module, url_module });

            if (!queryResponse) {
                return res.status(500).json({
                    message: "Ha ocurrido un error al crear el tipo de modulo"
                })
            }

            return res.status(200).json({
                message: 'país creado exitosamente',
                queryResponse,
            });

        } catch (error) {
            console.error('Error en controlador de modulo: ' + error);
            return res.status(500).json({
                message: "Ha occurrido un error al crear el tipo de modulo",
            });
        }
    }

    async updateOne(req, res) {
        const { id_module, name_module, url_module, status_module } = req.body;
        try {
            if (isInputEmpty(id_module) || isInputEmpty(name_module) || isInputEmpty(url_module) || isInputEmpty(status_module)) {
                return res.status(422).json({
                    message: "Debes completar todos los campos"
                })
            }

            if (isNotAToZ(url_module)) {
                return res.status(422).json({
                    message: "El modulo no puede contener caracteres especiales"
                })
            }

            if (isNotAToZ(name_module)) {
                return res.status(422).json({
                    message: "El modulo no debe contener caracteres especiales"
                })
            }

            if (isNotNumber(status_module)) {
                return res.status(403).json({
                    message: "Los datos de estado del país son inválidos"
                })
            }

            const checkExists = await this.model.getOne(id_module, this.nameFieldId);

            if (checkExists.length < 1) {
                return res.status(403).json({
                    message: 'No se puede actualizar este tipo de modulo, debido a que no existe'
                })
            }

            const checkDuplicate = await this.model.getOne(name_module, 'name_module');

            if (checkDuplicate.length > 0) {
                if (checkDuplicate[0].id_module != id_module) {
                    return res.status(403).json({
                        message: 'No se puede actualizar, debido a que ya es un registro existente'
                    })
                }
            }

            const checkDuplicateAbbr = await this.model.getOne(url_module, 'url_module');

            if (checkDuplicateAbbr.length > 0) {
                if (checkDuplicateAbbr[0].id_module != id_module) {
                    return res.status(403).json({
                        message: 'No se puede actualizar, debido a que este modulo ya existe en un registro existente'
                    })
                }
            }

            const queryResponse = await this.model.updateOne({ name_module, url_module, status_module }, [this.nameFieldId, id_module]);

            if (queryResponse.affectedRows < 1) {
                return res.status(500).json({
                    message: "Ha occurrido un error al actualizar el tipo de modulo",
                });
            }

            return res.status(200).json({
                message: 'Tipo de modulo actualizado correctamente',
                queryResponse,
            });
        } catch (error) {
            console.error('Error en controlador de modulo: ' + error);
            return res.status(500).json({
                message: "Ha occurrido un error al actualizar el tipo de modulo",
            });
        }
    }

    async deleteOne(req, res) {
        const { id_module } = req.body;
        try {

            if (isNotNumber(id_module)) {
                return res.status(403).json({
                    message: "Ha occurrido un error al eliminar el tipo de modulo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
                })
            }

            const queryResponse = await this.model.deleteOne(id_module, this.nameFieldId);

            if (queryResponse.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha occurrido un error al eliminar el tipo de modulo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema"
                })
            }

            return res.status(200).json({
                message: 'Tipo de modulo eliminado exitosamente',
                queryResponse,
            });
        } catch (error) {
            console.error('Error en controlador de modulo: ' + error);
            return res.status(403).json({
                message: "Ha occurrido un error al eliminar el tipo de modulo, debido a que esta siendo utilizado en datos que pueden afectar el funcionamiento del sistema",
            });
        }
    }
}

export default ModuleControllersClass;
