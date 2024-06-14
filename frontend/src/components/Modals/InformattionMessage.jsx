import ButtonBlue from "../ButtonBlue";

const InformattionMessage = ({message, closeModal}) => {
  return (
    <div className="alert__background__black">
      <div className="alert__container">
        <div className="alert__header">
          <p>{message}</p>
        </div>
        <div className="alert__footer">
            <ButtonBlue title={"Continuar"} onClick={closeModal}/>
        </div>
      </div>
    </div>
  );
};

export default InformattionMessage;
