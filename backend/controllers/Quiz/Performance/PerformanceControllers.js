import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isNotNumber, isNotDate, formatDateTime, formatDateYear, formatYearMonth } from '../../../middlewares/Validations.js';
import PerformanceModel from '../../../models/Quiz/Performance/Performance.js';
import EntityModel from '../../../models/People/People/Entity.js';


class PerformanceControllers {
    constructor() {
        this.model = new PerformanceModel();
        this.questionTable = new BaseModel('evaluation_performance_question', 'id_epq');
        this.supervisorTable = new BaseModel("supervisor_performance_questionnaire", "id_spq")
        this.answerTable = new BaseModel("answer_performance", 'id_ap');
        this.answerDetailTable = new BaseModel('detail_evaluation_performance', 'id_dep')
        this.user = new BaseModel('user', 'id_user');
        this.entity = new EntityModel()
        this.searchFieldId = 'id_ep';
        this.nameSearchField = 'name_ep';

        this.audit = new BaseModel('audit_general', 'id_ag');
    }


    async createQuiz(req, res) {
        const { headerQuiz, questionQuiz, supervisorBody } = req.body;
        const { id_user } = req;

        try {
            if (isInputEmpty(headerQuiz.name_ep) || isInputEmpty(headerQuiz.start_ep) || isInputEmpty(headerQuiz.end_ep)) {
                return res.status(403).json({
                    message: "Debes completar todos los campos del titulo",
                    group: "title"
                })
            }

            if (isNotDate(headerQuiz.start_ep) || isNotDate(headerQuiz.end_ep)) {
                return res.status(403).json({
                    message: "Las fechas deben ser validas",
                    group: "date"
                })
            }

            if (supervisorBody.length <= 0) {
                return res.status(403).json({
                    message: "Debe seleccionar al menos a un supervisor",
                    group: "supervisor"
                })
            }

            if (questionQuiz.length < 1) {
                return res.status(403).json({
                    message: "Necesitas agregar al menos una pregunta",
                    group: "questions"
                })
            }

            const checkDuplicate = await this.model.getOne(headerQuiz.name_ep, 'name_ep');

            if (checkDuplicate.length > 0) {
                return res.status(403).json({
                    message: 'No se puede crear el cuestionario con este nombre, debido a que ya hay uno existente'
                })
            }

            // const startDate = new Date(headerQuiz.start_ep);
            // const endDate = new Date(headerQuiz.end_ep);
            // const currentDate = new Date();

            // if (startDate <= currentDate) {
            //     return res.status(403).json({
            //         message: "La fecha de inicio debe ser posterior a la fecha actual."
            //     });
            // }

            // if (endDate < startDate) {
            //     return res.status(403).json({
            //         message: "La fecha de fin no debe ser anterior a la fecha de inicio."
            //     });
            // }

            const dataToCreateQuiz = {
                name_ep: headerQuiz.name_ep,
                start_ep: headerQuiz.start_ep,
                end_ep: headerQuiz.end_ep,
                author_fk: id_user
            }

            for (const question of questionQuiz) {
                if (isInputEmpty(question.question_epq) || isInputEmpty(question.description_epq) || isInputEmpty(question.bad_parameter_epq) || isInputEmpty(question.best_parameter_epq)) {
                    return res.status(403).json({
                        message: "Debes completar todos los campos de las preguntas",
                        group: "questions"
                    });
                }
            }

            const createQuiz = await this.model.createOne(dataToCreateQuiz)

            if (!createQuiz) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al crear el cuestionario, intente reiniciando el sitio"
                })
            }

            for (const supervisor of supervisorBody) {
                const dataToSupervisor = {
                    user_fk: supervisor,
                    ep_fk: createQuiz.lastId
                }


                const insertSupervisorTable = await this.supervisorTable.createOne(dataToSupervisor);

                if (!insertSupervisorTable) {
                    return res.status(403).json({
                        message: "Ha ocurrido un error al agregar la pregunta al formulario"
                    })
                }
            }

            for (const question of questionQuiz) {
                const dataToQuestion = {
                    question_epq: question.question_epq,
                    description_epq: question.description_epq,
                    is_obligatory: question.is_obligatory,
                    bad_parameter_epq: question.bad_parameter_epq,
                    best_parameter_epq: question.best_parameter_epq,
                    ep_fk: createQuiz.lastId
                }

                const insertQuestionToQuiz = await this.questionTable.createOne(dataToQuestion);

                if (!insertQuestionToQuiz) {
                    return res.status(403).json({
                        message: "Ha ocurrido un error al agregar la pregunta al formulario"
                    })
                }
            }

            const getDataActual = await this.model.getDataQuizForAudit(createQuiz.lastId)

            if (getDataActual.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const getDataUserAction = await this.entity.getDataByIdUser(id_user)

            if (getDataUserAction.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const updateAudit = await this.audit.createOne({
                table_affected_ag: 'evaluation_performance',
                id_affected_ag: createQuiz.lastId,
                action_executed_ag: 'C',
                action_context: 'create_performance_quiz',
                user_id_ag: JSON.stringify(getDataUserAction[0]),
                prev_data_ag: null,
                actual_data_ag: JSON.stringify(getDataActual[0])
            })

            return res.status(200).json({
                message: "Cuestionario creado exitosamente"
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
            })
        }
    }

    async getQuizzesInformation(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;

        try {
            const list = await this.model.getQuestionnairesInformation(limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const getTotalResults = await this.model.getTotalQuestionnairesInformation(filters);

            if (!getTotalResults) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }


            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults[0].total
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async getQuizHeader(req, res) {
        const { id_ep } = req.params
        try {
            if (isNotNumber(id_ep)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                });
            }

            const list = await this.model.getQuizHeader(id_ep);

            const supervisors = await this.model.getSupervisorsQuiz(id_ep)
            if (!list || list.length === 0) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                });
            }

            const currentDate = new Date();
            let canEdit;

            const startDate = new Date(list[0]?.start_ep);

            if (currentDate < startDate) {
                canEdit = true;
            } else {
                canEdit = false;
            }


            const queryResponse = {
                ...list[0],
                start_ep: list[0].start_ep ? formatYearMonth(list[0].start_ep) : null,
                end_ep: list[0].end_ep ? formatYearMonth(list[0].end_ep) : null,
                supervisors,
                canEdit
            };

            return res.status(200).json({
                message: "Cuestionario obtenido con éxito",
                queryResponse
            });

        } catch (error) {
            console.error("Error al obtener el cuestionario:", error);
            return res.status(500).json({
                message: "Error al obtener el cuestionario"
            });
        }
    }

    async updateQuizHeader(req, res) {
        const { id_ep, name_ep, start_ep, end_ep } = req.body;
        const { id_user } = req

        try {
            if (isInputEmpty(id_ep) || isInputEmpty(start_ep) || isInputEmpty(name_ep) || isInputEmpty(end_ep)) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            const startDate = new Date(start_ep);
            const endDate = new Date(end_ep);
            const currentDate = new Date();

            if (startDate <= currentDate) {
                return res.status(403).json({
                    message: "La fecha de inicio debe ser posterior a la fecha actual."
                });
            }

            if (endDate < startDate) {
                return res.status(403).json({
                    message: "La fecha de fin no debe ser anterior a la fecha de inicio."
                });
            }

            const now = new Date();
            if (now >= startDate && now <= endDate) {
                return res.status(403).json({
                    message: "No se pudo editar debido a que el cuestionario está en proceso."
                });
            }

            const checkDuplicate = await this.model.getOne(name_ep, 'name_ep');

            if (checkDuplicate.length > 0 && checkDuplicate[0].name_ep != name_ep) {
                return res.status(403).json({
                    message: 'No se puede cambiar el cuestionario con este nombre, debido a que ya hay uno existente'
                })
            }


            const getDataPrev = await this.model.getDataQuizForAudit(id_ep)

            if (getDataPrev.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const update = await this.model.updateOne({
                name_ep: name_ep,
                start_ep: start_ep,
                end_ep: end_ep
            }, ['id_ep', id_ep])


            if (update.affectedRows < 1) {
                console.error("Ha ocurrido un error en el cuestionario");
                return res.status(403).json({
                    message: "Error al actualizar la informacion del cuestionario"
                })
            }

            const getDataActual = await this.model.getDataQuizForAudit(id_ep)

            if (getDataActual.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const getDataUserAction = await this.entity.getDataByIdUser(id_user)

            if (getDataUserAction.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const updateAudit = await this.audit.createOne({
                table_affected_ag: 'evaluation_performance',
                id_affected_ag: id_ep,
                action_executed_ag: 'U',
                action_context: 'edit_performance_header',
                user_id_ag: JSON.stringify(getDataUserAction[0]),
                prev_data_ag: JSON.stringify(getDataPrev[0]),
                actual_data_ag: JSON.stringify(getDataActual[0])
            })

            return res.status(200).json({
                message: "Cuestionario actualizado correctamente"
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al actualizar la pregunta"
            })
        }
    }


    async deleteAllQuiz(req, res) {
        const { id_ep } = req.body;
        const { id_user } = req

        try {
            if (isInputEmpty(id_ep)) {
                console.error("Ha ocurrido un error en el cuestionario");
                return res.status(403).json({
                    message: "Error al Eliminar el Cuestionario"
                })
            }

            const getDataPrev = await this.model.getDataQuizForAudit(id_ep)

            if (getDataPrev.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const deleteQuiz = await this.model.deleteOne(id_ep, 'id_ep');

            if (!deleteQuiz) {
                return res.status(403).json({
                    message: "Error al Eliminar el Cuestionario"
                })
            }

            if (deleteQuiz.affectedRows < 1) {
                return res.status(403).json({
                    message: "Error al Eliminar el Cuestionario"
                })
            }

            const getDataUserAction = await this.entity.getDataByIdUser(id_user)

            if (getDataUserAction.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const updateAudit = await this.audit.createOne({
                table_affected_ag: 'evaluation_performance',
                id_affected_ag: id_ep,
                action_executed_ag: 'D',
                action_context: 'delete_performance_quiz',
                user_id_ag: JSON.stringify(getDataUserAction[0]),
                prev_data_ag: JSON.stringify(getDataPrev[0]),
                actual_data_ag: null
            })

            return res.status(200).json({
                message: "Cuestionario eliminado exitosamente, sera redireccionado en 2 segundos"
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al Eliminar el Cuestionario"
            })
        }

    }

    async getQuizInformation(req, res) {
        const { ep_fk } = req.params

        try {
            if (isNotNumber(ep_fk)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                })
            }

            const queryResponse = await this.model.getQuiz(ep_fk);

            if (!queryResponse) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                })
            }

            return res.status(200).json({
                message: "Cuestionario obtenido con exito",
                queryResponse
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al obtener el cuestionario"
            })
        }
    }

    async addQuestion(req, res) {
        const { question_epq, description_epq, is_obligatory, bad_parameter_epq, best_parameter_epq } = req.body;
        const { id_ep } = req.params;

        try {
            if (isInputEmpty(question_epq) || isInputEmpty(description_epq) || isInputEmpty(is_obligatory) || isInputEmpty(bad_parameter_epq) || isInputEmpty(best_parameter_epq)) {
                return res.status(403).json({
                    message: "Todos los campos deben estar completos"
                })
            };

            const checkDuplicate = await this.questionTable.getOne(question_epq, 'question_epq');

            if (checkDuplicate.length > 0) {
                return res.status(403).json({
                    message: 'No se puede agregar la pregunta al cuestionario, debido a que ya hay una igual existente'
                })
            }

            const newQuestion = {
                question_epq,
                description_epq,
                is_obligatory,
                bad_parameter_epq,
                best_parameter_epq,
                ep_fk: id_ep
            }

            const create = await this.questionTable.createOne(newQuestion);


            if (!create) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al crear la pregunta, intentelo nuevamente reiniciando el sitio"
                })
            }

            return res.status(200).json({
                message: "Pregunta creada con exito",
                create
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al agregar la pregunta"
            })
        }


    }

    async getQuestion(req, res) {
        const { id_epq } = req.body;
        try {

            if (isInputEmpty(id_epq)) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            const queryResponse = await this.questionTable.getOne(id_epq, 'id_epq');

            if (queryResponse.length < 1) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            return res.status(200).json({
                queryResponse
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al obtener la pregunta"
            })
        }
    }

    async editQuestion(req, res) {
        const { id_epq, question_epq, description_epq, is_obligatory, bad_parameter_epq, best_parameter_epq } = req.body;

        try {
            if (isInputEmpty(id_epq) || isInputEmpty(question_epq) || isInputEmpty(description_epq) || isInputEmpty(is_obligatory) || isInputEmpty(bad_parameter_epq) || isInputEmpty(best_parameter_epq)) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            const checkDuplicate = await this.questionTable.getOne(question_epq, 'question_epq');

            if (checkDuplicate.length > 0) {
                return res.status(403).json({
                    message: 'No se puede agregar la pregunta al cuestionario, debido a que ya hay una igual existente'
                })
            }


            const update = await this.questionTable.updateOne({
                question_epq: question_epq,
                description_epq: description_epq,
                is_obligatory: is_obligatory,
                bad_parameter_epq: bad_parameter_epq,
                best_parameter_epq: best_parameter_epq
            }, ['id_epq', id_epq])


            if (update.affectedRows < 1) {
                console.error("Ha ocurrido un error en el cuestionario");
                return res.status(403).json({
                    message: "Error al actualizar la pregunta"
                })
            }

            return res.status(200).json({
                message: "Pregunta actualizada correctamente"
            })


        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al actualizar la pregunta"
            })
        }
    }

    async deleteQuestion(req, res) {
        const { id_epq } = req.body;

        try {

            if (isInputEmpty(id_epq)) {
                console.error("Ha ocurrido un error al eliminar la pregunta");
                return res.status(403).json({
                    message: "Error al eliminar la pregunta"
                })
            }


            const deleteQuestion = await this.questionTable.deleteOne(id_epq, 'id_epq');

            if (deleteQuestion.affectedRows < 1) {
                console.error("Ha ocurrido un error al eliminar la pregunta");
                return res.status(403).json({
                    message: "Error al eliminar la pregunta"
                })
            }

            return res.status(200).json({
                message: "La pregunta ha sido eliminada correctamente"
            })

        } catch (error) {
            console.error("Ha ocurrido un error al eliminar la pregunta");
            return res.status(403).json({
                message: "Error al eliminar la pregunta"
            })
        }
    }

    async getPeopleForSupervisor(req, res) {
        const { limit, offset, orderBy, typeOrder, filters, arrayToExclude } = req.body;

        try {
            const list = await this.model.getPeopleForSupervisor(limit, offset, orderBy, typeOrder, filters, arrayToExclude);

            const getTotalResults = await this.model.getTotalResultsExclude(filters, arrayToExclude);

            if (list.length < 1) {
                console.log("No se encontraron usuarios.");
                return res.status(403).json({
                    message: "No se encontraron usuarios",
                    list: [],
                    total: 0
                });
            }

            return res.status(200).json({
                message: "Usuarios obtenidos correctamente",
                list: list,
                total: getTotalResults[0]?.total
            })

        } catch (error) {
            console.error("Ha ocurrido un error al obtener los usuarios");
            return res.status(403).json({
                message: "Error al obtener los usuarios"
            })
        }
    }

    async addSupervisor(req, res) {
        const { id_ep, id_user } = req.body;
        try {

            const add = await this.supervisorTable.createOne({
                user_fk: id_user,
                ep_fk: id_ep
            })

            if (!add) {
                console.error("Ha ocurrido un error al obtener los usuarios");
                return res.status(500).json({
                    message: "Error al obtener los usuarios"
                })
            }

            return res.status(200).json({
                message: "Supervisor agregado correctamente",
            })

        } catch (error) {
            console.error("Ha ocurrido un error al obtener los usuarios");
            return res.status(500).json({
                message: "Error al obtener los usuarios"
            })
        }
    }

    async deleteSupervisor(req, res) {
        const { id_spq } = req.body;
        try {

            const deleteSupervisor = await this.supervisorTable.deleteOne(id_spq, 'id_spq');

            if (deleteSupervisor.affectedRows < 1) {
                console.error("Ha ocurrido un error al obtener los usuarios");
                return res.status(500).json({
                    message: "Error al obtener los usuarios"
                })
            }

            return res.status(200).json({
                message: "Supervisor eliminado correctamente",
            })
        } catch (error) {
            console.error("Ha ocurrido un error al obtener los usuarios");
            return res.status(500).json({
                message: "Error al obtener los usuarios"
            })
        }
    }

    async getLastFiveQuizzes(req, res) {
        const { id_user } = req;

        try {
            const list = await this.model.getLastFive(id_user);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios"
                });
            }

            const currentDate = new Date();

            const formattedList = list.map(item => {
                let status_date_expire;

                const startDate = new Date(item.start_ep);
                const endDate = new Date(item.end_ep);

                if (endDate < currentDate) {
                    status_date_expire = 'old';
                } else if (startDate <= currentDate && endDate >= currentDate) {
                    status_date_expire = 'actual';
                } else if (startDate > currentDate) {
                    status_date_expire = 'next';
                }

                return {
                    ...item,
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                    status_date_expire
                };
            });

            return res.status(200).json({
                list: formattedList
            });

        } catch (error) {
            console.error(error);
            console.error("Ha ocurrido un error al obtener los cuestionarios");
            return res.status(500).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async getQuestionsForQuizById(req, res) {
        const { id_ep } = req.params

        try {
            if (isNotNumber(id_ep)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                })
            }

            const queryResponse = await this.model.getQuiz(id_ep);

            if (!queryResponse) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                })
            }

            return res.status(200).json({
                message: "Cuestionario obtenido con exito",
                queryResponse
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al obtener el cuestionario"
            })
        }
    }

    async createAnswerSatisfaction(req, res) {
        const { answerData, answersArray } = req.body;
        const { id_user } = req;

        try {

            const dataToCreateAnswer = {
                author_fk: answerData.id_spq,
                is_complete: 1,
                ep_fk: answerData.id_ep,
                evaluated_fk: answerData.evaluated_fk,
                date_complete: new Date(),
            };

            for (const answer of answersArray) {
                if (isInputEmpty(answer.epq_fk)) {
                    return res.status(403).json({
                        message: "Error al enviar las respuestas del cuestionario",
                        group: "questions"
                    });
                }
            }

            const createAnswer = await this.answerTable.createOne(dataToCreateAnswer);

            if (!createAnswer) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al enviar las respuestas del cuestionario, intente reiniciando el sitio"
                });
            }

            for (const detailAnswer of answersArray) {
                const answer = {
                    epq_fk: detailAnswer.epq_fk,
                    ap_fk: createAnswer.lastId,
                    score_dep: detailAnswer.score_dep,
                    description_dep: detailAnswer.description_dep
                };

                const insertQuestionToQuiz = await this.answerDetailTable.createOne(answer);

                if (!insertQuestionToQuiz) {
                    return res.status(403).json({
                        message: "Ha ocurrido un error al agregar la pregunta al formulario"
                    });
                }
            }
            return res.status(200).json({
                message: "Cuestionario respondido exitosamente",
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(500).json({
                message: "Error al insertar las preguntas al cuestionario, intente reiniciando el sitio"
            });
        }
    }

    async getEmployeesToEvaluate(req, res) {
        const { limit, offset, orderBy, typeOrder, filters, arrayToExclude } = req.body;

        const { id_user } = req;
        try {

            const department_supervisor = await this.model.getDepartmentForSupervisor(id_user)

            const department_supervisor_id = department_supervisor.id_department;

            const updatedArrayToExclude = [...arrayToExclude, id_user];

            const list = await this.model.getEmployeesToEvaluate(department_supervisor_id, limit, offset, orderBy, typeOrder, filters, updatedArrayToExclude);

            if (list.length < 1) {
                console.log("No se encontraron usuarios.");
                return res.status(403).json({
                    message: "No se encontraron usuarios",
                    list: [],
                    total: 0
                });
            }

            const getTotalResults = await this.model.getTotalEmployeesToEvaluate(department_supervisor_id, limit, offset, orderBy, typeOrder, filters, updatedArrayToExclude)

            return res.status(200).json({
                message: "Usuarios obtenidos correctamente",
                list: list,
                total: getTotalResults[0]?.total
            })

        } catch (error) {
            console.error("Ha ocurrido un error al obtener los usuarios");
            return res.status(403).json({
                message: "Error al obtener los usuarios"
            })
        }
    }


    async getQuizzesInformationForSupervisor(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        const { id_user } = req;

        try {
            const list = await this.model.getQuizzesInformationForSupervisor(id_user, limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }


            const getTotalResults = await this.model.getTotalQuizzesInformationForSupervisor(id_user, limit, offset, typeOrder, order, filters)

            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults.total || 0
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async getAnswersForQuizForSupervisor(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        const { ep_fk } = req.params;
        const { id_user } = req


        try {

            const department_supervisor = await this.model.getDepartmentForSupervisor(id_user)

            const department_supervisor_id = department_supervisor.id_department;
            const list = await this.model.getAnswersForQuizForSupervisor(ep_fk, department_supervisor_id, limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const getTotalResults = await this.model.getTotalAnswersForQuizForSupervisor(ep_fk, department_supervisor_id, limit, offset, typeOrder, order, filters)

            if (!getTotalResults) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                    date_complete: formatDateTime(item.date_complete)
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults.total || 0
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }


    async getQuizInformationAnsweredForModal(req, res) {
        const { id_ep, id_evaluated, id_supervisor } = req.body

        try {

            const listAnswers = await this.model.getBodySpAnswerByIdQuizAndUser(id_ep, id_evaluated);

            if (!listAnswers) {
                return res.status(500).json({
                    message: "No se ha podido obtener la informacion del cuestionario"
                })
            }

            const headerQuiz = await this.model.getCompleteHeaderQuiz(id_ep);

            if (!headerQuiz) {
                return res.status(500).json({
                    message: "No se ha podido obtener la informacion del cuestionario"
                })
            }

            const dataSupervisor = await this.entity.getDataBasicEmployeeByIdUser(id_supervisor);

            if (!dataSupervisor) {
                return res.status(500).json({
                    message: "No se ha podido obtener la informacion del cuestionario"
                })
            }


            const dataEmployee = await this.entity.getDataBasicEmployeeByIdUser(id_evaluated);

            if (!dataEmployee) {
                return res.status(500).json({
                    message: "No se ha podido obtener la informacion del cuestionario"
                })
            }

            const formattedHeader = headerQuiz.map(item => {
                return {
                    ...item,
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            const list = {
                header: formattedHeader[0],
                answers: [...listAnswers],
                answered: dataSupervisor[0],
                evaluated: dataEmployee[0]
            }

            return res.status(200).json({
                message: "Cuestionario obtenido exitosamente",
                list: list
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(500).json({
                message: "Error al obtener las respuestas del cuestionario, intente reiniciando el sitio"
            });
        }
    }

    async getQuizInformationAnsweredForRrhh(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        const { ep_fk } = req.params;

        try {

            const list = await this.model.getQuizInformationAnsweredForRrhh(ep_fk, limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const getTotalResults = await this.model.getTotalQuizInformationAnsweredForRrhh(ep_fk, limit, offset, typeOrder, order, filters)

            if (!getTotalResults) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                    date_complete: formatDateTime(item.date_complete)
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults.total || 0
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async deleteQuizAnswered(req, res) {
        const { id_ap } = req.body;
        try {

            const deleteAnswers = await this.answerTable.deleteOne(id_ap, "id_ap");

            if (deleteAnswers.affectedRows < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al eliminar este cuestionario"
                })
            }

            return res.status(200).json({
                message: "Cuestionario eliminado exitomasamente"
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async getAnswersForQuizForPersonal(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        const { id_user } = req


        try {
            const list = await this.model.getAnswersForQuizForPersonal(id_user, limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const getTotalResults = await this.model.getTotalAnswersForQuizForPersonal(id_user, limit, offset, typeOrder, order, filters)

            if (!getTotalResults) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                    date_complete: formatDateTime(item.date_complete)
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults.total || 0
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

}

export default PerformanceControllers;