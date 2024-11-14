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

const ListPerformance = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);

    const { authData } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const { updateBreadcrumbs } = useBreadcrumbs();
  
    useEffect(() => {
      updateBreadcrumbs([
        { name: 'Cuestionarios de Rendimiento', url: '/rrhh/rendimiento/cuestionarios' },
      ]);
    }, [location.pathname]);
  

    const columns = [
        { field: 'name_ep', label: 'Nombre del cuestionario' },
        { field: 'start_ep', label: 'Fecha de inicio' },
        { field: 'end_ep', label: 'Fecha de Cierre' },
        { field: 'name_entity', label: 'Nombre del Autor' },
        { field: 'lastname_entity', label: 'Apellido del Autor' },
        { field: 'quantity_questions', label: 'Cantidad de preguntas' },

    ];


    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_entity', label: 'Nombre del Autor' },
        { value: 'lastname_entity', label: 'Apellido del Autor' },
        { value: 'name_ep', label: 'Nombre de cuestionario' },
    ];

    const seeQuiz = (row) => {
        console.log(row);
        navigate("/rrhh/rendimiento/ampliar", { state: { value_quiz: row.id_ep } })
        console.log(row.id_ep)
    };


    const addButtonTitle = () => {
        navigate("/rrhh/rendimiento/crear");
    }

    return (
        <>
            {successMessage && <AlertSuccesfully message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <ResponsiveTable
                addButtonTitle={addButtonTitle}
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_ep'}
                initialSearchTerm={''}
                initialSort={{ field: 'start_ep', order: 'desc' }}
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
                paginationLabelInfo={"Cuestionarios de rendimiento"}
                buttonOneInfo={{ img: Quizz, color: "blue", title: "Ver" }}
                isStatusUpdated={isStatusUpdated}
                titleInfo={[
                    { field: "name_ep", type: "field" },
                    { field: "-", type: "string" },
                    { field: "start_ep", type: "field" },
                ]}
                  headerInfo={
                    ["Cuestionarios y Fecha de Inicio"]
                  }
            />


        </>

    );
}
export default ListPerformance;
