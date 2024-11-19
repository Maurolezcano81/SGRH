
import { useState, useEffect } from "react";
import ModalSelectInput from "../../../../../../components/Modals/Updates/ModalSelectInput";
import EditButton from "../../../../../../components/Buttons/EditButton";
import ButtonWhiteOutlineBlack from "../../../../../../components/Buttons/ButtonWhiteOutlineBlack";
import ModalAdd from "../../../../../../components/Modals/ModalAdd";
import ButtonRed from "../../../../../../components/ButtonRed";
import ContactsAdd from "./Modal/ContactsAdd";
import ModalDelete from "../../../../../../components/Modals/ModalDelete";

const ContactsEdit = ({ contacts, entity, updateProfile, permissionsData,
    isEditMode }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [isModalCreateDocumentOpen, setIsModalCreateDocumentOpen] = useState(false);

    const urlDocuments = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_CONTACT_ACTIVES}`
    const updateDocument = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITY_CONTACT}`

    const handleSingleEditClick = (contact) => {
        setInitialData({
            id_ec: contact.id_ec,
            entity_fk: entity.id_entity,
            value_ec: contact.value_ec,
            contact_fk: contact.id_contact
        });
        setSingleModalIsOpen(true);
    };

    const handleSingleCloseModal = () => {
        setSingleModalIsOpen(false);
    };


    // MODAL ADD
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const handleModalAddOpen = () => {
        setIsModalAddOpen(true)
    }

    const handleModalAddClose = () => {
        setIsModalAddOpen(false)
    }

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [idToGet, setIdToGet] = useState(null)

    const handleModalDeleteOpen = (row) => {
        setIdToGet(row.id_ec)
        setIsModalDeleteOpen(true)
    }

    const handleModalDeleteClose = () => {
        setIdToGet("")
        setIsModalDeleteOpen(false)
        updateProfile()
    }

    const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_ENTITY_CONTACT}`


    return (
        <>
            {contacts.map((contact) => (
                <div key={contact.id_ec} className="input__form__div">

                    <div className="input__form__div__container">
                        <p className="input__form__div__label">{contact.name_contact}: </p>
                        {(isEditMode && (permissionsData.isTheSameUser || permissionsData?.isRrhh || permissionsData?.isAdmin)) ? (
                            <>
                                <EditButton handleClick={() => handleSingleEditClick(contact)} />

                                <ButtonRed title={"Eliminar"} onClick={() => handleModalDeleteOpen(contact)} />

                            </>
                        ) : null}
                    </div>
                    <p
                        className="input__form__div__input">
                        {contact.value_ec}
                    </p>

                    {singleModalIsOpen && (
                        <ModalSelectInput
                            initialData={initialData}
                            handleCloseModal={handleSingleCloseModal}
                            urlForSelect={urlDocuments}
                            urlUpdate={updateDocument}
                            updateProfile={updateProfile}
                            selectField={{
                                name: 'contact_fk',
                                placeholder: 'Seleccione un contacto',
                                optionKey: 'id_contact',
                                optionValue: 'id_contact',
                                optionLabel: 'name_contact'
                            }}
                            inputField={{
                                name: 'value_ec',
                                placeholder: 'Ingrese el contacto'
                            }}
                        />
                    )}
                </div>
            ))}

            {(isEditMode && (permissionsData.isTheSameUser || permissionsData?.isRrhh || permissionsData?.isAdmin)) ? (
                <>
                    <ButtonWhiteOutlineBlack
                        title={"Agregar contacto"}
                        full={true}
                        onClick={() => handleModalAddOpen()}
                    />
                </>
            ) : null}

            {isModalAddOpen && (
                <ContactsAdd
                    entityFk={entity.id_entity}
                    handleCloseModal={handleModalAddClose}
                    refreshList={updateProfile}
                />
            )}


            {isModalDeleteOpen && (
                <ModalDelete
                    handleModalDelete={handleModalDeleteClose}
                    deleteOne={deleteOne}
                    field_name={'id_ec'}
                    idToDelete={idToGet}
                    onSubmitDelete={handleModalDeleteClose}
                />
            )}
        </>
    )
}


export default ContactsEdit