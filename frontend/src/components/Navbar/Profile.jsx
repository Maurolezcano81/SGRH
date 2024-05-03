const Profile = (props) =>{

    return(
        <div className="navbar__header-profile">
        <div className="navbar__profile-img">
            <img src={props.avatar} alt="" />
        </div>
        <h4>{props.name}</h4>
        <p>{props.occupation}</p>
    </div>
    )
}

export default Profile