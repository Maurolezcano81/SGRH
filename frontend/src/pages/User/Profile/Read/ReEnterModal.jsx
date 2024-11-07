

import { useState, useEffect } from 'react';
import ErrorMessage from '../../../../components/Alerts/ErrorMessage';
import ButtonBlue from '../../../../components/ButtonBlue';
import ButtonRed from '../../../../components/ButtonRed';
import useAuth from '../../../../hooks/useAuth';
import ButtonWhiteOutlineBlack from '../../../../components/Buttons/ButtonWhiteOutlineBlack';
const ReEnterModal = ({
    backButtonAction,
    idEmployee,
    onSubmitDeleteAction,
    messageToDelete = "¿Quieres eliminar este registro? Al aceptar no se puede recuperar la informacion",
    textButtonRed = "Eliminar",
    updateProfile,
    lastTerminationId
}) => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { authData } = useAuth();

    const handleSubmit = async () => {
        try {
            const fetchResponse = await fetch(reEnterUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({
                    idEmployee: idEmployee,
                    lastTerminationId: lastTerminationId
                }),
            });

            const dataFormatted = await fetchResponse.json();

            if (!fetchResponse.ok) {
                return setErrorMessage(dataFormatted.message);
            }

            if (fetchResponse.status != 200) {
                return setErrorMessage(dataFormatted.message);
            }

            setSuccessMessage(dataFormatted.message);
            onSubmitDeleteAction();
            updateProfile()
        } catch (error) {
            console.log('catch' + error.message);
        }
    };


    const reEnterUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_REENTER_TERMINATION}`

    return (
        <div className="alert__background__black">
            <div className="alert__container">

                <div className="alert__header modal__delete">
                    <p>{messageToDelete}</p>
                </div>

                <div className="modal__delete__message ">
                    {successMessage && successMessage.length > 0 && <div className="success-message">{successMessage}</div>}
                    {errorMessage && errorMessage.length > 0 && <div className="error-message">{errorMessage}</div>}
                </div>

                <div className="alert__footer modal__delete">
                    <ButtonBlue onClick={handleSubmit} title={textButtonRed} />
                    <ButtonWhiteOutlineBlack onClick={() => backButtonAction()} title={'Volver'} />
                </div>
            </div>
        </div>
    );
};

export default ReEnterModal;
