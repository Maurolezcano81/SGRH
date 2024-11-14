import React, { useState } from 'react';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import useAuth from '../../hooks/useAuth';
import ButtonWhiteOutlineBlack from '../Buttons/ButtonWhiteOutlineBlack';

const ModalAddCity = ({
    title_modal,
    createOne,
    handleModalAdd,
    idState
}) => {
    const [cityName, setCityName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { authData } = useAuth();

    const validInputRegex = /^[a-zA-Z0-9À-ÿ\s]*$/;

    const handleCityNameChange = (e) => {
        const value = e.target.value;
        if (validInputRegex.test(value)) {
            setCityName(value);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!cityName.trim()) {
            setErrorMessage('El nombre de la ciudad no puede estar vacío.');
            return;
        }

        const newData = {
            id_state: idState,
            name_city: cityName,
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
                handleModalAdd();
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Ocurrió un error al agregar la ciudad.');
        }
    };

    return (
        <div className="alert__background__black">
            <div className="preferences__modal__container">
                <div className="preferences__modal__content">
                    <h2>{title_modal}</h2>
                    <form>
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
                    </form>

                    {errorMessage && (
                        <div className="preferences__modal__error error-message">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="preferences__modal__actions">
                        <ButtonRed title="Cancelar" onClick={handleModalAdd} />
                        <ButtonBlue title="Guardar Ciudad" onClick={handleFormSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAddCity;
