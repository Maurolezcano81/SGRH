import React, { useEffect, useState } from 'react';
import ButtonBlue from '../../../../../../../components/ButtonBlue';
import ButtonRed from '../../../../../../../components/ButtonRed';
import useAuth from '../../../../../../../hooks/useAuth';

const ContactsAdd = ({ entityFk, handleCloseModal, refreshList }) => {
    const [formData, setFormData] = useState({
        entity_fk: entityFk, // Valor fijo proporcionado por las props
        value_ec: '',
        contact_fk: '', // Se llenará con el ID del contacto seleccionado
    });
    const [contacts, setDocuments] = useState([]); // Opciones para el select
    const [errorMessage, setErrorMessage] = useState('');
    const [validationError, setValidationError] = useState('');

    const { authData } = useAuth();

    const urlForSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CONTACT_ACTIVES}`;
    const urlCreate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_ENTITY_CONTACT}`;

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(urlForSelect, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authData.token}`,
                    },
                });
                if (!response.ok) throw new Error('Error al obtener los documentos');

                const data = await response.json();
                setDocuments(data.list || []);
            } catch (error) {
                console.error('Error al cargar los documentos:', error);
            }
        };

        fetchContacts();
    }, [authData.token, urlForSelect]);

    const validationRules = {
        1: { 
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
            message: 'El correo electrónico debe tener un formato válido.' 
        },
        2: { 
            regex: /^\d{7,10}$/, 
            message: 'El teléfono fijo debe contener entre 7 y 10 dígitos.' 
        },
        3: { 
            regex: /^\d{10}$/, 
            message: 'El teléfono móvil debe contener exactamente 10 dígitos.' 
        },
        4: { 
            regex: /^\d{7,10}$/, 
            message: 'El fax debe contener entre 7 y 10 dígitos.' 
        },
        5: { 
            regex: /^.{5,100}$/, 
            message: 'La dirección postal debe tener entre 5 y 100 caracteres.' 
        },
        6: { 
            regex: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_.]{3,}$/, 
            message: 'El enlace de Facebook debe ser válido y contener al menos 3 caracteres después de "facebook.com/".' 
        },
        7: { 
            regex: /^@[a-zA-Z0-9_]{3,15}$/, 
            message: 'El usuario de Twitter debe comenzar con "@" y tener entre 3 y 15 caracteres.' 
        },
        8: { 
            regex: /^@[a-zA-Z0-9_.]{3,30}$/, 
            message: 'El usuario de Instagram debe comenzar con "@" y tener entre 3 y 30 caracteres.' 
        },
        9: { 
            regex: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}$/, 
            message: 'El enlace de LinkedIn debe ser válido y contener entre 5 y 30 caracteres después de "linkedin.com/in/".' 
        },
        10: { 
            regex: /^\d{10,15}$/, 
            message: 'El número de WhatsApp debe contener entre 10 y 15 dígitos.' 
        },
        12: { 
            regex: /^.{1,}$/, 
            message: 'El valor del contacto "prueba 2" no puede estar vacío.' 
        },
        17: { 
            regex: /^.{1,}$/, 
            message: 'El valor del contacto "sa" no puede estar vacío.' 
        },
        18: { 
            regex: /^.{1,}$/, 
            message: 'El valor del contacto "ss" no puede estar vacío.' 
        },
        30: { 
            regex: /^\d{7,15}$/, 
            message: 'El teléfono corporativo debe contener entre 7 y 15 dígitos.' 
        },
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));

        if (name === 'value_ec') {
            const rule = validationRules[formData.contact_fk];
            if (rule && !rule.regex.test(value)) {
                setValidationError(rule.message);
            } else {
                setValidationError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación final antes de enviar
        const rule = validationRules[formData.contact_fk];
        if (rule && !rule.regex.test(formData.value_ec)) {
            setValidationError(rule.message);
            return;
        }

        try {
            const response = await fetch(urlCreate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) {
                setErrorMessage(result.message || 'Error al crear el registro');
            } else {
                handleCloseModal();
                refreshList(); // Actualizar la lista de registros en el padre
            }
        } catch (error) {
            console.error('Error al crear el registro:', error);
            setErrorMessage('Error inesperado, por favor inténtalo de nuevo.');
        }
    };

    return (
        <div className="alert__background__black" onClick={handleCloseModal}>
            <div className="preferences__modal__container" onClick={(e) => e.stopPropagation()}>
                <div className="preferences__modal__content">
                    <form onSubmit={handleSubmit}>
                        <h2>Crear Nuevo Registro</h2>
                        <div className="input__form__div">
                            {/* Select de documentos */}
                            <select
                                className="input__form__div__label"
                                value={formData.contact_fk}
                                onChange={handleInputChange}
                                name="contact_fk"
                            >
                                <option value="">Selecciona un contacto</option>
                                {contacts.map((con) => (
                                    <option key={con.id_contact} value={con.id_contact}>
                                        {con.name_contact}
                                    </option>
                                ))}
                            </select>

                            {/* Input para value_ec */}
                            <input
                                type="text"
                                className="input__form__div__input"
                                name="value_ec"
                                value={formData.value_ec}
                                onChange={handleInputChange}
                                placeholder="Escribe el valor"
                            />
                        </div>

                        {validationError && (
                            <div className="preferences__modal__error">
                                <p className='error-message my-2'>{validationError}</p>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="preferences__modal__error">
                                <p className='error-message my-2'>{errorMessage}</p>
                            </div>
                        )}

                        <div className="preferences__modal__actions">
                            <ButtonRed title="Cancelar" onClick={handleCloseModal} />
                            <ButtonBlue title="Crear Registro" type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactsAdd;
