import BaseModel from '../../models/BaseModel.js';
import DashboardModel from '../../models/Dashboard/Dashboard.js';


import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';
import SummariesModel from '../../models/Dashboard/Summaries.js';

class SummariesControllers {
    constructor() {
        this.model = new SummariesModel();
    }


    async PercentOfDismissByYear(req, res) {
        const { year } = req.body;
        try {
            const date = new Date()

            if (isInputEmpty(year)) {
                year = date.getFullYear();
            }

            const queryResponse = await this.model.PercentOfDismissByYear(year);

            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }

    async getMinAndMaxYearsForDissmiss(req, res) {
        try {
            const queryResponse = await this.model.getMinAndMaxYearsForDismiss();
            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse[0],
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }


    async getDiffsOnDepartmentsInYear(req, res) {
        const { year } = req.body;
        try {
            const date = new Date()

            if (isInputEmpty(year)) {
                year = date.getFullYear();
            }

            const queryResponse = await this.model.getDiffsOnDepartmentsInYear(year);

            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }

    async getMinAndMaxDiffsOnDepartmentsInYear(req, res) {
        try {
            const queryResponse = await this.model.getMinAndMaxDiffsOnDepartmentsInYear();


            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            console.log(queryResponse)

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse[0],
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }

    async DaysLeavesForDepartment(req, res) {
        const { id_department } = req.body

        try {
            const queryResponse = await this.model.DaysLeavesForDepartment(id_department);


            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }




    async MinAndMaxYearsDaysLeavesForYear(req, res) {
        try {
            const queryResponse = await this.model.MinAndMaxYearsDaysLeavesForYear();
            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse[0],
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }


    async DaysLeavesForYear(req, res) {
        const { year } = req.body;
        try {
            const date = new Date()

            if (isInputEmpty(year)) {
                year = date.getFullYear();
            }

            const queryResponse = await this.model.DaysLeavesForYear(year);

            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }


    
    async DiversityOfSexs(req, res) {
        try {
            const queryResponse = await this.model.DiversityOfSexs();


            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }


            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }

    async longevityEmployees(req, res) {
        try {
            const queryResponse = await this.model.longevityEmployees();


            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }


            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }

    async DiversityOfNacionalities(req, res) {
        try {
            const queryResponse = await this.model.DiversityOfNacionalities();


            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }


            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }

    async expensesByDepartments(req, res) {
        try {
            const queryResponse = await this.model.expensesByDepartments();

            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }


            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }

    async expensesByRanges(req, res) {
        try {
            const queryResponse = await this.model.expensesByRanges();

            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }


            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse: queryResponse,
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }
}

export default SummariesControllers