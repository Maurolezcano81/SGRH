import { useLocation } from "react-router-dom";
import { useBreadcrumbs } from "../../contexts/BreadcrumbsContext";
import { useEffect } from "react";

const HomePersonal = () => {

  const location = useLocation();
  const { updateBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    updateBreadcrumbs([
      { name: 'Portal', url: '/personal/' },

    ]);
  }, [location.pathname]);

  return <>HOLA PERSONAL</>;
};

export default HomePersonal;