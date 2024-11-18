import BaseModel from '../../models/BaseModel.js';
import DashboardModel from '../../models/Dashboard/Dashboard.js';


import { isNotAToZ, isInputEmpty, isNotNumber } from '../../middlewares/Validations.js';

class DashboardControllers {
    constructor() {
        this.model = new DashboardModel();
    }


    async percentOfDismiss(req, res) {
        const { year } = req.body;
        try {
            const date = new Date()

            if (isInputEmpty(year)) {
                year = date.getFullYear();
            }

            const queryResponse = await this.model.percentOfDismiss(year);

            const minAndMaxYears = await this.model.getMinAndMaxYearsForDismiss();

            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidad de Bajas obtenido exitosamente",
                queryResponse,
                minAndMaxYears: minAndMaxYears[0]
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la Cantidad de Bajas'
            })
        }
    }


    async movementsOnDepartment(req, res) {
        const { year } = req.body;
        try {
            const date = new Date()

            if (isInputEmpty(year)) {
                year = date.getFullYear();
            }

            const queryResponse = await this.model.getQuantitiesForMovementsOnDepartments(year);

            const minAndMaxYears = await this.model.getMinAndMaxDatesForMovementsOnDepartments();

            if (queryResponse.length < 0) {
                return res.status(403).json({
                    message: "Ha occurido un error al obtener los datos"
                })
            }

            return res.status(200).json({
                message: "Cantidades de Movimientos Obtenidos exitosamente",
                queryResponse,
                minAndMaxYears: minAndMaxYears
            })
        } catch (error) {
            return res.status(500).json({
                message: 'No se ha podido obtener la información necesaria para el grafico.'
            })
        }
    }

    async getReasonsForDismiss(req, res) {
        try {
            const queryResponse = await this.model.getReasonsForDismiss();

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
                message: 'No se ha podido obtener obtener los datos'
            })
        }
    }

    async getQuantityDaysForLeaves(req, res) {
        try {
            const queryResponse = await this.model.getQuantityDaysForLeaves();

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
                message: 'No se ha podido obtener obtener los datos'
            })
        }
    }

    async getQuantityDaysForLeavesAndDepartment(req, res) {
        try {
            const queryResponse = await this.model.getQuantityDaysForLeavesAndDepartment();

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
                message: 'No se ha podido obtener obtener los datos'
            })
        }
    }


    async getLeavesOnPeriodOfTime(req, res) {
        let { startDate, endDate } = req.body;

        try {

            if (!startDate || !endDate) {
                return res.status(400).json({
                    message: "Por favor, proporcione un rango de fechas válido."
                });
            }

            const queryResponse = await this.model.getLeavesOnPeriodOfTime(startDate, endDate);

            const minAndMaxYears = await this.model.getMinAndMaxLeavesOnPeriodOfTime(startDate, endDate);

            if (queryResponse.length === 0) {
                return res.status(404).json({
                    message: "No se encontraron datos para el rango de fechas proporcionado"
                });
            }

            return res.status(200).json({
                message: "Cantidades de Movimientos Obtenidos exitosamente",
                queryResponse,
                minAndMaxYears
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'No se ha podido obtener la información necesaria para el gráfico.'
            });
        }
    }


    async getAveragePerformanceByEmployee(req, res) {
        const { id_user } = req.body;

        try {
            const queryResponse = await this.model.getAveragePerformanceByEmployee(id_user);

            if (queryResponse.length === 0) {
                return res.status(404).json({
                    message: "No se encontraron datos para el rango de fechas proporcionado"
                });
            }

            return res.status(200).json({
                message: "Evaluaciones y Promedios obtenidos correctamente",
                queryResponse,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'No se ha podido obtener la información necesaria para el gráfico.'
            });
        }
    }

    async getAveragePerformanceByDepartments(req, res) {
        try {
            const queryResponse = await this.model.getAveragePerformanceByDepartments();

            if (queryResponse.length === 0) {
                return res.status(404).json({
                    message: "No se encontraron datos para el rango de fechas proporcionado"
                });
            }

            return res.status(200).json({
                message: "Evaluaciones y Promedios obtenidos correctamente",
                queryResponse,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'No se ha podido obtener la información necesaria para el gráfico.'
            });
        }
    }

    async getAveragePerformanceByDepartmentsAndQuizzes(req, res) {
        const { id_ep, id_department } = req.body;

        try {
            const queryResponse = await this.model.getAveragePerformanceByDepartmentsAndQuizzes(id_ep, id_department);

            if (queryResponse.length === 0) {
                return res.status(404).json({
                    message: "No se encontraron datos para el rango de fechas proporcionado"
                });
            }

            return res.status(200).json({
                message: "Evaluaciones y Promedios obtenidos correctamente",
                queryResponse,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'No se ha podido obtener la información necesaria para el gráfico.'
            });
        }
    }
}

export default DashboardControllers