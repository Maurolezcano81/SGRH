import ErrorCircleAlert from "../../assets/Icons/errorCircleAlert.svg";
const AlertError = (props) => {

    return (
        <div className="alert__background__black__index__top__alerts">
            <div className="alert__container">
                <div className="alert__header">
                    <img src={ErrorCircleAlert} alt="" />
                </div>
                <div className="alert__footer">
                    <p>{props.errorMessage}</p>
                </div>
            </div>
        </div>

    )
}

export default AlertError;