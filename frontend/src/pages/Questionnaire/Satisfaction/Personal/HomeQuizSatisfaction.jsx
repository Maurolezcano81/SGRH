import { useState } from "react";
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import TableSecondaryNotTitleAndWhereOnUrl from "../../../../components/Table/TableSecondaryNotTitleAndWhereOnUrl";
import Info from '../../../../assets/Icons/Buttons/Info.png'
import MoveEmployee from '../../../../assets/Icons/Buttons/MoveEmployee.png'
import LastFive from "./LastFive";
import useAuth from "../../../../hooks/useAuth";

const HomeQuizSatisfaction = () => {

    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const [initalData, setInitialData] = useState(null);

    const { authData } = useAuth();

    const handleStatusUpdated = () => {
        setIsStatusUpdated(!isStatusUpdated);
    }

    const handleCloseFormRequest = () => {
        setToggleFormRequest(!toggleFormRequest)
    }


    const columns = [
        { field: 'name_sq', label: 'Cuestionario' },
        { field: 'start_sq', label: 'Fecha de Inicio' },
        { field: 'end_sq', label: 'Fecha de Fin' },
        { field: 'average', label: 'Puntaje Promedio' },
        { field: 'quantity_questions', label: 'Cantidad de Preguntas' },
    ];

    const filterConfigs = [

    ];

    const searchOptions = [
        { value: 'name_sq', label: 'Nombre del cuestionario' },
        { value: 'author', label: 'Autor del cuestionario' },
        { value: 'quantity_questions', label: 'Cantidad de preguntas' },
        { value: 'average', label: 'Puntaje Promedio' }
    ];


    const openSeeMore = (initialData) => {
        setInitialData(initialData);
    }

    const closeSeeMore = () => {
    }


    return (
        <div className="container__page">

            <PreferenceTitle
                title={"Portal de Cuestionarios de Satisfacción"}
                titleButton={""}
                onClick={''}
            />

            <LastFive
                dependencyToRefresh={isStatusUpdated}
                setDependencyToRefresh={setIsStatusUpdated}
            />

            <TableSecondaryNotTitleAndWhereOnUrl
                url={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_SATISFACTIONS_EMPLOYEE_ANSWERED}`}
                authToken={authData.token}
                columns={columns}
                filterConfigs={filterConfigs}
                searchOptions={searchOptions}
                initialSearchField={'name_sq'}
                initialSearchTerm={''}
                initialSort={{ field: 'name_sq', order: 'ASC' }}
                actions={{
                    view: (row) => openSeeMore(row),
                    edit: (row) => console.log('Editar', row),
                    delete: (row) => console.log('Editar', row),
                }}
                showActions={{
                    view: true,
                    edit: false,
                    delete: false
                }}
                actionColumn='id_lr'
                paginationLabelInfo={'Cuestionarios Contestados'}
                buttonOneInfo={{ img: Info, color: 'blue', title: 'Ver Más' }}
                buttonTwoInfo={{ img: MoveEmployee, color: 'black', title: 'Mover a otro departamento' }}
                isStatusUpdated={isStatusUpdated}
            />

        </div>


    )

}


export default HomeQuizSatisfaction;