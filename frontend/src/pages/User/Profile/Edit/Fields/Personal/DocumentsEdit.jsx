
import { useState, useEffect } from "react";
import ModalSelectInput from "../../../../../../components/Modals/Updates/ModalSelectInput";
import EditButton from "../../../../../../components/Buttons/EditButton";

const DocumentsEdit = ({ documents, entity, updateProfile, permissionsData,
    isEditMode }) => {

    const [singleModalIsOpen, setSingleModalIsOpen] = useState(false);
    const [initialData, setInitialData] = useState({});

    const urlDocuments = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DOCUMENT}`
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

    return (
        <>
            {documents.map((document) => (
                <div key={document.id_ed} className="input__form__div">

                    <div className="input__form__div__container">
                        <p className="input__form__div__label">{document.name_document}: </p>
                        {(isEditMode && (permissionsData?.isRrhh || permissionsData?.isAdmin))  ?(
                        <EditButton handleClick={handleSingleEditClick} />
                    ): null}
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
        </>
    )
}


export default DocumentsEdit