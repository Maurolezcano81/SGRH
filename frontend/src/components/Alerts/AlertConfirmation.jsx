import ButtonBlue from "../ButtonBlue";
import ButtonRed from "../ButtonRed";

const AlertConfirmation = (props) => {

    return (
            <div className="alert__container">
                <div className="alert__header">
                    <p>{props.message}</p>
                </div>
                <div className="alert__footer modal_delete">
                    <ButtonRed title={"Eliminar"}/>
                    <ButtonBlue title={"Cancelar"}/>
                </div>
            </div>
    )
}

export default AlertConfirmation;