import QuantityDismiss from "./RrhhComponents/QuantityDismiss";
import useAuth from "../../hooks/useAuth";
import ResponsiveTitle from "../../components/Titles/ResponsiveTitle";
import MoveOnDepartment from "./RrhhComponents/MovementOnDepartments";
import ReasonDismiss from "./RrhhComponents/ReasonDismiss";
import QuantityForLeaves from "./RrhhComponents/QuantityForLeaves";
import QuantityForLeavesAndDepartment from "./RrhhComponents/QuantityForLeavesAndDepartment";
import { useBreadcrumbs } from "../../contexts/BreadcrumbsContext";
import { useEffect } from "react";

const HomeRRHH = () => {

  const { authData } = useAuth();
  const { updateBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
      updateBreadcrumbs([
          { name: 'Estadisticas', url: '/rrhh/inicio' },
      ]);
  }, []);
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

          <ReasonDismiss
            token={authData.token}
          />

          <MoveOnDepartment
            token={authData.token}
          />

        </div>

      </div>

      <div className="container__content">
        <ResponsiveTitle
          title={"Reportes de Licencias"}
        />

        <div className="stadistics__container">
          <QuantityForLeaves
            token={authData.token}
          />

          <QuantityForLeavesAndDepartment
            token={authData.token}
          />


        </div>



      </div>


    </div>
  )
};

export default HomeRRHH;