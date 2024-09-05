const ButtonBlue = ({ title, onClick, color="blue" }) => {
  return (
    <button className={`button_blue ${color}`} onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonBlue;
