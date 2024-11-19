import React, { useEffect, useState } from 'react';
import ButtonBlue from '../../ButtonBlue';
import ButtonRed from '../../ButtonRed';
import useAuth from '../../../hooks/useAuth';
import AlertSuccesfully from '../../Alerts/AlertSuccesfully';
import AlertError from '../../Alerts/AlertError';

const ModalSelectInput = ({ initialData, handleCloseModal, urlForSelect, selectField, inputField, urlUpdate, updateProfile }) => {
    const [dataToUpdate, setDataToUpdate] = useState({ ...initialData });
    const [dataToSelect, setDataToSelect] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const { authData } = useAuth();

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const fetchResponse = await fetch(urlForSelect, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authData.token}`,
                    },
                });
                if (!fetchResponse.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const data = await fetchResponse.json();

                if (data.list.length === 0) {
                    setDataToSelect([]);
                } else {
                    setDataToSelect(data.list);
                }
            } catch (error) {
                console.error('Error al obtener los datos', error);
            }

        }
        fetchRequest();

    }, [authData.token, urlForSelect]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataToUpdate((prevState) => ({ ...prevState, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(urlUpdate, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(dataToUpdate),
            });
            const dataFormatted = await response.json();

            console.log(dataFormatted);

            if (response.status === 403) {
                setErrorMessage(dataFormatted.message);
                return
            } else {
                handleCloseModal();
                updateProfile();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (

        <div className="alert__background__black" onClick={handleCloseModal}>
            <div className="preferences__modal__container" onClick={(e) => e.stopPropagation()}>
                <div className="preferences__modal__content">
                    <form onSubmit={handleSubmit}>
                        <h2>Editar Datos Personales</h2>
                        <div className="input__form__div">
                            {(
                                <select
                                    className='input__form__div__label'
                                    value={dataToUpdate[selectField.name]}
                                    onChange={handleInputChange}
                                    name={selectField.name}
                                >
                                    <option value="">{selectField.placeholder}</option>
                                    {dataToSelect.map((option) => (
                                        <option key={option[selectField.optionKey]} value={option[selectField.optionValue]}>
                                            {option[selectField.optionLabel]}
                                        </option>
                                    ))}
                                </select>
                            )}


                            <input
                                type='text'
                                className='input__form__div__input'
                                name={inputField.name}
                                value={dataToUpdate[inputField.name]}
                                onChange={handleInputChange}
                                placeholder={inputField.placeholder}
                            />
                        </div>

                        {errorMessage && (
                            <div className="preferences__modal__error">
                                <p className='error-message my-2'>{errorMessage}</p>
                            </div>
                        )}

                        <div className="preferences__modal__actions">
                            <ButtonRed title="Cancelar" onClick={handleCloseModal} />
                            <ButtonBlue title="Guardar Cambios" onClick={() => handleSubmit} type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default ModalSelectInput;
