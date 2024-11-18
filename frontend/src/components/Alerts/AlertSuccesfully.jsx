import CheckMark from '../../assets/Icons/checkMark.svg';
const AlertSuccesfully = (props) => {
  return (
    <div className="alert__background__black__index__top__alerts">
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

export default AlertSuccesfully;
