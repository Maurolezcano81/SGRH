const Profile = (props) =>{

    return(
        <div className="navbar__header-profile">
        <div className="navbar__profile-img">
            <img src={`${process.env.SV_IMAGE_URL}${props.avatar}`} alt="" />
            {console.log(`${process.env.SV_IMAGE_URL}${props.avatar}`)}
        </div>
        <h4>{props.name}</h4>
        <p>{props.occupation}</p>
    </div>
    )
}

export default Profile