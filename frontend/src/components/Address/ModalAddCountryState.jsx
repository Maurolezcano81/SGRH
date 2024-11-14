import React, { useState } from 'react';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import useAuth from '../../hooks/useAuth';
import ButtonWhiteOutlineBlack from '../Buttons/ButtonWhiteOutlineBlack';

const ModalAddCountryState = ({
    title_modal,
    createOne,
    handleModalAdd,
    handleDependencyAdd,
}) => {
    const [nameCountry, setNameCountry] = useState('');
    const [abbreviationCountry, setAbbreviationCountry] = useState('');
    const [arrayStates, setArrayStates] = useState([]);
    const [stateName, setStateName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { authData } = useAuth();

    const validInputRegex = /^[a-zA-Z0-9À-ÿ\s]*$/;

    const handleNameCountryChange = (e) => {
        const value = e.target.value;
        if (validInputRegex.test(value)) {
            setNameCountry(value);
        }
    };

    const handleAbbreviationCountryChange = (e) => {
        setAbbreviationCountry(e.target.value);
    };

    const handleStateNameChange = (e) => {
        const value = e.target.value;
        if (validInputRegex.test(value)) {
            setStateName(value);
        }
    };

    const addStateName = () => {
        if (stateName.trim() && validInputRegex.test(stateName)) {
            if (arrayStates.includes(stateName.trim())) {
                setErrorMessage('La provincia ya existe en la lista.');
            } else {
                setArrayStates([...arrayStates, stateName.trim()]);
                setStateName('');
                setErrorMessage('');
            }
        } else {
            setErrorMessage('El nombre de la provincia no puede estar vacío y debe ser válido.');
        }
    };

    const removeState = (index) => {
        setArrayStates(arrayStates.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!nameCountry.trim()) {
            setErrorMessage('El nombre del país no puede estar vacío.');
            return;
        }
        if (!abbreviationCountry.trim()) {
            setErrorMessage('La abreviatura del país no puede estar vacía.');
            return;
        }
        if (arrayStates.length === 0) {
            setErrorMessage('Debe agregar al menos una provincia.');
            return;
        }

        const newData = {
            name_country: nameCountry,
            abbreviation_country: abbreviationCountry,
            arrayStates: arrayStates,
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
                        {/* Campo Nombre del País */}
                        <div className="preferences__modal__field">
                            <label>Nombre del País</label>
                            <input
                                type="text"
                                name="name_country"
                                placeholder="Ingrese el nombre del país"
                                value={nameCountry}
                                onChange={handleNameCountryChange}
                            />
                        </div>

                        {/* Campo Abreviatura del País */}
                        <div className="preferences__modal__field">
                            <label>Abreviatura del País</label>
                            <input
                                type="text"
                                name="abbreviation_country"
                                placeholder="Ingrese la abreviatura del país"
                                value={abbreviationCountry}
                                onChange={handleAbbreviationCountryChange}
                            />
                        </div>

                        {/* Campo Nombre de la Provincia */}
                        <div className="preferences__modal__field">
                            <label>Nombre de la Provincia</label>
                            <input
                                type="text"
                                name="state_name"
                                placeholder="Ingrese el nombre de la provincia"
                                value={stateName}
                                onChange={handleStateNameChange}
                            />
                        </div>

                        <ButtonWhiteOutlineBlack
                            title="+ Agregar Provincia"
                            onClick={addStateName}
                            full={true}
                        />

                        {/* Listar Provincias */}
                        <div className="input__form__div flex gap-2 flex-col justify-between">
                            <h4>Provincias:</h4>
                            {arrayStates.map((state, index) => (
                                <div className="flex justify-between w-full" key={index}>
                                    <p>{state}</p>

                                    <button className="button__red"
                                        type="button"
                                        onClick={() => removeState(index)}
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

export default ModalAddCountryState;
