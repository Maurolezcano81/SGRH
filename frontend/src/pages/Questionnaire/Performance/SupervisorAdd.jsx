import { useState, useEffect } from "react";
import ButtonWhiteOutlineBlack from "../../../components/Buttons/ButtonWhiteOutlineBlack";
import ModalTableWFilters from "../../../components/Modals/Updates/ModalTableWFilters";
import useAuth from "../../../hooks/useAuth";
import AddEmployee from '../../../assets/Icons/Buttons/AddEmployee.png'
import ButtonImgTxt from "../../../components/ButtonImgTex";
import Trash from '../../../assets/Icons/Preferences/Trash.png'

const SupervisorAdd = ({
    setSupervisorBody,
    supervisorBody
}) => {


    const [isAddSupervisorModalOpen, setIsAddSupervisorModalOpen] = useState(false);
    const [isStatusUpdate, setIsStatusUpdate] = useState(false);


    const [supervisorListAllData, setSupervisorListAllData] = useState([]);



    const { authData } = useAuth();

    const getNotSupervisorUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_NOT_SUPERVISOR}`

    const handleOpenModalAddSupervisor = () => {
        setIsAddSupervisorModalOpen(true)
    }

    const handleCloseModalAddSupervisor = () => {
        setIsAddSupervisorModalOpen(false)
    }

    const columsToModal = [
        { field: 'avatar_user', label: '' },
        { field: 'name_entity', label: 'Nombre' },
        { field: 'lastname_entity', label: 'Apellido' },
        { field: 'name_department', label: 'Departamento' },
        { field: 'name_occupation', label: 'Puesto de Trabajo' },
    ]


    const filtersToModal = [
        {
            key: 'name_occupation',
            label: 'Ocupación',
            name_field: 'name_occupation',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}`
        },
        {
            key: 'name_department',
            label: 'Departamento',
            name_field: 'name_department',
            url: `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_ACTIVES}`
        },
    ];

    const searchOptionsToModal = [
        { value: 'name_entity', label: 'Nombre' },
        { value: 'lastname_entity', label: 'Apellido' },

    ]

    const addSupervisor = (row) => {
        setSupervisorListAllData((prevData) => [...prevData, row]);

        setSupervisorBody((prevExclude) => [...prevExclude, row.id_user])
        handleCloseModalAddSupervisor(false);
    };


    const deleteSupervisor = (row) => {
        setSupervisorListAllData((prevData) => prevData.filter(supervisor => supervisor.id_user !== row.id_user));

        setSupervisorBody((prevExclude) => prevExclude.filter(id => id !== row.id_user));
    };

    return (
        <div className="quiz__header__container">
            <div className="container__content">

                <h4>Selección de supervisores</h4>
                <div className="quiz__supervisors__container">

                    {supervisorListAllData && supervisorListAllData.length > 0 && supervisorListAllData.map((supervisor) => (
                        <div className="quiz__supervisor__container" key={supervisor.id_user}>
                            <div className="not__answer__header__profile">
                                <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${supervisor.avatar_user}`} alt="" />
                            </div>

                            <div>
                                <h4>{`${supervisor.name_entity} ${supervisor.lastname_entity}`}</h4>
                                <p className="info__message">{supervisor.name_department}</p>
                            </div>

                            <div>
                                <ButtonImgTxt
                                    img={Trash}
                                    title={"Quitar"}
                                    color={"red"}
                                    onClick={() => deleteSupervisor(supervisor)}
                                />
                            </div>
                        </div>
                    ))}



                    <ButtonWhiteOutlineBlack
                        title={"+ Agregar Supervisor"}
                        onClick={handleOpenModalAddSupervisor}
                    />

                </div>

            </div>

            {isAddSupervisorModalOpen && (
                <ModalTableWFilters
                    url={getNotSupervisorUrl}
                    authToken={authData.token}
                    columns={columsToModal}
                    filterConfigs={filtersToModal}
                    searchOptions={searchOptionsToModal}
                    initialSearchField={'name_entity'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'name_entity', order: 'ASC' }}
                    actions={{
                        view: (row) => addSupervisor(row),
                        edit: (row) => console.log('Editar', row),
                        delete: (row) => console.log('Editar', row),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: false
                    }}
                    actionColumn='id_entity'
                    paginationLabelInfo={'Personas'}
                    buttonOneInfo={{ img: AddEmployee, color: 'blue', title: 'Agregar Personal' }}
                    isStatusUpdated={setIsStatusUpdate}
                    handleCloseModal={handleCloseModalAddSupervisor}
                    title_table={"Lista de Personas"}
                    colorTable={'bg__green-5'}
                    arrayToExclude={supervisorBody}
                />
            )}
        </div>
    )
}


export default SupervisorAdd