import React, { useState } from 'react';
import DocumentsEdit from '../Edit/Fields/Personal/DocumentsEdit';
import NameEntity from '../Edit/Fields/Personal/NameEntity';
import LastNameEntity from '../Edit/Fields/Personal/LastNameEntity';
import DateBirth from '../Edit/Fields/Personal/DateBirth';
import Nacionality from '../Edit/Fields/Personal/Nacionality';
import Sex from '../Edit/Fields/Personal/Sex';
import ContactsEdit from '../Edit/Fields/Personal/ContactsEdit';


const PersonalData = ({ personalData, updateProfile, permissionsData,
    isEditMode }) => {
    const entity = personalData?.entity?.["0"];
    const documents = Object.values(personalData?.documents || {});
    const contacts = Object.values(personalData?.contact || {});
    if (!entity) {
        return <div>No se han podido recuperar estos datos.</div>;
    }


    return (
        <div className="section__container">
            <div className="container__title-form">
                <h2>Datos Personales</h2>
            </div>

            <NameEntity
                entity={entity}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <LastNameEntity
                entity={entity}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <DocumentsEdit
                documents={documents}
                entity={entity}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <Nacionality
                entity={entity}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <Sex
                entity={entity}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <ContactsEdit
                contacts={contacts}
                entity={entity}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

            <div className="input__form__div">
                <p className="input__form__div__label">Edad: </p>
                <p className="input__form__div__input">{entity.edad}</p>
            </div>

            <DateBirth
                entity={entity}
                updateProfile={updateProfile}
                permissionsData={permissionsData}
                isEditMode={isEditMode}
            />

        </div>
    );
}

export default PersonalData;
