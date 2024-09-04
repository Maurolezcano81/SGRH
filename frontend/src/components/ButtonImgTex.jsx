const ButtonImgTxt = ({ title, onClick, img, color }) => {
    return (
      <button className={`button__img__text`} onClick={onClick}>
        <img className={`${color}`} src={img} alt={title} />
        <p>{title}</p>
      </button>
    );
  };
  
  export default ButtonImgTxt;
  