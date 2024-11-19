import React, { useEffect, useState } from 'react';
import ButtonBlue from '../../../../../../../components/ButtonBlue';
import ButtonRed from '../../../../../../../components/ButtonRed';
import useAuth from '../../../../../../../hooks/useAuth';

const DocumentAdd = ({ entityFk, handleCloseModal, refreshList }) => {
    const [formData, setFormData] = useState({
        entity_fk: entityFk, // Valor fijo proporcionado por las props
        value_ed: '',
        document_fk: '', // Se llenará con el ID del documento seleccionado
    });
    const [documents, setDocuments] = useState([]); // Opciones para el select
    const [errorMessage, setErrorMessage] = useState('');
    const [validationError, setValidationError] = useState('');

    const { authData } = useAuth();

    const urlForSelect = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DOCUMENT_ACTIVES}`;
    const urlCreate = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_ENTITY_DOCUMENT}`;

    useEffect(() => {
        const fetchDocuments = async () => {
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

        fetchDocuments();
    }, [authData.token, urlForSelect]);

    const validationRules = {
        1: { regex: /^[A-Z0-9]{9}$/, message: 'El pasaporte debe tener 9 caracteres alfanuméricos.' },
        2: { regex: /^[0-9]{8}$/, message: 'El DNI debe tener 8 dígitos numéricos.' },
        3: { regex: /^[A-Z0-9]{6,10}$/, message: 'La licencia de conducir debe tener entre 6 y 10 caracteres alfanuméricos.' },
        4: { regex: /^[A-Z0-9]{8,12}$/, message: 'La cédula de identidad debe tener entre 8 y 12 caracteres alfanuméricos.' },
        5: { regex: /^.{1,}$/, message: 'El certificado de nacimiento no puede estar vacío.' },
        6: { regex: /^[A-Z0-9]{7,10}$/, message: 'La visa de trabajo debe tener entre 7 y 10 caracteres alfanuméricos.' },
        7: { regex: /^[A-Z0-9]{8,12}$/, message: 'El permiso de residencia debe tener entre 8 y 12 caracteres alfanuméricos.' },
        8: { regex: /^[A-Z0-9]{9,15}$/, message: 'La tarjeta de seguro social debe tener entre 9 y 15 caracteres alfanuméricos.' },
        9: { regex: /^[A-Z0-9]{8,12}$/, message: 'El carnet de extranjería debe tener entre 8 y 12 caracteres alfanuméricos.' },
        10: { regex: /^.{1,}$/, message: 'El certificado de matrimonio no puede estar vacío.' },
        11: { regex: /^.{1,}$/, message: 'El documento de prueba no puede estar vacío.' },
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));

        if (name === 'value_ed') {
            const rule = validationRules[formData.document_fk];
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
        const rule = validationRules[formData.document_fk];
        if (rule && !rule.regex.test(formData.value_ed)) {
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
                                value={formData.document_fk}
                                onChange={handleInputChange}
                                name="document_fk"
                            >
                                <option value="">Selecciona un documento</option>
                                {documents.map((doc) => (
                                    <option key={doc.id_document} value={doc.id_document}>
                                        {doc.name_document}
                                    </option>
                                ))}
                            </select>

                            {/* Input para value_ed */}
                            <input
                                type="text"
                                className="input__form__div__input"
                                name="value_ed"
                                value={formData.value_ed}
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

export default DocumentAdd;
