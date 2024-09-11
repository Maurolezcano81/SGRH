const ButtonRed = ({ title, onClick }) => {
    return (
      <button type="button" className="button__red" onClick={onClick}>
        {title}
      </button>
    );
  };
  
  export default ButtonRed;
  