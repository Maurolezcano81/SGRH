const ButtonDisabled = ({ title, onClick }) => {
    return (
      <button disabled className={`button__disabled `} onClick={onClick}>
        {title}
      </button>
    );
  };
  
  export default ButtonDisabled;
  