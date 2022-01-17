import React from "react";
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
import { useEffect, useState } from "react";
import keycloakErr from "../images/keycloakErr.jpg";
import NotFound from "../pages/NotFound";

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

  return (
    <>
      <Router>
        <div>
          <main>
            {<Navbar />}
            {<ToastContainer />}
            <section>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/registration" component={Registration} />
                <Route path="/user-profile" component={UserProfile} />
                {/* for owner */}
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-premises"
                  component={Premises}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-premises-new"
                  component={Owner_NewPremises}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-locations"
                  component={Locations}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-rent-new"
                  component={Rent}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-rents"
                  component={Rents}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-administrators"
                  component={Administrators}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-clients"
                  component={Clients}
                />
                {/* for admin */}
                <PrivateRoute
                  roles={[roles.ADMIN]}
                  path="/admin-premises"
                  component={Premises}
                />
                <PrivateRoute
                  roles={[roles.ADMIN]}
                  path="/admin-locations"
                  component={Locations}
                />
                <PrivateRoute
                  roles={[roles.ADMIN]}
                  path="/admin-rent-new"
                  component={Rent}
                />
                <PrivateRoute
                  roles={[roles.ADMIN]}
                  path="/admin-rents"
                  component={Rents}
                />
                {/* for client */}
                <PrivateRoute
                  roles={[roles.CLIENT]}
                  path="/client-rents"
                  component={Rents}
                />
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
