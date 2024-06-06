import CheckMark from '../../assets/Icons/CheckMark1.svg';
const AlertSuccesfullyBackground = (props) => {
  return (
    <div className="alert__background__black">
      <div className="alert__container">
        <div className="alert__header">
          <img src={CheckMark} alt="" />
        </div>
        <div className="alert__footer">
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertSuccesfullyBackground;
