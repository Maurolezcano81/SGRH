import React, { useState } from 'react';
import DocumentsEdit from '../Edit/Fields/Personal/DocumentsEdit';
import NameEntity from '../Edit/Fields/Personal/NameEntity';
import LastNameEntity from '../Edit/Fields/Personal/LastNameEntity';
import DateBirth from '../Edit/Fields/Personal/DateBirth';
import Nacionality from '../Edit/Fields/Personal/Nacionality';
import Sex from '../Edit/Fields/Personal/Sex';


const PersonalData = ({ personalData, updateProfile }) => {
    const entity = personalData?.entity?.["0"];
    const documents = Object.values(personalData?.documents || {});

    if (!entity) {
        return <div>Error: No hay datos personales disponibles.</div>;
    }

    return (
        <div className="section__container">
            <div className="container__title-form">
                <h2>Datos Personales</h2>
            </div>

            <NameEntity
                entity={entity}
                updateProfile={updateProfile}
            />

            <LastNameEntity
                entity={entity}
                updateProfile={updateProfile}
            />

            <DocumentsEdit
                documents={documents}
                entity={entity}
                updateProfile={updateProfile}
            />

            <Nacionality
                entity={entity}
                updateProfile={updateProfile}
            />

            <Sex
                entity={entity}
                updateProfile={updateProfile}
            />

            <div className="input__form__div">
                <p className="input__form__div__label">Edad: </p>
                <p className="input__form__div__input">{entity.edad}</p>
            </div>

            <DateBirth
                entity={entity}
                updateProfile={updateProfile}
            />

        </div>
    );
}

export default PersonalData;
