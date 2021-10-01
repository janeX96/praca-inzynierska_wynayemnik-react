import React from 'react';
import '../styles/App.css';
import '../styles/Page.css'
import { Switch, Route } from 'react-router';
import Home from '../pages/Home';

function Page() {
    return (
        <>
        <Switch>
            <Route path="/" exact component={Home}/>
        </Switch>
        </>
    )
}

export default Page
