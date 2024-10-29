import QuantityDismiss from "./RrhhComponents/QuantityDismiss";
import useAuth from "../../hooks/useAuth";
import ResponsiveTitle from "../../components/Titles/ResponsiveTitle";

const HomeRRHH = () => {

  const { authData } = useAuth();

  return (

    <div className="container__page ">


      <div className="container__content">
        <ResponsiveTitle
          title={"Movimientos"}
        />

        <div className="stadistics__container">
          <QuantityDismiss
            token={authData.token}
          />

          <QuantityDismiss
            token={authData.token}
          />

        </div>

      </div>


    </div>
  )
};

export default HomeRRHH;