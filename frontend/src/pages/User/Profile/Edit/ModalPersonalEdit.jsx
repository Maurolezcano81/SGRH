import React, { useEffect, useState } from 'react';
import ButtonBlue from '../../../../components/ButtonBlue';
import ButtonRed from '../../../../components/ButtonRed';
import useAuth from '../../../../hooks/useAuth';

const ModalPersonalEdit = ({ entity }) => {
    const { authData } = useAuth();

    const [dataToUpdate, setDataToUpdate] = useState({ ...initialData });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataToUpdate((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos enviados:', dataToUpdate);
    };

    
    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="alert__background__black" onClick={handleCloseModal}>
            <div className="preferences__modal__container" onClick={(e) => e.stopPropagation()}>
                <div className="preferences__modal__content">
                    <h2>Editar Datos Personales</h2>
                    <form className="preferences__modal__content-update" onSubmit={handleSubmit}>
                        <div className="input__form__div">
                            <label className='input__form__div__label'>Nombre:</label>
                            <input
                                className='input__form__div__input'
                                type="text"
                                name="name_entity"
                                value={entity?.name_entity || ''}
                                onChange={handleInputChange}
                                placeholder="Nombre"
                            />
                        </div>
                        <div className="input__form__div">
                            <label className='input__form__div__label'>Apellido:</label>
                            <input
                                className='input__form__div__input'
                                type="text"
                                name="lastname_entity"
                                value={entity?.lastname_entity || ''}
                                onChange={handleInputChange}
                                placeholder="Apellido"
                            />
                        </div>

                        <div className="input__form__div">
                            <label className='input__form__div__label'>Fecha de nacimiento:</label>
                            <input
                                className='input__form__div__input'
                                type="date"
                                name="date_birth_entity"
                                value={entity?.date_birth_entity ? new Date(entity.date_birth_entity).toISOString().split('T')[0] : ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="preferences__modal__actions">
                            <ButtonRed title="Cancelar" onClick={handleCloseModal} />
                            <ButtonBlue title="Guardar Cambios" type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalPersonalEdit;
