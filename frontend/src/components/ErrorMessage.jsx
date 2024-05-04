import ErrorTriangle from "../assets/Icons/errorTriangle.png";
const ErrorMessage = (props) => {

    return (
        <div className="error_bg">
            <div className="error__container">
                <div className="error-header">
                    <img src={ErrorTriangle} alt="" />
                </div>
                <div className="error-footer">
                    <p>{props.errorMessage}</p>
                </div>
            </div>
        </div>

    )
}

export default ErrorMessage