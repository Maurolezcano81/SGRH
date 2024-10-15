import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import ButtonEditable from '../../components/Buttons/ButtonEditable';
import EditButton from '../../components/Buttons/EditButton';
import DeleteButton from '../../components/Buttons/DeleteButton';
import ChildrenParent from './ChildrenParent';
import ButtonWhiteOutlineBlack from '../../components/Buttons/ButtonWhiteOutlineBlack';
import ModalAdd from '../../components/Modals/ModalAdd';
import ModalDelete from '../../components/Modals/ModalDelete';
import useNav from '../../hooks/useNav';

const ParentsMenu = ({
    isOptionsParentsVisible = false,
    isOptionsChildrensVisible = false,
    id_nm,
    isStatusUpdate,
    setIsStatusUpdate
}) => {

    const getMenues = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_PARENTS_NAV_MENU}`

    const [parentsList, setParentsList] = useState([]);
    const { authData } = useAuth();
    const { canRefresh } = useNav();
    useEffect(() => {

        const fetchUseEffect = async () => {
            const fetchResponse = await fetch(getMenues, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    id_nm: id_nm
                })
            })

            const dataFormatted = await fetchResponse.json()
            if (fetchResponse.status === 500) {
                setIsOpenAlertError(true);
                setAlertErrorMessage(dataFormatted.message);
            }
            setParentsList(dataFormatted.queryResponse);
        }

        fetchUseEffect();
    }, [authData.token, id_nm, isStatusUpdate])


    const urlCreateParent = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_PARENTS_MENU_ADD}`


    const [isModalAddParentOpen, setIsModalAddParentOpen] = useState(false);
    const [dataExtra, setDataExtra] = useState({})
    const handleModalAddParentOpen = () => {
        setIsModalAddParentOpen(true);

        let indexToSubmit;

        if (parentsList.length > 0) {
            let lastOrder = parentsList[parentsList.length - 1]

            indexToSubmit = parentsList.indexOf(lastOrder) + 2
        } else {
            indexToSubmit = 1;
        }
        let dataToSubmit = {
            nm_fk: id_nm,
            order_pm: indexToSubmit
        }

        setDataExtra(dataToSubmit)
    }

    const handleModalAddParentClose = () => {
        setIsModalAddParentOpen(false);
        setIsStatusUpdate(!isStatusUpdate)
    }


    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [parentToDelete, setParentToDelete] = useState(null);
    const urlDeleteParent = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_PARENTS_MENU_DELETE}`

    const handleModalDeleteOpen = (item) => {
        setIsModalDeleteOpen(true)
        setParentToDelete(item)
    }

    const handleModalDeleteClose = () => {
        setIsModalDeleteOpen(false)
        canRefresh()
        setIsStatusUpdate(!isStatusUpdate)

        setTimeout(() => {
            setIsModalDeleteOpen(false)
        }, 3000)
    }


    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataExtraToUpdate, setDataExtraToUpdate] = useState({});

    const handleModalUpdateOpen = (item) => {
        setIsModalUpdateOpen(true);

        setDataExtraToUpdate({
            id_pm: item.id_pm,
            name_pm: item.name_pm,
            order_pm: item.order_pm,
            nm_fk: id_nm
        })
    }

    return (
        <div className='container__left__vertical'>
            {parentsList && parentsList.length < 1
                ?
                <div className='not__answer__body__description'>
                    <p>Primero debe seleccionar un menú en la lista desplegable</p>
                </div>
                : parentsList.map((parent) => (
                    <div key={parent.id_pm} className='background__subitem container__left__vertical'>
                        <div className='container__header__page'>
                            <div className='container__text'>
                                <h4>{parent.name_pm}</h4>
                            </div>

                            {isOptionsParentsVisible && (
                                <div className='flex form__button__container'>

                                    <DeleteButton
                                        action={() => handleModalDeleteOpen(parent)}
                                    />
                                </div>
                            )}

                        </div>

                        <ChildrenParent
                            parent={parent}
                            isOptionsChildrensVisible={isOptionsChildrensVisible}
                            id_nm={id_nm}
                            setIsStatusUpdate={setIsStatusUpdate}
                            isStatusUpdate={isStatusUpdate}
                        />

                    </div>
                ))}

            {isOptionsParentsVisible && (
                <ButtonWhiteOutlineBlack
                    onClick={() => handleModalAddParentOpen()}
                    full={true}
                    title="+ Agregar Menú desplegable" />
            )}

            {isModalDeleteOpen && (
                <ModalDelete
                    handleModalDelete={handleModalDeleteClose}
                    deleteOne={urlDeleteParent}
                    field_name={'id_pm'}
                    idToDelete={parentToDelete.id_pm}
                    onSubmitDelete={handleModalDeleteClose}
                />
            )}


            {isModalAddParentOpen && (
                <ModalAdd
                    title_modal={'Nuevo Menú desplegable'}
                    labels={['Titulo']}
                    placeholders={['Ingrese el titulo']}
                    method={'POST'}
                    fetchData={['name_pm']}
                    createOne={urlCreateParent}
                    handleDependencyAdd={() => setIsStatusUpdate(!isStatusUpdate)}
                    handleModalAdd={handleModalAddParentClose}
                    extraData={dataExtra}
                />
            )}
        </div>
    )
}

export default ParentsMenu;