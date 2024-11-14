import React, { useState } from 'react';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import useAuth from '../../hooks/useAuth';
import ButtonWhiteOutlineBlack from '../Buttons/ButtonWhiteOutlineBlack';

const ModalAddStateCity = ({
    title_modal,
    createOne,
    handleModalAdd,
    handleDependencyAdd,
    idCountry
}) => {
    const [nameState, setNameState] = useState('');
    const [arrayCities, setArrayCities] = useState([]);
    const [cityName, setCityName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { authData } = useAuth();

    const validInputRegex = /^[a-zA-Z0-9À-ÿ\s]*$/;

    const handleNameStateChange = (e) => {
        const value = e.target.value;
        if (validInputRegex.test(value)) {
            setNameState(value);
        }
    };

    const handleCityNameChange = (e) => {
        const value = e.target.value;
        if (validInputRegex.test(value)) {
            setCityName(value);
        }
    };

    const addCityName = () => {
        if (cityName.trim() && validInputRegex.test(cityName)) {
            if (arrayCities.includes(cityName.trim())) {
                setErrorMessage('La ciudad ya existe en la lista.');
            } else {
                setArrayCities([...arrayCities, cityName.trim()]);
                setCityName('');
                setErrorMessage('');
            }
        } else {
            setErrorMessage('El nombre de la ciudad no puede estar vacío y debe ser válido.');
        }
    };

    const removeCity = (index) => {
        setArrayCities(arrayCities.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!nameState.trim()) {
            setErrorMessage('El nombre del estado no puede estar vacío.');
            return;
        }
        if (arrayCities.length === 0) {
            setErrorMessage('Debe agregar al menos una ciudad.');
            return;
        }

        const newData = {
            id_country: idCountry,
            name_state: nameState,
            arrayCities: arrayCities,
        };

        try {
            const response = await fetch(createOne, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(newData),
            });

            const dataFormatted = await response.json();

            if ([403, 500, 422].includes(response.status)) {
                setErrorMessage(dataFormatted.message);
                return;
            } else {
                handleDependencyAdd();
                handleModalAdd();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="alert__background__black">
            <div className="preferences__modal__container">
                <div className="preferences__modal__content">
                    <h2>{title_modal}</h2>
                    <form>
                        <div className="preferences__modal__field">
                            <label>Nombre del Estado</label>
                            <input
                                type="text"
                                name="name_state"
                                placeholder="Ingrese el nombre del estado"
                                value={nameState}
                                onChange={handleNameStateChange}
                            />
                        </div>

                        <div className="preferences__modal__field">
                            <label>Nombre de la Ciudad</label>
                            <input
                                type="text"
                                name="city_name"
                                placeholder="Ingrese el nombre de la ciudad"
                                value={cityName}
                                onChange={handleCityNameChange}
                            />
                        </div>

                        <ButtonWhiteOutlineBlack
                            title="+ Agregar Ciudad"
                            onClick={addCityName}
                            full={true}
                        />

                        <div className="input__form__div flex gap-2 flex-col justify-between">
                            <h4>Ciudades:</h4>
                            {arrayCities.map((city, index) => (
                                <div className='flex justify-between w-full'>
                                    <p className='' key={index}>
                                        {city}
                                    </p>

                                    <button className=' button__red'
                                        type="button"
                                        onClick={() => removeCity(index)}
                                    >
                                        Quitar
                                    </button>
                                </div>
                            ))}
                        </div>

                    </form>

                    {errorMessage && (
                        <div className="preferences__modal__error error-message">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="preferences__modal__actions">
                        <ButtonRed title="Cancelar" onClick={handleModalAdd} />
                        <ButtonBlue title="Guardar Cambios" onClick={handleFormSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAddStateCity;
