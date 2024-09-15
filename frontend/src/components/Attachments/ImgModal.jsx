

const ImgModal = ({
    img,
    closeFunction
}) =>{


    return(
        <div className="attachment__modal" onClick={closeFunction}>
            <button className="attachment__modal__close">X</button>
            <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${img}`} alt="Error" />
        </div>
    )
}


export default ImgModal;