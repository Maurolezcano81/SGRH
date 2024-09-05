import ButtonBlue from "../../components/ButtonBlue"

const PreferenceTitle = ({title, addButtonTitle, titleButton}) =>{
    return(
        <div className="preference-title">
        <h4>{title}</h4>
        <ButtonBlue
            title={titleButton || "Agregar Nuevo"}
            onClick={addButtonTitle}
        />
      </div>
    )
}

export default PreferenceTitle