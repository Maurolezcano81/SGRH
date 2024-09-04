import ButtonBlue from "../../components/ButtonBlue"

const PreferenceTitle = ({title, addButtonTitle}) =>{
    return(
        <div className="preference-title">
        <h4>{title}</h4>
        <ButtonBlue
            title={"Agregar Nuevo"}
            onClick={addButtonTitle}
        />
      </div>
    )
}

export default PreferenceTitle