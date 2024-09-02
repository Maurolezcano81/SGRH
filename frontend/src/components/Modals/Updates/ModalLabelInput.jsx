import React, { useEffect, useState } from 'react';
import ButtonBlue from '../../ButtonBlue';
import ButtonRed from '../../ButtonRed';
import useAuth from '../../../hooks/useAuth';

const ModalLabelInput = ({ initialData, handleCloseModal, inputField, labelText, urlUpdate, updateProfile }) => {
    const [dataToUpdate, setDataToUpdate] = useState({ ...initialData });
    const [errorMessage, setErrorMessage] = useState('');

    const { authData } = useAuth();
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

            if (response.status === 403) {
                setErrorMessage(dataFormatted.message);
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

                            <label htmlFor={inputField.name}>{labelText}</label>
                            {inputField.type === "text" ? (
                                <input
                                    type="text"
                                    className='input__form__div__input'
                                    name={inputField.name}
                                    value={dataToUpdate[inputField.name] || ''}
                                    onChange={handleInputChange}
                                    placeholder={inputField.placeholder}
                                />
                            ) : inputField.type === "date" ? (
                                <input
                                    type="date"
                                    className='input__form__div__input'
                                    name={inputField.name}
                                    value={dataToUpdate[inputField.name] ? dataToUpdate[inputField.name] : ''}
                                    onChange={handleInputChange}
                                    placeholder={inputField.placeholder}
                                />
                            ) : (
                                <input
                                    type={inputField.type || "text"}
                                    className='input__form__div__input'
                                    name={inputField.name}
                                    value={dataToUpdate[inputField.name] || ''}
                                    onChange={handleInputChange}
                                    placeholder={inputField.placeholder}
                                />
                            )}
                        </div>

                        {errorMessage && (
                            <div className="preferences__modal__error">
                                <p>{errorMessage}</p>
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

export default ModalLabelInput;
