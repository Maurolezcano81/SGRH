import {
    useState,
    useEffect
} from 'react';
import PersonalDetailsSection from './PersonalDetailsSection';


const CreateUser = () =>{

    const [entityData, setEntityData] = useState({});

    console.log(entityData);
    return(

        <div className="container__page">

            <PersonalDetailsSection
            setEntityData={setEntityData}
            />

        </div>
    )
}

export default CreateUser;