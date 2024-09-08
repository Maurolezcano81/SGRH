import BaseModel from '../../../models/BaseModel.js';
import { isInputEmpty, isNotNumber, isNotDate } from '../../../middlewares/Validations.js';
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
            const list = await this.model.getDepartmentsInformation(limit, offset, orderBy, order, filters);

            if (!list) {
                return res.status(403).json({
                    message: "Ha ocurrido un error al obtener los cuestionarios, intentalo de nuevo"
                })
            }

            return res.status(200).json({
                message: "Lista de cuestionarios obtenida con exito",
                list: list,
                total: list.length
            })

        } catch (error) {
            console.error("Ha ocurrido un error en el cuestionario");
            return res.status(403).json({
                message: "Error al obtener los cuestionarios"
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
        const { newQuestion } = req.body;
        try {
            if (isInputEmpty(description_qsq) || isInputEmpty(is_obligatory) || isInputEmpty(newQuestion.bad_parameter_qsq) || isInputEmpty(newQuestion.best_parameter_qsq)) {
                return res.status(403).json({
                    message: "Todos los campos deben estar completos"
                })
            };
            const create = await this.model.updateOne(newQuestion);

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

    async editQuestion(req, res){

    }

}

export default SatisfactionControllers;