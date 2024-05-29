import ErrorTriangle from "../../assets/Icons/errorTriangle.png";
const ErrorMessage = (props) => {

    return (
            <div className="alert__container">
                <div className="alert__header">
                    <img src={ErrorTriangle} alt="" />
                </div>
                <div className="alert__footer">
                    <p>{props.errorMessage}</p>
                </div>
            </div>

    )
}

export default ErrorMessage;