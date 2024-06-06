import ErrorCircleAlert from '../../assets/Icons/errorCircleAlert.svg';
const AlertErrorNoAuth = (props) => {
  return (
    <div className='alert__background__white'>
      <div className="alert__container">
        <div className="alert__header">
          <img src={ErrorCircleAlert} alt="" />
        </div>
        <div className="alert__footer error__noauth">
          <p>{props.errorMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertErrorNoAuth;
