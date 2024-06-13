import ButtonBlue from '../ButtonBlue';


const ListForAdd = ({handleModalListForAdd}) => {

  return (
    <div className="alert__background__black">
      <div className="alert__container">
        <div className="modal__listforadd__item-container">
          <p>asdf</p>
          <ButtonBlue title={'+'} onClick={handleModalListForAdd} />
        </div>
      </div>
    </div>
  );
};

export default ListForAdd;