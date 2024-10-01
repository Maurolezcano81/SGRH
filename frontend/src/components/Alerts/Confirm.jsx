
import WarningSVG from '../../assets/Icons/Warning.svg';
import ButtonBlue from '../ButtonBlue';
import ButtonWhiteOutlineBlack from '../Buttons/ButtonWhiteOutlineBlack';


const Confirm = ({ message, redirectFunction, skipFunction, buttonActionTitle, buttonSkipTitle }) => {
    return (
        <div className="alert__background__white">
            <div className="alert__container">
                <div className="alert__header">
                    <img src={WarningSVG} alt="" />
                </div>
                <div className="alert__footer">
                    <p>{message}</p>
                </div>
                <div className="alert__buttons">
                    <ButtonBlue title={buttonActionTitle} onClick={redirectFunction} />
                    <ButtonWhiteOutlineBlack title={buttonSkipTitle} onClick={skipFunction} />
                </div>
            </div>
        </div>
    );
};

export default Confirm;
