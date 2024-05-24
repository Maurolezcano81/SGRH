const ButtonBlue = ({ title, onClick }) => {
  return (
    <button className="button__blue" onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonBlue;
