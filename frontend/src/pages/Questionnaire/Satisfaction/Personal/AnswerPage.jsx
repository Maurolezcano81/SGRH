import useAuth from "../../../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PreferenceTitle from "../../../MasterTables/PreferenceTitle";
import AnswerHeader from "./AnswerHeader";
import AnswerBody from "./AnswerBody";

const AnswerPage = () => {

    const { authData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();


    const { sq } = location.state || {}

    return (

        <div className="container__page">

<PreferenceTitle title={"Responder Cuestionario"} />

            <AnswerHeader
                sq={sq}
            />

            <AnswerBody
                sq={sq}
            />

        </div>

    )
}

export default AnswerPage;