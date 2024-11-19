import React, { useEffect, useState } from 'react';
import ButtonBlue from '../../../ButtonBlue';
import ButtonRed from '../../../ButtonRed';
import useAuth from '../../../../hooks/useAuth';

const ModalAddProfiles = ({
    title_modal,
    labels,
    name_field_select,
    placeholders,
    fetchData,
    method,
    createOne,
    handleModalAdd,
    handleDependencyAdd,
    urlGetElements,
    messageSelect,
    name_field_text,
    name_field_id
}) => {
    const [inputValues, setInputValues] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [listSelect, setListSelect] = useState([]);
    const { authData } = useAuth();

    useEffect(() => {
        const fetchOptionsSelect = async () => {
            try {
                const response = await fetch(urlGetElements, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const data = await response.json();
                setListSelect(data.list || []); 
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('No se pudieron cargar las opciones');
            }
        };

        fetchOptionsSelect();
    }, [urlGetElements, authData.token]);

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        setInputValues({
            ...inputValues,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const newData = fetchData.reduce((acc, key, index) => {
            acc[key] = inputValues[key] || '';
            return acc;
        }, {});

        try {
            const response = await fetch(createOne, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(newData),
            });

            const dataFormatted = await response.json();

            if (response.status === 403) {
                setErrorMessage(dataFormatted.message);
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
                        {labels.map((label, index) => (
                            <div key={index} className="preferences__modal__field">
                                <label>{label}</label>
                                <input
                                    type="text"
                                    name={fetchData[index]}
                                    placeholder={placeholders[index]}
                                    value={inputValues[fetchData[index]] || ''}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                            </div>
                        ))}
                        {/* Select */}
                        <div className="preferences__modal__field">
                            <label>{messageSelect}</label>
                            <select
                                name={name_field_select}
                                value={inputValues[name_field_select] || ''}
                                onChange={(e) => setInputValues({ ...inputValues, [name_field_select]: e.target.value })}
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                {listSelect.map((option, index) => (
                                    <option key={index} value={option[name_field_id]}>
                                        {option[name_field_text]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                    {errorMessage && (
                        <div className="preferences__modal__error">
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

export default ModalAddProfiles;
