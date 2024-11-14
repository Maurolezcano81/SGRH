import React, { useEffect, useState } from 'react';
import TableHorWithFilters from '../../../components/Table/TableHorWithFilters';
import useAuth from '../../../hooks/useAuth';
import ButtonRed from '../../../components/ButtonRed';
import User from "../../../assets/Icons/Buttons/User.png"
import UserDown from "../../../assets/Icons/Buttons/UserDown.png"
import { useLocation, useNavigate } from 'react-router-dom';
import AlertSuccesfully from '../../../components/Alerts/AlertSuccesfully';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';
import Quizz from '../../../assets/Icons/Buttons/Quizz.png';
import ResponsiveTable from '../../../components/Table/ResponsiveTable';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbsContext';

const ListSatisfaction = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const { authData } = useAuth();
    const navigate = useNavigate();


    const location = useLocation();
    const { updateBreadcrumbs } = useBreadcrumbs();
  
    useEffect(() => {
      updateBreadcrumbs([
        { name: 'Cuestionarios de Satisfacción', url: '/rrhh/satisfaccion/cuestionarios' },
      ]);
    }, [location.pathname]);
  
    
    const columns = [
        { field: 'name_sq', label: 'Nombre del cuestionario' },
        { field: 'start_sq', label: 'Fecha de inicio' },
        { field: 'end_sq', label: 'Fecha de Cierre' },
        { field: 'quantity_questions', label: 'Cantidad de preguntas' },
        { field: 'name_entity', label: 'Nombre del Autor' },
        { field: 'lastname_entity', label: 'Apellido del Autor' },
        { field: 'created_at', label: 'Creado' },
        { field: 'updated_at', label: 'Ultima Actualizacion' },
    ];


    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_sq', label: 'Nombre del cuestionario' },
        { value: 'start_sq', label: 'Fecha de inicio' },
        { value: 'end_sq', label: 'Fecha de Cierre' },
        { value: 'name_entity', label: 'Nombre del Autor' },
        { value: 'lastname_entity', label: 'Apellido del Autor' },
        { value: 'created_at', label: 'Creado' },
        { value: 'updated_at', label: 'Ultima Actualizacion' },
    ];

    const seeQuiz = (row) => {
        navigate("/rrhh/satisfaccion/ampliar", { state: { value_quiz: row.id_sq } })
        console.log(row.id_sq)
    };


    const addButtonTitle = () => {
        navigate("/rrhh/satisfaccion/crear");
    }

    return (
        <>
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <ResponsiveTable
                addButtonTitle={addButtonTitle}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_SATISFACTION}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_sq'}
                initialSearchTerm={''}
                initialSort={{ field: 'start_sq', order: 'desc' }}
                actions={{
                    view: seeQuiz,
                    edit: (row) => console.log("Editar", row),
                    delete: (row) => console.log("Editar", row)
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: false
                }}
                actionColumn='id_ep'
                title_table={"Listado de cuestionarios"}
                paginationLabelInfo={"Cuestionarios de satisfaccion"}
                buttonOneInfo={{ img: Quizz, color: "blue", title: "Ver" }}
                isStatusUpdated={isStatusUpdated}
                titleInfo={[
                    { field: "name_sq", type: "field" },
                    { field: "-", type: "string" },
                    { field: "start_sq", type: "field" },
                ]}
                  headerInfo={
                    ["Cuestionarios y Fecha de Inicio"]
                  }
            />


        </>

    );
}
export default ListSatisfaction;
