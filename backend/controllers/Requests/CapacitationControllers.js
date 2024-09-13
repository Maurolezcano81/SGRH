import CapacitationModel from '../../models/Requests/CapacitationModel.js';
import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces, formatDateTime } from '../../middlewares/Validations.js';
import BaseModel from '../../models/BaseModel.js';


class CapacitationControllers {
    constructor() {
        this.model = new CapacitationModel();

        this.responseCapacitation = new BaseModel('response_request_capacitation', 'created_at');

        this.nameFieldId = 'id_rc';
        this.nameFieldToSearch = 'title_rc';
    }

    async getCapacitations(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        try {
            const list = await this.model.getCapacitationInformattion(limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener las solicitudes de capacitacion, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                    answered_at: formatDateTime(item.answered_at),
                };
            });

            return res.status(200).json({
                message: "Lista de solicitudes de capacitacion obtenida con éxito",
                list: formattedList,
                total: list.length
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener las solicitudes de capacitacion"
            });
        }
    }

    async getCapacitationsById(req, res) {
        const { id_user } = req;
        const { limit, offset, order, typeOrder, filters } = req.body;
        try {
            const list = await this.model.getCapacitationInformattionById(id_user, limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener las solicitudes de capacitacion, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            return res.status(200).json({
                message: "Lista de solicitudes de capacitacion obtenida con éxito",
                list: formattedList,
                total: list.length
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener las solicitudes de capacitacion"
            });
        }
    }

    async getCapacitationsNotAnswer(req, res){

        try {
            const list = await this.model.getCapacitationsNotAnswered();

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener las solicitudes de capacitacion, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            return res.status(200).json({
                message: "Lista de solicitudes de capacitacion obtenida con éxito",
                list: formattedList,
                total: list.length
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener las solicitudes de capacitacion"
            });
        }
    }

    async createRequestCapacitation(req, res) {
        const { title_rc, description_rc } = req.body.dataForm
        const { id_user } = req;

        try {
            const create = await this.model.createOne({
                title_rc: title_rc,
                description_rc: description_rc,
                user_fk: id_user
            })

            if (create.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                })
            }

            return res.status(200).json({
                message: "La solicitud se ha registrado exitosamente",
                create
            })

        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
            })
        }
    }

    async responseRequestCapacitation(req, res) {
        const { id_user } = req;
        const { sr_fk, description_rrc, rc_fk } = req.body;

        try {
            const create = await this.responseCapacitation.createOne({
                sr_fk: sr_fk,
                description_rrc: description_rrc,
                user_fk: id_user,
                rc_fk: rc_fk
            })

            if (!create) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                })
            }

            return res.status(200).json({
                message: "La solicitud se ha registrado exitosamente",
                create
            })

        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
            })
        }

    }


}


export default CapacitationControllers