import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import ButtonBlue from '../../components/ButtonBlue';
import PreferenceTitle from '../MasterTables/PreferenceTitle';
import AlertError from '../../components/Alerts/AlertError';
import ParentsMenu from './ParentsMenu';
import ButtonEditable from '../../components/Buttons/ButtonEditable';

const HomeNavigationMenu = () => {


    const [navbarsList, setNavbarLists] = useState([]);
    const [isStatusUpdate, setIsStatusUpdate] = useState(false);


    const [isModalAddMenuOpen, setIsModalAddMenuOpen] = useState(false);

    const handleisModalAddMenuOpen = () => {
        setIsModalAddMenuOpen(!isModalAddMenuOpen)
    }

    const [isOpenAlertError, setIsOpenAlertError] = useState(false);
    const [AlertErrorMessage, setAlertErrorMessage] = useState("");

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    const { authData } = useAuth();

    const getNavs = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_NAVMENUS}`


    useEffect(() => {

        const fetchUseEffect = async () => {

            const fetchResponse = await fetch(getNavs, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            })


            const dataFormatted = await fetchResponse.json()
            if (fetchResponse.status === 500) {
                setIsOpenAlertError(true);
                setAlertErrorMessage(dataFormatted.message);
            }


            setNavbarLists(dataFormatted.queryResponse);
        }

        fetchUseEffect();
    }, [authData.token, isStatusUpdate])


    const [menuSelected, SetMenuSelected] = useState({
        id_nm: "",
        name_nm: ""
    })

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;

        const selectedMenu = navbarsList.find(menu => menu.id_nm == selectedId);

        if (selectedMenu) {
            SetMenuSelected({
                id_nm: selectedMenu.id_nm,
                name_nm: selectedMenu.name_nm
            });
        }
    };

    const handleIsOptionsOpen = () => {
        setIsOptionsOpen(!isOptionsOpen)
    }

    console.log(menuSelected)

    const [isOptionsParentsVisible, setIsOptionsParentsVisible] = useState(false);

    const handleIsOptionsParentsVisible = () =>{
        setIsOptionsParentsVisible(!isOptionsParentsVisible)
    };

    const [isOptionsChildrensVisible, setIsOptionsChildrensVisible] = useState(false);

    const handleIsOptionsChildrensVisible = () =>{
        setIsOptionsChildrensVisible(!isOptionsChildrensVisible)
    };

    return (
        <div className='container__page'>
            <PreferenceTitle
                title={"Menúes de Navegación"}
            />


            <div className="section__header">
                <div className="section__header__container-select">
                    <select className="input__form__div__input" onChange={handleSelectChange}>
                        <option value="">Seleccione una opción</option>
                        {navbarsList.map((menu) => (
                            <option key={menu.id_nm} value={menu.id_nm}>
                                {menu.name_nm}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="section__header__container-button">
                    <ButtonBlue title={'Mostrar Opciones'} onClick={() => handleIsOptionsOpen()} />
                </div>
            </div>


            {isOptionsOpen && (
                <div className='profile__header__buttons'>
                    <div>
                        <ButtonEditable color={"white"} title={'Cambiar nombre del menu de navegación'} />
                    </div>

                    <div>
                        <ButtonEditable color={`${isOptionsParentsVisible ? 'blue' : 'white'}`} title={'Modo de Edición de Desplegables'} onClick={() => handleIsOptionsParentsVisible()} />
                    </div>

                    <div>
                        <ButtonEditable color={`${isOptionsChildrensVisible ? 'blue' : 'white'}`} title={'Modo de Edición de subitems'} onClick={() => handleIsOptionsChildrensVisible()} />
                    </div>

                    <div>
                        <ButtonEditable color={"white"} title={'Eliminar Menú'} />
                    </div>
                </div>
            )}


            <ParentsMenu
                menu={menuSelected}
                isOptionsParentsVisible={isOptionsParentsVisible}
                isOptionsChildrensVisible={isOptionsChildrensVisible}
                id_nm={menuSelected.id_nm}
                isStatusUpdate={isStatusUpdate}
                setIsStatusUpdate={setIsStatusUpdate}
            />
        </div>
    )
};

export default HomeNavigationMenu;
