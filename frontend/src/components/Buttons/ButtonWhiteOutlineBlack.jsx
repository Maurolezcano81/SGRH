const ButtonWhiteOutlineBlack = ({ title, onClick, full=false }) => {
    return (

      <button type="button"  className={`button__white__outline ${full === true ? "button__container__full" : ""}`} onClick={onClick}>
        {title}
      </button>
    );
  };
  
  export default ButtonWhiteOutlineBlack;
  