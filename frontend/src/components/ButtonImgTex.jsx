const ButtonImgTxt = ({ title, onClick, img, color }) => {
  return (
    <button className={`button__img__text`} onClick={onClick}>
      <div className={`img__round ${color}`}>
        <img src={img} alt={title} />
      </div>
      <p>{title}</p>
    </button>
  );
};

export default ButtonImgTxt;
