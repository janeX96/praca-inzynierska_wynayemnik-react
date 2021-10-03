import React from 'react';
import '../styles/App.css';
import '../styles/Page.css'
import { Switch, Route } from 'react-router';
import Home from '../pages/Home';
import Owner from '../pages/Owner'

function Page() {
    return (
        <>
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/owner-premises" exact component={Owner}/>
        </Switch>
        </>
    )
}

export default Page
