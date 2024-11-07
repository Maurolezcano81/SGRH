import BaseModel from '../../models/BaseModel.js';

import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces } from '../../middlewares/Validations.js';
import AuditModel from '../../models/Audit/AuditModel.js';



class AuditControllers {
    constructor() {
        this.model = new AuditModel();
    }

    async getAllWPagination(req, res) {
        try {
            const { limit, offset, order, orderBy, filters } = req.body;

            const list = await this.model.getAllPaginationWhere(limit, offset, order, orderBy, filters);

            if (!list) {
                return res.status(500).json({
                    message: 'No se pudo obtener los datos de auditoria, compruebe su conexión a internet e intente reiniciando el sitio',
                });
            }

            if (list.length < 1) {
                return res.status(200).json({
                    list: []
                });
            }

            const getTotalResults = await this.model.getTotalResultsAllPaginationWhere('id_ag', filters)


            if (getTotalResults.length < 1) {
                return res.status(200).json({
                    message: 'No hay datos de auditoria disponibles',
                    total: 0
                });
            }

            return res.status(200).json({
                message: 'Datos de Auditoria obtenidos correctamente',
                list,
                total: getTotalResults[0].total
            });
        } catch (error) {
            console.error('Error en controlador GetAllWPagination de asunto de mensaje: ' + error);
            return res.status(500).json({
                message: "Ha occurrido un error al obtener los datos de auditoria",
            });
        }
    }


}

export default AuditControllers