import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isNotNumber, isNotDate, formatDateTime, formatDateYear, formatYearMonth } from '../../../middlewares/Validations.js';
import SatisfactionModel from '../../../models/Quiz/Satisfaction/Satisfaction.js';
import EntityModel from '../../../models/People/People/Entity.js';


class SatisfactionControllers {
    constructor() {
        this.model = new SatisfactionModel();
        this.questionTable = new BaseModel('question_satisfaction_questionnaire', 'id_qsq');

        this.answerTable = new BaseModel('answer_satisfaction_questionnaire', 'id_asq');
        this.answerDetailTable = new BaseModel('detail_satisfaction_questionnaire', 'id_dsq');
        this.entity = new EntityModel();

        this.searchFieldId = 'id_sq';
        this.nameSearchField = 'name_sq';

        this.audit = new BaseModel('audit_general', 'id_ag')
    }


    async createQuiz(req, res) {
        const { headerQuiz, questionQuiz } = req.body;

        const { id_user } = req;

        try {
            if (isInputEmpty(headerQuiz.name_sq) || isInputEmpty(headerQuiz.start_sq) || isInputEmpty(headerQuiz.end_sq)) {
                return res.status(403).json({
                    message: "Debes completar todos los campos del titulo",
                    group: "title"
                })
            }

            if (isNotDate(headerQuiz.start_sq) || isNotDate(headerQuiz.end_sq)) {
                return res.status(403).json({
                    message: "Las fechas deben ser validas",
                    group: "date"
                })
            }

            const startDate = new Date(headerQuiz.start_sq);
            const endDate = new Date(headerQuiz.end_sq);
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

            if (questionQuiz.length < 1) {
                return res.status(403).json({
                    message: "Necesitas agregar al menos una pregunta",
                    group: "questions"
                })
            }

            const checkDuplicate = await this.model.getOne(headerQuiz.name_sq, 'name_sq');

            if (checkDuplicate.length > 0) {
                return res.status(403).json({
                    message: 'No se puede crear el cuestionario con este nombre, debido a que ya hay uno existente'
                })
            }

            const dataToCreateQuiz = {
                name_sq: headerQuiz.name_sq,
                start_sq: headerQuiz.start_sq,
                end_sq: headerQuiz.end_sq,
                author_fk: id_user
            }

            for (const question of questionQuiz) {
                if (isInputEmpty(question.description_qsq) || isInputEmpty(question.bad_parameter_qsq) || isInputEmpty(question.best_parameter_qsq)) {
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


            for (const question of questionQuiz) {
                const dataToQuestion = {
                    description_qsq: question.description_qsq,
                    is_obligatory: question.is_obligatory,
                    bad_parameter_qsq: question.bad_parameter_qsq,
                    best_parameter_qsq: question.best_parameter_qsq,
                    sq_fk: createQuiz.lastId
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
                table_affected_ag: 'satisfaction_questionnaire',
                id_affected_ag: createQuiz.lastId,
                action_executed_ag: 'C',
                action_context: 'create_satisfaction_quiz',
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
                message: "Error al insertar las preguntas al cuestionario"
            })
        }
    }

    async getQuizzesInformation(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;

        try {
            const list = await this.model.getQuestionnairesInformation(limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo",
                    list: []
                });
            }

            if (list.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo",
                    list: []
                });
            }

            const getTotalResults = await this.model.getTotalQuestionnairesInformation(limit, offset, typeOrder, order, filters);

            if (getTotalResults.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo",
                    total: 0
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_sq: formatDateYear(item.start_sq),
                    end_sq: formatDateYear(item.end_sq),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults[0]?.total
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async getQuizHeader(req, res) {
        const { id_sq } = req.params

        try {
            if (isNotNumber(id_sq)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                });
            }

            const list = await this.model.getQuizHeader(id_sq);

            if (!list || list.length === 0) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                });
            }


            const currentDate = new Date();
            let canEdit;

            const startDate = new Date(list[0]?.start_sq);

            if (currentDate < startDate) {
                canEdit = true;
            } else {
                canEdit = false;
            }


            const queryResponse = {
                ...list[0],
                start_sq: list[0].start_sq ? formatYearMonth(list[0].start_sq) : null,
                end_sq: list[0].end_sq ? formatYearMonth(list[0].end_sq) : null,
                canEdit: canEdit || false
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
        const { id_sq, name_sq, start_sq, end_sq } = req.body;
        const {id_user} = req;
        try {
            if (isInputEmpty(id_sq) || isInputEmpty(start_sq) || isInputEmpty(name_sq) || isInputEmpty(end_sq)) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            const startDate = new Date(start_sq);
            const endDate = new Date(end_sq);
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

            const checkDuplicate = await this.model.getOne(name_sq, 'name_sq');

            if (checkDuplicate.length > 0 && checkDuplicate[0].name_sq != name_sq) {
                return res.status(403).json({
                    message: 'No se puede crear el cuestionario con este nombre, debido a que ya hay uno existente'
                })
            }

            const getDataPrev = await this.model.getDataQuizForAudit(id_sq)

            if (getDataPrev.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const update = await this.model.updateOne({
                name_sq: name_sq,
                start_sq: start_sq,
                end_sq: end_sq
            }, ['id_sq', id_sq])


            if (update.affectedRows < 1) {
                console.error("Ha ocurrido un error en el cuestionario");
                return res.status(403).json({
                    message: "Error al actualizar la informacion del cuestionario"
                })
            }

            const getDataActual = await this.model.getDataQuizForAudit(id_sq)

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
                table_affected_ag: 'satisfaction_questionnaire',
                id_affected_ag: id_sq,
                action_executed_ag: 'U',
                action_context: 'edit_satisfaction_header',
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
        const { id_sq } = req.body;
        const { id_user } = req
        try {
            if (isInputEmpty(id_sq)) {
                console.error("Ha ocurrido un error en el cuestionario");
                return res.status(403).json({
                    message: "Error al Eliminar el Cuestionario"
                })
            }

            const getDataPrev = await this.model.getDataQuizForAudit(id_sq)

            if (getDataPrev.length < 1) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al realizar la solicitud, intentelo nuevamente reiniciando el sitio."
                });
            }

            const deleteQuiz = await this.model.deleteOne(id_sq, 'id_sq');

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
                table_affected_ag: 'satisfaction_questionnaire',
                id_affected_ag: id_sq,
                action_executed_ag: 'D',
                action_context: 'delete_satisfaction_quiz',
                user_id_ag: JSON.stringify(getDataUserAction[0]),
                prev_data_ag: JSON.stringify(getDataPrev[0]),
                actual_data_ag: null
            })

            return res.status(200).json({
                message: "Cuestionario elimnado exitosamente, sera redireccionado en 2 segundos"
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al Eliminar el Cuestionario"
            })
        }

    }

    async getQuizInformation(req, res) {
        const { sq_fk } = req.params

        try {
            if (isNotNumber(sq_fk)) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                })
            }

            const queryResponse = await this.model.getQuiz(sq_fk);

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
        const { description_qsq, is_obligatory, bad_parameter_qsq, best_parameter_qsq } = req.body;
        const { id_sq } = req.params;

        try {
            if (isInputEmpty(description_qsq) || isInputEmpty(is_obligatory) || isInputEmpty(bad_parameter_qsq) || isInputEmpty(best_parameter_qsq)) {
                return res.status(403).json({
                    message: "Todos los campos deben estar completos"
                })
            };

            const checkDuplicate = await this.questionTable.getOne(description_qsq, 'description_qsq');

            if (checkDuplicate.length > 0) {
                return res.status(403).json({
                    message: 'No se puede agregar la pregunta al cuestionario, debido a que ya hay una igual existente'
                })
            }

            const newQuestion = {
                description_qsq,
                is_obligatory,
                bad_parameter_qsq,
                best_parameter_qsq,
                sq_fk: id_sq
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
                message: "Error al actualizar la pregunta"
            })
        }


    }

    async getQuestion(req, res) {
        const { id_qsq } = req.body;

        try {

            if (isInputEmpty(id_qsq)) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            const queryResponse = await this.questionTable.getOne(id_qsq, 'id_qsq');

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
        const { id_qsq, description_qsq, is_obligatory, bad_parameter_qsq, best_parameter_qsq } = req.body;

        try {
            if (isInputEmpty(id_qsq) || isInputEmpty(description_qsq) || isInputEmpty(is_obligatory) || isInputEmpty(bad_parameter_qsq) || isInputEmpty(best_parameter_qsq)) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            const checkDuplicate = await this.questionTable.getOne(description_qsq, 'description_qsq');

            if (checkDuplicate.length > 0) {
                return res.status(403).json({
                    message: 'No se puede editar la pregunta del cuestionario, debido a que ya hay una igual existente'
                })
            }

            const update = await this.questionTable.updateOne({
                description_qsq: description_qsq,
                is_obligatory: is_obligatory,
                bad_parameter_qsq: bad_parameter_qsq,
                best_parameter_qsq: best_parameter_qsq
            }, ['id_qsq', id_qsq])


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
        try {
            const { id_qsq } = req.body;

            if (isInputEmpty(id_qsq)) {
                console.error("Ha ocurrido un error al eliminar la pregunta");
                return res.status(403).json({
                    message: "Error al eliminar la pregunta"
                })
            }


            const deleteQuestion = await this.questionTable.deleteOne(id_qsq, 'id_qsq');

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


    async getLastFiveQuizzes(req, res) {
        const { id_user } = req;

        try {
            const list = await this.model.getLastFive(id_user);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios"
                });
            }

            const currentDate = new Date(); // Obtener la fecha actual

            const formattedList = list.map(item => {
                let status_date_expire;

                // Convertir las fechas a objetos Date para realizar comparaciones
                const startDate = new Date(item.start_sq);
                const endDate = new Date(item.end_sq);

                // Comparar fechas para determinar si es 'old', 'actual' o 'next'
                if (endDate < currentDate) {
                    status_date_expire = 'old';
                } else if (startDate <= currentDate && endDate >= currentDate) {
                    status_date_expire = 'actual';
                } else if (startDate > currentDate) {
                    status_date_expire = 'next';
                }

                return {
                    ...item,
                    start_sq: formatDateYear(item.start_sq),
                    end_sq: formatDateYear(item.end_sq),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                    status_date_expire // Agregamos el nuevo estado
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


    async getQuizForAnswer(req, res) {
        const { id } = req.params;

        try {

            if (isNotNumber(id)) {
                return res.status(500).json({
                    message: "Ha ocurrido un error al obtener el cuestionario"
                });
            };

            const list = await this.questionTable.getOne(id, 'sq_fk')

            if (!list) {
                return res.status(500).json({
                    message: "Ha ocurrido un error al obtener el cuestionario"
                })
            }

            return res.status(200).json({
                message: "Preguntas obtenidas correctamente",
                list: list
            })

        } catch (error) {
            console.error("Ha ocurrido un error al obtener las preguntas");
            return res.status(500).json({
                message: "Error al obtener las preguntas"
            })
        }
    }

    async getQuizAnsweredByEmployee(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        const { id_user } = req;

        try {
            const list = await this.model.getQuestionnairesInformationByEmployee(id_user, limit, offset, typeOrder, order, filters);

            const getTotalResults = await this.model.getTotalResultsQuizAnsweredByEmployee();

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_sq: formatDateYear(item.start_sq),
                    end_sq: formatDateYear(item.end_sq),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults[0].total || 0
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async createAnswerSatisfaction(req, res) {
        const { answerData, answersArray } = req.body;
        const { id_user } = req;

        try {
            const dataToCreateAnswer = {
                user_fk: id_user,
                is_complete: 1,
                sq_fk: answerData.id_sq,
                date_complete: new Date(),
            };

            for (const answer of answersArray) {
                if (isInputEmpty(answer.qsq_fk)) {
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
                    asq_fk: createAnswer.lastId,
                    qsq_fk: detailAnswer.qsq_fk,
                    score_dsq: detailAnswer.score_dsq,
                    description_dsq: detailAnswer.description_dsq
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

    async getQuizInformationAnsweredForModal(req, res) {
        const { id_sq, id_user } = req.body

        try {

            const listAnswers = await this.model.getBodySqAnswerByIdQuizAndUser(id_sq, id_user);

            if (!listAnswers) {
                return res.status(500).json({
                    message: "No se ha podido obtener la informacion del cuestionario"
                })
            }

            const headerQuiz = await this.model.getCompleteHeaderQuiz(id_sq);

            if (!headerQuiz) {
                return res.status(500).json({
                    message: "No se ha podido obtener la informacion del cuestionario"
                })
            }

            const dataEmployee = await this.entity.getDataBasicEmployeeByIdUser(id_user);

            if (!dataEmployee) {
                return res.status(500).json({
                    message: "No se ha podido obtener la informacion del cuestionario"
                })
            }


            const formattedHeader = headerQuiz.map(item => {
                return {
                    ...item,
                    start_sq: formatDateYear(item.start_sq),
                    end_sq: formatDateYear(item.end_sq),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                };
            });

            const list = {
                header: formattedHeader[0],
                answers: [...listAnswers],
                answered: dataEmployee[0]
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

    async getAnswersForQuizById(req, res) {
        const { limit, offset, order, typeOrder, filters } = req.body;
        const { id_sq } = req.params;

        try {
            const list = await this.model.getAnswersForQuiz(id_sq, limit, offset, typeOrder, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const getTotalResults = await this.model.getTotalResultsQuizAnsweredByEmployeeAndSq(id_sq);

            if (!getTotalResults) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                });
            }

            const formattedList = list.map(item => {
                return {
                    ...item,
                    start_sq: formatDateYear(item.start_sq),
                    end_sq: formatDateYear(item.end_sq),
                    created_at: formatDateTime(item.created_at),
                    updated_at: formatDateTime(item.updated_at),
                    date_complete: formatDateTime(item.date_complete)
                };
            });

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con éxito",
                list: formattedList,
                total: getTotalResults[0]?.total || 0
            });

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario", error);
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
            });
        }
    }

    async deleteQuizAnswered(req, res) {
        const { id_asq } = req.body;
        try {

            const deleteAnswers = await this.answerTable.deleteOne(id_asq, "id_asq");

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
}

export default SatisfactionControllers;