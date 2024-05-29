import CheckMark from "../../assets/Icons/CheckMark.png";
const AlertSuccesfully = (props) => {

    return (
            <div className="alert__container">
                <div className="alert__header">
                    <img src={CheckMark} alt="" />
                </div>
                <div className="alert__footer">
                    <p>{props.message}</p>
                </div>
            </div>
    )
}

export default AlertSuccesfully;