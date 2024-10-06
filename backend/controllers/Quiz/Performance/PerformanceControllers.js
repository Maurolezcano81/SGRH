import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isNotNumber, isNotDate, formatDateTime, formatDateYear, formatYearMonth } from '../../../middlewares/Validations.js';
import PerformanceModel from '../../../models/Quiz/Performance/Performance.js';


class PerformanceControllers {
    constructor() {
        this.model = new PerformanceModel();
        this.questionTable = new BaseModel('evaluation_performance_question', 'id_epq');
        this.supervisorTable = new BaseModel("supervisor_performance_questionnaire", "id_spq")
        this.answerTable = new BaseModel("answer_performance", 'id_ap');
        this.answerDetailTable = new BaseModel('detail_evaluation_performance', 'id_dep')
        this.user = new BaseModel('user', 'id_user');

        this.searchFieldId = 'id_ep';
        this.nameSearchField = 'name_ep';
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

            const startDate = new Date(headerQuiz.start_ep);
            const endDate = new Date(headerQuiz.end_ep);
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

            const checkDuplicate = await this.model.getOne(headerQuiz.name_ep, 'name_ep');

            if (checkDuplicate.length > 0) {
                return res.status(403).json({
                    message: 'No se puede crear el cuestionario con este nombre, debido a que ya hay uno existente'
                })
            }

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
                total: list.length
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

        try {
            if (isInputEmpty(id_ep)) {
                console.error("Ha ocurrido un error en el cuestionario");
                return res.status(403).json({
                    message: "Error al Eliminar el Cuestionario"
                })
            }

            const deleteQuiz = await this.model.deleteOne(id_ep, 'id_ep');

            if (!deleteQuiz) {
                return res.status(403).json({
                    message: "Error al Eliminar el Cuestionario"
                })
            }

            res.status(200).json({
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

            res.status(200).json({
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

            const getTotalResults = await this.model.getTotalResultsExclude(limit, offset, orderBy, typeOrder, filters, arrayToExclude);

            if (list.length < 1) {
                console.log("No se encontraron usuarios.");
                return res.status(403).json({
                    message: "No se encontraron usuarios",
                    list: [],
                    total: 0
                });
            }

            res.status(200).json({
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

            const currentDate = new Date(); // Obtener la fecha actual

            const formattedList = list.map(item => {
                let status_date_expire;

                // Convertir las fechas a objetos Date para realizar comparaciones
                const startDate = new Date(item.start_ep);
                const endDate = new Date(item.end_ep);

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
                    start_ep: formatDateYear(item.start_ep),
                    end_ep: formatDateYear(item.end_ep),
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

            const list = await this.questionTable.getOne(id, 'ep_fk')

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

    async createAnswerSatisfaction(req, res) {
        const { answerData, answersArray } = req.body;
        const { id_user } = req;

        try {
            const dataToCreateAnswer = {
                author_fk: id_user,
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
                    score_dsq: detailAnswer.score_dep,
                    description_dsq: detailAnswer.description_dep
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

            res.status(200).json({
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

}

export default PerformanceControllers;