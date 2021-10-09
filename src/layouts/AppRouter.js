import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from '../pages/Home';
import Owner from '../pages/Owner';
import Login from '../components/Login';
import { PrivateRoute } from '../utilities/PrivateRoute';

const AppRouter = () => {
    const {initialized}= useKeycloak();
    if (!initialized) {
        return <h3>Loading ... !!!</h3>;
    }

    return (
    <>
      <Router>
        <div>
            <main>
                {<Navbar/>}
                <section>
                    <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/login" exact component={Login}/>
                    <PrivateRoute roles={['owner']} path="/owner-premises" component={Owner}/>
                    </Switch>
                </section>
            </main>
            <footer>
            {<Footer/>}
            </footer>
        </div>
      </Router>
    </>
    );
};

export default AppRouter;