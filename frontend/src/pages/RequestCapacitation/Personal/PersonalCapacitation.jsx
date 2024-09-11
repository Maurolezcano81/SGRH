import { useState } from "react";
import PreferenceTitle from "../../MasterTables/PreferenceTitle";
import FormRequest from "./FormRequest";


const PersonalCapacitation = () => {

    const [toggleFormRequest, setToggleFormRequest] = useState(false) 
    console.log(toggleFormRequest)

    const handleOpenFormRequest = () =>{
        setToggleFormRequest(true)
    }

    const handleCloseFormRequest = () =>{
        setToggleFormRequest(!toggleFormRequest)
    }

    return(
        <div className="container__page">

        <PreferenceTitle
            title={"Solicitud de Capacitacion"}
            titleButton={"Solicitar Capacitación"}
            onClick={handleOpenFormRequest}
        />


            {toggleFormRequest && (
            <FormRequest
            handleCloseFormRequest={handleCloseFormRequest}
            />
            )}





        </div>
    )
}


export default PersonalCapacitation;