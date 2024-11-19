import { useLocation } from "react-router-dom";
import { useBreadcrumbs } from "../../contexts/BreadcrumbsContext";
import { useEffect, useState } from "react";
import HeaderPersonal from "./PersonalComponents/HeaderPersonal";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import SatisfactionCards from "./PersonalComponents/SatisfactionCards";
import ResponsiveTitle from "../../components/Titles/ResponsiveTitle";
import PerformanceCards from "./PersonalComponents/PerformanceCards";
import LeavesCards from "./PersonalComponents/LastLeaves";
import PreferenceTitle from "../MasterTables/PreferenceTitle";
import CapacitationCards from "./PersonalComponents/CapacitationsCards";

const HomePersonal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { updateBreadcrumbs } = useBreadcrumbs();
  const { authData } = useAuth();

  useEffect(() => {
    updateBreadcrumbs([{ name: "Portal", url: "/personal/" }]);

    if (authData) {
      setIsLoading(false);
    }

  }, [location.pathname, authData]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (


        <>
          <div className="container__page">

            <HeaderPersonal authData={authData} />

          </div>

          
          <div className="container__page">
            <PreferenceTitle
              title={"Ultimos Satisfacción"}
            />

            <SatisfactionCards
              authData={authData}
              formatDate={formatDate}
            />
          </div>

          <div className="container__page">
            <PreferenceTitle
              title={"Ultima Evaluación"}
            />

            <PerformanceCards
              authData={authData}
              formatDate={formatDate}
            />
          </div>

          <div className="container__page">
            <PreferenceTitle
              title={"Ultimas Licencias"}
            />

            <LeavesCards
              authData={authData}
              formatDate={formatDate}
            />
          </div>

          <div className="container__page">
            <PreferenceTitle
              title={"Ultimas Licencias"}
            />

            <CapacitationCards
              authData={authData}
              formatDate={formatDate}
            />
          </div>

        </>

      )}
    </>
  );
};

export default HomePersonal;
