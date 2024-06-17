import WarningSVG from '../../assets/Icons/Warning.svg';
import ButtonBlue from '../ButtonBlue';
import ButtonWhiteOutlineBlack from '../Buttons/ButtonWhiteOutlineBlack';

const Warning = ({ message, redirectFunction, skipFunction }) => {
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
          <ButtonBlue title={'Cambiar contraseña'} onClick={redirectFunction} />
          <ButtonWhiteOutlineBlack title={'Continuar de todos modos'} onClick={skipFunction} />
        </div>
      </div>
    </div>
  );
};

export default Warning;
