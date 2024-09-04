const ButtonEditable = ({ title, onClick, color }) => {
    return (
      <button className={`button__editable ${color}`} onClick={onClick}>
        {title}
      </button>
    );
  };
  
  export default ButtonEditable;
  