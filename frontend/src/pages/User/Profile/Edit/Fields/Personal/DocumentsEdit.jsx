
import { useState, useEffect } from "react";
import ModalSelectInput from "../../../../../../components/Modals/Updates/ModalSelectInput";
import EditButton from "../../../../../../components/Buttons/EditButton";
import ButtonWhiteOutlineBlack from "../../../../../../components/Buttons/ButtonWhiteOutlineBlack";
import ModalAdd from "../../../../../../components/Modals/ModalAdd";
import DocumentAdd from "./Modal/DocumentAdd";
import ButtonRed from "../../../../../../components/ButtonRed";
import ModalDelete from "../../../../../../components/Modals/ModalDelete";

const DocumentsEdit = ({ documents, entity, updateProfile, permissionsData,
    isEditMode }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [isModalCreateDocumentOpen, setIsModalCreateDocumentOpen] = useState(false);

    const urlDocuments = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DOCUMENT_ACTIVES}`
    const updateDocument = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_ENTITYDOCUMENT}`

    const handleSingleEditClick = (document) => {
        setInitialData({
            id_ed: document.id_ed,
            entity_fk: entity.id_entity,
            value_ed: document.value_ed,
            document_fk: document.id_document
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
        setIdToGet(row.id_ed)
        setIsModalDeleteOpen(true)
    }

    const handleModalDeleteClose = () => {
        setIdToGet("")
        setIsModalDeleteOpen(false)
        updateProfile()
    }

    const deleteOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.D_ENTITY_DOCUMENT}`

    return (
        <>
            {documents.map((document) => (
                <div key={document.id_ed} className="input__form__div">

                    <div className="input__form__div__container">
                        <p className="input__form__div__label">{document.name_document}: </p>
                        {(isEditMode && (permissionsData.isTheSameUser || permissionsData?.isRrhh || permissionsData?.isAdmin)) ? (
                            <>
                                <EditButton handleClick={() => handleSingleEditClick(document)} />

                                <ButtonRed title={"Eliminar"} onClick={() => handleModalDeleteOpen(document)} />

                            </>
                        ) : null}
                    </div>
                    <p
                        className="input__form__div__input">
                        {document.value_ed}
                    </p>

                    {singleModalIsOpen && (
                        <ModalSelectInput
                            initialData={initialData}
                            handleCloseModal={handleSingleCloseModal}
                            urlForSelect={urlDocuments}
                            urlUpdate={updateDocument}
                            updateProfile={updateProfile}
                            selectField={{
                                name: 'document_fk',
                                placeholder: 'Seleccione un documento',
                                optionKey: 'id_document',
                                optionValue: 'id_document',
                                optionLabel: 'name_document'
                            }}
                            inputField={{
                                name: 'value_ed',
                                placeholder: 'Ingrese el documento'
                            }}
                        />
                    )}
                </div>
            ))}

            {(isEditMode && (permissionsData.isTheSameUser || permissionsData?.isRrhh || permissionsData?.isAdmin)) ? (
                <>
                    <ButtonWhiteOutlineBlack
                        title={"Agregar documento"}
                        full={true}
                        onClick={() => handleModalAddOpen()}
                    />
                </>
            ) : null}

            {isModalAddOpen && (
                <DocumentAdd
                    entityFk={entity.id_entity}
                    handleCloseModal={handleModalAddClose}
                    refreshList={updateProfile}
                />
            )}


            {isModalDeleteOpen && (
                <ModalDelete
                    handleModalDelete={handleModalDeleteClose}
                    deleteOne={deleteOne}
                    field_name={'id_ed'}
                    idToDelete={idToGet}
                    onSubmitDelete={handleModalDeleteClose}
                />
            )}

        </>
    )
}


export default DocumentsEdit