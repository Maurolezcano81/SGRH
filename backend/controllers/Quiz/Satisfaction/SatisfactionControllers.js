import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isNotNumber, isNotDate, formatDateTime, formatDateYear, formatYearMonth } from '../../../middlewares/Validations.js';
import SatisfactionModel from '../../../models/Quiz/Satisfaction/Satisfaction.js';


class SatisfactionControllers {
    constructor() {
        this.model = new SatisfactionModel();
        this.questionTable = new BaseModel('question_satisfaction_questionnaire', 'id_qsq');

        this.searchFieldId = 'id_sq';
        this.nameSearchField = 'name_sq';
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
                    start_sq: formatDateYear(item.start_sq),
                    end_sq: formatDateYear(item.end_sq),
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
    
            const queryResponse = {
                ...list[0],
                start_sq: list[0].start_sq ? formatYearMonth(list[0].start_sq) : null,
                end_sq: list[0].end_sq ? formatYearMonth(list[0].end_sq) : null
            };
    
            console.log(queryResponse);
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

        try {
            if (isInputEmpty(id_sq) || isInputEmpty(start_sq) || isInputEmpty(name_sq) || isInputEmpty(end_sq)) {
                console.error("Debe completar todos los campos");
                return res.status(403).json({
                    message: "Debe completar todos los campos"
                })
            }

            const checkDuplicate = await this.model.getOne(name_sq, 'name_sq');

            if (checkDuplicate.length > 0) {
              return res.status(403).json({
                message: 'No se puede crear el cuestionario con este nombre, debido a que ya hay uno existente'
              })
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

        try {
            if (isInputEmpty(id_sq)) {
                console.error("Ha ocurrido un error en el cuestionario");
                return res.status(403).json({
                    message: "Error al Eliminar el Cuestionario"
                })
            }

            const deleteQuiz = await this.model.deleteOne(id_sq, 'id_sq');

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

        console.log(req.body);

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

export default SatisfactionControllers;