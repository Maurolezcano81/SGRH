import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isNotNumber, isNotDate, formatDateTime, formatDateYear, formatYearMonth } from '../../../middlewares/Validations.js';
import PerformanceModel from '../../../models/Quiz/Performance/Performance.js';


class PerformanceControllers {
    constructor() {
        this.model = new PerformanceModel();
        this.questionTable = new BaseModel('evaluation_performance_question', 'id_epq');

        this.searchFieldId = 'id_ep';
        this.nameSearchField = 'name_ep';
    }


    async createQuiz(req, res) {
        const { headerQuiz, questionQuiz } = req.body;
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
    
            if (!list || list.length === 0) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener el cuestionario, intentalo de nuevo"
                });
            }
    
            const queryResponse = {
                ...list[0],
                start_ep: list[0].start_ep ? formatYearMonth(list[0].start_ep) : null,
                end_ep: list[0].end_ep ? formatYearMonth(list[0].end_ep) : null
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

            const checkDuplicate = await this.model.getOne(name_ep, 'name_ep');

            if (checkDuplicate.length > 0) {
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
        const {question_epq, description_epq, is_obligatory, bad_parameter_epq, best_parameter_epq } = req.body;
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
        const { id_epq, question_epq ,description_epq, is_obligatory, bad_parameter_epq, best_parameter_epq } = req.body;

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


        try {

        } catch (error) {
            console.error("Ha ocurrido un error al eliminar la pregunta");
            return res.status(403).json({
                message: "Error al eliminar la pregunta"
            })
        }
    }

}

export default PerformanceControllers;