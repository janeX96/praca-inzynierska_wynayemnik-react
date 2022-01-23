import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../styles/App.scss";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Home from "../pages/Home/Home";
import Premises from "../pages/premises/Premises";
import Login from "../components/Login/Login";
import { PrivateRoute } from "../utilities/PrivateRoute";
import Owner_NewPremises from "../pages/premises/Owner_NewPremises";
import Registration from "../auth/Registration/Registration";
import UserProfile from "../pages/UserProfile/UserProfile";
import Locations from "../pages/locations/Locations";
import Administrators from "../pages/administrators/Administrators";
import Rent from "../pages/rent/newRent/Rent";
import roles from "../resources/roles";
import { ToastContainer } from "react-toastify";
import Rents from "../pages/rent/Rents";
import Clients from "../pages/Clients";
import keycloakErr from "../images/keycloakErr.jpg";
import NotFound from "../pages/NotFound";
import keycloak from "../auth/keycloak";

const AppRouter = () => {
  const { initialized } = useKeycloak();
  const [keycloakError, setKeycloakError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeycloakError(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!initialized) {
    return keycloakError ? (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={keycloakErr}
          alt="keycloak error"
          style={{ width: "30%", margin: "auto" }}
        />
      </div>
    ) : (
      <h3>Loading keycloak...</h3>
    );
  }

  const defaultRole = () => {
    if (keycloak.hasRealmRole(roles.OWNER)) {
      return roles.OWNER;
    }

    if (keycloak.hasRealmRole(roles.ADMIN)) {
      return roles.ADMIN;
    }

    return roles.CLIENT;
  };
  const privateRoutes = [
    { roles: roles.OWNER, path: "/owner-premises", component: Premises },
    {
      roles: roles.OWNER,
      path: "/owner-premises-new",
      component: Owner_NewPremises,
    },
    { roles: roles.OWNER, path: "/owner-locations", component: Locations },
    { roles: roles.OWNER, path: "/owner-rent-new", component: Rent },
    { roles: roles.OWNER, path: "/owner-rents", component: Rents },
    {
      roles: roles.OWNER,
      path: "/owner-administrators",
      component: Administrators,
    },
    { roles: roles.OWNER, path: "/owner-clients", component: Clients },

    { roles: roles.ADMIN, path: "/admin-premises", component: Premises },
    { roles: roles.ADMIN, path: "/admin-locations", component: Locations },
    { roles: roles.ADMIN, path: "/admin-rent-new", component: Rent },
    { roles: roles.ADMIN, path: "/admin-rents", component: Rents },

    { roles: roles.CLIENT, path: "/client-rents", component: Rents },
  ];
  return (
    <>
      <Router>
        <div>
          <main>
            {<Navbar defaultRole={defaultRole} />}
            {<ToastContainer />}
            <section>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/registration" component={Registration} />
                <Route path="/user-profile" component={UserProfile} />
                {privateRoutes.map((route) => (
                  <PrivateRoute
                    key={route.path}
                    roles={[route.roles]}
                    path={route.path}
                    component={route.component}
                  />
                ))}
                <Route component={NotFound} />
              </Switch>
            </section>
          </main>
          <footer>{<Footer />}</footer>
        </div>
      </Router>
    </>
  );
};

export default AppRouter;
