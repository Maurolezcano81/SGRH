const Profile = (props) =>{

    return(
        <div className="navbar__header-profile">
        <div className="navbar__profile-img">
            <img src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${props.avatar}`} alt="" />
        </div>
        <h4>{props.name}</h4>
        <p>{props.occupation}</p>
    </div>
    )
}

export default Profile