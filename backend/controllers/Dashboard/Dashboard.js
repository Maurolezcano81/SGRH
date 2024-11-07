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

    async getReasonsForDismiss(req, res){
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

    async getQuantityDaysForLeaves(req, res){
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

    async getQuantityDaysForLeavesAndDepartment(req, res){
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

}


export default DashboardControllers