import { isNotAToZ, isInputEmpty, isNotNumber, isInputWithWhiteSpaces, formatDateTime, isNotDate, formatDateYear } from '../../middlewares/Validations.js';
import BaseModel from '../../models/BaseModel.js';
import LeaveModel from '../../models/Requests/LeaveModels.js';


class LeavesControllers {
    constructor() {
        this.model = new LeaveModel();

        this.responseLeaves = new BaseModel('leave_response_request', 'created_at');
        this.attachmentRequest = new BaseModel('attachment_leave_request', 'description_alr');

        this.nameFieldId = 'id_lr';
        this.nameFieldToSearch = 'tol_fk';

        this.employee = new BaseModel('employee', 'id_employee');
    }

    async getLeaves(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        try {
            const list = await this.model.getLeavesInformation(limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener las solicitudes de Licencia, intentalo de nuevo"
                });
            }

            const formattedList = await Promise.all(
                list.map(async (item) => {
                    const attachments = await this.model.getAttachments(item.id_lr);

                    return {
                        ...item,
                        created_at: formatDateTime(item.created_at),
                        updated_at: formatDateTime(item.updated_at),
                        answered_at: formatDateTime(item.answered_at),
                        start_lr: formatDateYear(item.start_lr),
                        end_lr: formatDateYear(item.end_lr),
                        attachments: attachments
                    };
                })
            );

            return res.status(200).json({
                message: "Lista de solicitudes de Licencia obtenida con éxito",
                list: formattedList,
                total: list.length
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener las solicitudes de Licencia"
            });
        }
    }

    async getLeavesById(req, res) {
        const { id_user } = req;
        const { limit, offset, order, typeOrder, filters } = req.body;
        try {
            const list = await this.model.getLeavesInformattionById(id_user, limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener las solicitudes de Licencia, intentalo de nuevo"
                });
            }

            const formattedList = await Promise.all(
                list.map(async (item) => {
                    const attachments = await this.model.getAttachments(item.id_lr);

                    return {
                        ...item,
                        created_at: formatDateTime(item.created_at),
                        updated_at: formatDateTime(item.updated_at),
                        answered_at: formatDateTime(item.answered_at),
                        start_lr: formatDateYear(item.start_lr),
                        end_lr: formatDateYear(item.end_lr),
                        attachments: attachments
                    };
                })
            );
            return res.status(200).json({
                message: "Lista de solicitudes de Licencia obtenida con éxito",
                list: formattedList,
                total: list.length
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener las solicitudes de Licencia"
            });
        }
    }

    async getLeavesNotAnswer(req, res) {
        try {
            const list = await this.model.getLeavesNotAnswered();

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener las solicitudes de Licencia, intentalo de nuevo"
                });
            }


            const formattedList = await Promise.all(
                list.map(async (item) => {
                    const attachments = await this.model.getAttachments(item.id_lr);
                    return {
                        ...item,
                        created_at: formatDateTime(item.created_at),
                        updated_at: formatDateTime(item.updated_at),
                        answered_at: formatDateTime(item.answered_at),
                        start_lr: formatDateYear(item.start_lr),
                        end_lr: formatDateYear(item.end_lr),
                        attachments: attachments
                    };
                })
            );

            return res.status(200).json({
                message: "Lista de solicitudes de Licencia obtenida con éxito",
                list: formattedList,
                total: list.length
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener las solicitudes de Licencia"
            });
        }
    }

    async createRequestLeave(req, res) {
        const { tol_fk, reason_lr, start_lr, end_lr } = req.body

        const imgsArray = req.files || [];
        const { id_user } = req;

        if (isInputEmpty(tol_fk) || isInputEmpty(reason_lr) || isInputEmpty(start_lr) || isInputEmpty(end_lr)) {
            return res.status(403).json({
                message: "Debes completar todos los campos"
            });
        }

        if (isNotDate(start_lr) || isNotDate(end_lr)) {
            return res.status(403).json({
                message: "Las fechas introducidas deben ser válidas"
            });
        }

        const startDate = new Date(start_lr);
        const endDate = new Date(end_lr);
        const currentDate = new Date();

        if (startDate < currentDate) {
            return res.status(403).json({
                message: "La fecha de inicio no puede ser anterior que la fecha actual"
            });
        }

        if (endDate < startDate) {
            return res.status(403).json({
                message: "La fecha de fin no puede ser anterior que la fecha de inicio"
            });
        }


        try {
            const create = await this.model.createOne({
                tol_fk,
                reason_lr,
                start_lr,
                end_lr,
                user_fk: id_user
            });

            if (create.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            if (imgsArray.length > 0) {
                await Promise.all(imgsArray.map(async (item) => {
                    if (item.path) {
                        await this.attachmentRequest.createOne({
                            value_alr: item.path,
                            lr_fk: create.lastId
                        });
                        console.log(`Imagen procesada: ${item.path}`);
                    }
                }));
            }

            return res.status(200).json({
                message: "La solicitud se ha registrado exitosamente",
                create
            });

        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
            });
        }
    }

    async responseRequestLeave(req, res) {
        const { id_user } = req;
        const { sr_fk, lr_fk, description_lrr } = req.body;



        try {

            const getEmployeeData = await this.model.getEmployeeData(lr_fk);

            const create = await this.responseLeaves.createOne({
                sr_fk: sr_fk,
                description_lrr: description_lrr,
                user_fk: id_user,
                lr_fk: lr_fk
            })

            if (!create) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                })
            }

            if (sr_fk === 6 && create.affectedRows > 0) {
                const changeStatusEmployee = await this.employee.updateOne({
                    tse_fk: 2,
                }, getEmployeeData.id_employee)

                if (changeStatusEmployee.affectedRows < 1 || !changeStatusEmployee) {
                    const changeStatusEmployeeToBack = await this.employee.updateOne({
                        tse_fk: 1,
                    }, getEmployeeData.id_employee)
                }
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


export default LeavesControllers