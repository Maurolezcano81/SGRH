const ErrorMessage = ({error}) => {
  return (
    <div className="error__validation__form">
      <p className="error_validation__form-p">{error}</p>
    </div>
  );
};

export default ErrorMessage;