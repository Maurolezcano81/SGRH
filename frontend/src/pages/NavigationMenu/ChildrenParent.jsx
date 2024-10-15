import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import DeleteButton from '../../components/Buttons/DeleteButton';
import ButtonWhiteOutlineBlack from '../../components/Buttons/ButtonWhiteOutlineBlack';
import ModalDelete from '../../components/Modals/ModalDelete';
import ModalTableWFilters from '../../components/Modals/Updates/ModalTableWFilters';
import AddEmployee from '../../assets/Icons/Buttons/AddEmployee.png'
import AlertError from '../../components/Alerts/AlertError';
import AlertSuccesfully from '../../components/Alerts/AlertSuccesfully';
import useNav from '../../hooks/useNav';

const ChildrenParent = ({
    parent,
    isOptionsChildrensVisible = false,
    setIsStatusUpdate,
    isStatusUpdate,
    id_nm,
    id_pm
}) => {

    const getData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CHILDRENS_NAV_MENU}`

    const [list, setList] = useState([]);
    const [alertError, setAlertError] = useState(false);
    const [alertErrorMessage, setAlertErrorMessage] = useState("")
    const [alertSucces, setAlertSucces] = useState(false);
    const [alertSuccesMessage, setAlertSuccesMessage] = useState("");
    const {canRefresh} = useNav()

    const { authData } = useAuth();

    useEffect(() => {

        const fetchUseEffect = async () => {
            const fetchResponse = await fetch(getData, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    id_pm: parent?.id_pm
                })
            })

            const dataFormatted = await fetchResponse.json()
            if (fetchResponse.status === 500) {
                setAlertError(true);
                setAlertErrorMessage(dataFormatted.message);
            }
            setList(dataFormatted.queryResponse);
        }

        fetchUseEffect();
    }, [authData.token, parent.id_pm, isStatusUpdate])

    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState("");

    const urlToDelete = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_CHILDRENS_DELETE}`

    const handleOpenModalDelete = (item) => {
        setDataToDelete(item);
        setIsOpenModalDelete(true)
    };

    const handleCloseModalDelete = () => {
        setIsOpenModalDelete(false)
        canRefresh()
        setIsStatusUpdate(!isStatusUpdate)
    
        setTimeout(() => {
            setIsOpenModalDelete(false)
        }, 3000)
    }

    const [isListToAddOpen, setIsListToAddOpen] = useState(false);

    const handleOpenModalAdd = () => {
        setIsListToAddOpen(true);
    };


    const handleCloseModalAdd = () => {
        setIsListToAddOpen(false);
    }

    const urlCreateChildrenParent = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_CHILDRENS_ADD}`

    const handleDataToSubmit = async (item) => {

        let indexToSubmit;



        if (list.length > 0) {
            let lastOrder = list[list.length - 1]

            indexToSubmit = list.indexOf(lastOrder) + 2
        } else {
            indexToSubmit = 1;
        }

        let dataToSubmit = {
            pm_fk: parent.id_pm,
            module_fk: item.id_module,
            order_mp: indexToSubmit
        }

        try {
            const fetchRequest = await fetch(urlCreateChildrenParent, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${authData.token}`
                },
                body: JSON.stringify(dataToSubmit)
            })

            const dataFormatted = await fetchRequest.json();

            if (fetchRequest.status != 200) {
                setIsListToAddOpen(false);
                setAlertError(true);
                setAlertErrorMessage(dataFormatted.message);

                setTimeout(() => {
                    setAlertError(false);
                    setAlertErrorMessage("");
                }, 3000)
            }

            setIsListToAddOpen(false);
            canRefresh();
            setAlertSucces(true);
            setAlertSucces(dataFormatted.message);
            setIsStatusUpdate(!isStatusUpdate)
            setTimeout(() => {
                setAlertSucces(false);
                setAlertSucces("");
            }, 3000)

        } catch (error) {
            setIsListToAddOpen(false);
            setAlertError(true);
            setAlertErrorMessage("Ha ocurrido un error, pruebe reiniciando el sitio");

            setTimeout(() => {
                setAlertError(false);
                setAlertErrorMessage("");
            }, 3000)
        }

    }


    const getDataToSearchInModal = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CHILDRENS_NAV_FOR_ADD}/${id_nm}`


    const columsToModal = [
        { field: 'name_module', label: 'Nombre de la Página' },
    ]


    const filtersToModal = [

    ];

    const searchOptionsToModal = [
        { value: 'name_module', label: 'Nombre de la Página' },
    ]

    return (
        <div className='container__left__vertical__subitem'>
            {list && list.length < 1
                ? <div className='not__answer__body__description'>
                    <p>No hay paginas para este menu</p>
                </div>

                : list.map((item) => (
                        <div key={item.id_mp} className='container__subitem__page'>
                            <div className='container__text__subitem'>
                                <h4>{item.name_module}</h4>
                            </div>

                            {isOptionsChildrensVisible && (
                                <div className='flex form__button__container'>
                                    <DeleteButton
                                        action={() => handleOpenModalDelete(item)}
                                    />
                                </div>
                            )}

                        </div>
                ))}

            {isOpenModalDelete && (
                <ModalDelete
                    handleModalDelete={handleCloseModalDelete}
                    deleteOne={urlToDelete}
                    field_name={'id_mp'}
                    idToDelete={dataToDelete.id_mp}
                    onSubmitDelete={handleCloseModalDelete}
                />
            )}

            {isListToAddOpen && (
                <ModalTableWFilters
                    url={getDataToSearchInModal}
                    authToken={authData.token}
                    columns={columsToModal}
                    filterConfigs={filtersToModal}
                    searchOptions={searchOptionsToModal}
                    initialSearchField={'name_module'}
                    initialSearchTerm={''}
                    initialSort={{ field: 'name_module', order: 'ASC' }}
                    actions={{
                        view: (row) => handleDataToSubmit(row),
                        edit: (row) => console.log('Editar', row),
                        delete: (row) => console.log('Editar', row),
                    }}
                    showActions={{
                        view: true,
                        edit: false,
                        delete: false
                    }}
                    actionColumn='id_module'
                    paginationLabelInfo={'Páginas de Navegación'}
                    buttonOneInfo={{ img: AddEmployee, color: 'blue', title: 'Agregar' }}
                    isStatusUpdated={isStatusUpdate}
                    handleCloseModal={handleCloseModalAdd}
                    title_table={"Agregar Páginas de Navegación"}
                    colorTable={'bg__blue-5'}
                />
            )}

            {isOptionsChildrensVisible && (
                <ButtonWhiteOutlineBlack
                    title={"+ Agregar página de navegación"}
                    onClick={() => handleOpenModalAdd()}
                />
            )}

            {alertError && alertErrorMessage.length > 0 && (
                <AlertError
                    errorMessage={alertErrorMessage}
                />
            )}

            {alertSucces && alertSuccesMessage.length > 0 && (
                <AlertSuccesfully
                    message={message}
                />
            )}
        </div>
    )
}

export default ChildrenParent;