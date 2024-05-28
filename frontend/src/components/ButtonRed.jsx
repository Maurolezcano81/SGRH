const ButtonRed = ({ title, onClick }) => {
    return (
      <button className="button__red" onClick={onClick}>
        {title}
      </button>
    );
  };
  
  export default ButtonRed;
  