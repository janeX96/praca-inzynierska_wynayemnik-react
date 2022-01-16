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

const AppRouter = () => {
  const { initialized } = useKeycloak();
  if (!initialized) {
    return <h3>Loading keycloak...</h3>;
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
