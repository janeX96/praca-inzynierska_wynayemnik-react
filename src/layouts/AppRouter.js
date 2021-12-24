import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../styles/App.scss";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Home from "../pages/Home/Home";
import Owner_Premises from "../pages/premises/Owner_Premises";
import Login from "../components/Login/Login";
import { PrivateRoute } from "../utilities/PrivateRoute";
import Owner_NewPremises from "../pages/premises/Owner_NewPremises";
import Registration from "../auth/Registration/Registration";
import UserProfile from "../pages/UserProfile/UserProfile";
import Owner_Locations from "../pages/locations/Owner_Locations";
import Rent from "../pages/rent/newRent/Rent";
import roles from "../resources/roles";
import { ToastContainer } from "react-toastify";

const AppRouter = () => {
  const { initialized } = useKeycloak();
  if (!initialized) {
    return <h3>Loading ... !!!</h3>;
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
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-premises"
                  component={Owner_Premises}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-premises-new"
                  component={Owner_NewPremises}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-locations"
                  component={Owner_Locations}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-rent-new"
                  component={Rent}
                />
                <PrivateRoute
                  roles={[roles.OWNER]}
                  path="/owner-rents"
                  component={Home} //todo
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
