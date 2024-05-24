import ButtonBlue from "../../../components/ButtonBlue"

const PreferenceTitle = (props) =>{
    return(
        <div className="preference-title">
        <h4>{props.title}</h4>
        <ButtonBlue
            title={"Agregar Nuevo"}
            onClick={props.handleModalAdd}
        />
      </div>
    )
}

export default PreferenceTitle