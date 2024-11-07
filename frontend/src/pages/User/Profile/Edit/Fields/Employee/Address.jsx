import { useState, useEffect } from 'react';
import useAuth from '../../../../../../hooks/useAuth';
import EditButton from '../../../../../../components/Buttons/EditButton'
import ButtonBlue from '../../../../../../components/ButtonBlue';
import ButtonRed from '../../../../../../components/ButtonRed';

const Address = ({ address, title_modal, updateProfile, permissionsData,
    isEditMode }) => {
    const [listCountries, setListCountries] = useState([]);
    const [listStates, setListStates] = useState([]);
    const [listCities, setListCities] = useState([]);


    const [errorMessage, setErrorMessage] = useState('');

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});

    const { authData } = useAuth();

    const getCountries = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_COUNTRY_ACTIVES}`;
    const getStatesByCountries = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.STATES_BY_COUNTRY}`;
    const getCitiesByState = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.CITIES_BY_STATE}`;

    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_ADDRESS}`;
    const handleSingleEditClick = () => {
        setInitialData({
            id_address: address.id_address,
            id_country: address.id_country,
            id_state: address.id_state,
            city_fk: address.id_city,
            description_address: address.description_address
        });
        setSingleModalIsOpen(true);
    };


    const handleSingleCloseModal = () => {
        setSingleModalIsOpen(false);
    };

    useEffect(() => {
        const fetchCountriesRequest = async () => {
            if (authData.token) {
                try {
                    const fetchResponse = await fetch(getCountries, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authData.token}`,
                        },
                    });

                    if (!fetchResponse.ok) {
                        return;
                    }

                    const countriesList = await fetchResponse.json();
                    const activeCountries = countriesList.list.filter((country) => country.status_country === 1);
                    setListCountries(activeCountries || []);
                } catch (error) {
                    console.error(error.message);
                }
            }
        };

        fetchCountriesRequest();
    }, [authData.token]);

    const handleCountryChange = (e) => {
        setListCities([]);  // Vaciamos las ciudades al cambiar el país
        setListStates([]);  // Vaciamos los estados también al cambiar el país
        const selectedCountry = e.target.value;
        setInitialData((prevState) => ({
            ...prevState,
            id_country: selectedCountry,
            id_state: "",  // Reiniciamos el estado
            city_fk: "",  // Reiniciamos la ciudad
        }));
        changeStates(selectedCountry);  // Cargamos los nuevos estados para el país seleccionado
    };

    useEffect(() => {
        if (singleModalIsOpen) {
            if (initialData.id_country) {
                changeStates(initialData.id_country).then(() => {
                    if (initialData.id_state) {
                        changeCities(initialData.id_state);
                    }
                });
            }
        }
    }, [singleModalIsOpen, initialData.id_country, initialData.id_state]);

    const handleStateChange = (e) => {
        setListCities([]);
        setInitialData((prevState) => ({
            ...prevState,
            id_state: e.target.value,
            city_fk: "",
        }));
        changeCities(e.target.value);
    };

    const changeStates = async (country_fk) => {
        try {
            const fetchResponse = await fetch(getStatesByCountries, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ country_fk }),
            });

            const fetchData = await fetchResponse.json();
            const activeStates = fetchData.queryResponse.filter((state) => state.status_state === 1);
            setListStates(activeStates || []);
            console.log('States loaded:', activeStates);
        } catch (error) {
            console.error('Error loading states:', error);
        }
    };

    const changeCities = async (state_fk) => {
        try {
            const fetchResponse = await fetch(getCitiesByState, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ state_fk }),
            });

            const fetchData = await fetchResponse.json();
            const activeCities = fetchData.queryResponse.filter((city) => city.status_city === 1);
            setListCities(activeCities || []);
            console.log('Cities loaded:', activeCities);
        } catch (error) {
            console.error('Error loading cities:', error);
        }
    };

    const onChangeCityAddress = (e) => {
        const { name, value } = e.target;
        setInitialData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const dataToUpdate = Object.keys(initialData).reduce((obj, key) => {
            if (initialData[key] !== undefined && initialData[key] !== '') {
                obj[key] = initialData[key];
            }
            return obj;
        }, {});

        try {
            const response = await fetch(update, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(dataToUpdate),
            });

            const dataFormatted = await response.json();

            if (response.status === 403) {
                setErrorMessage(dataFormatted.message);
            } else {
                handleSingleCloseModal();
                updateProfile();
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className="input__form__div">
                <div className="input__form__div__container">
                    <p className="input__form__div__label">Domicilio: </p>
                    {(isEditMode && (permissionsData?.isTheSameUser || permissionsData?.isRrhh || permissionsData?.isAdmin)) ?(
                        <EditButton handleClick={handleSingleEditClick} />
                    ): null}
                </div>

                <p className="input__form__div__input">{address.description_address}</p>
            </div>

            {singleModalIsOpen && (
                <div className="alert__background__black">
                    <div className="preferences__modal__container">
                        <div className="preferences__modal__content">
                            <h2>{title_modal}</h2>
                            <form onSubmit={handleFormSubmit} className="preferences__modal__content-update">
                                <div className="container__title-form">
                                    <h2>Domicilio</h2>
                                </div>

                                <div className="input__form__div">
                                    <label className="input__form__div__label" htmlFor="id_country">
                                        País
                                    </label>
                                    <select
                                        onChange={handleCountryChange}
                                        value={initialData.id_country || ""}
                                        className="input__form__div__input"
                                        name="id_country"
                                        id="id_country"
                                    >
                                        <option value="">Seleccione un país</option>
                                        {listCountries.map((country) => (
                                            <option key={country.id_country} value={country.id_country}>
                                                {country.name_country}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input__form__div">
                                    <label className="input__form__div__label" htmlFor="id_state">
                                        Provincia
                                    </label>
                                    <select
                                        onChange={handleStateChange}
                                        value={initialData.id_state || ""}
                                        className="input__form__div__input"
                                        name="id_state"
                                        id="id_state"
                                    >
                                        <option value="">Seleccione una provincia</option>
                                        {listStates.map((state) => (
                                            <option key={state.id_state} value={state.id_state}>
                                                {state.name_state}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input__form__div">
                                    <label className="input__form__div__label" htmlFor="city_fk">
                                        Ciudad
                                    </label>
                                    <select
                                        onChange={onChangeCityAddress}
                                        value={address.id_city || initialData.city_fk}
                                        className="input__form__div__input"
                                        name="city_fk"
                                        id="city_fk"
                                    >
                                        <option value="">Seleccione una ciudad</option>
                                        {listCities.map((city) => (
                                            <option key={city.id_city} value={city.id_city}>
                                                {city.name_city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input__form__div">
                                    <label className="input__form__div__label" htmlFor="description_address">
                                        Dirección
                                    </label>
                                    <input
                                        placeholder="Dirección"
                                        onChange={onChangeCityAddress}
                                        value={initialData.description_address || ""}
                                        className="input__form__div__input"
                                        type="text"
                                        name="description_address"
                                        id="description_address"
                                    />
                                </div>

                                {errorMessage && (
                                    <div className="preferences__modal__error">
                                        <p>{errorMessage}</p>
                                    </div>
                                )}

                                <div className="preferences__modal__actions">
                                    <ButtonRed title="Cancelar" onClick={handleSingleCloseModal} />
                                    <ButtonBlue title="Guardar Cambios" type="submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Address;
