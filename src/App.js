import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/pages/Home';
import SignIn from './components/auth/SignIn'

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/sign-in' exact component={SignIn}/>
      </Switch>
    </Router>
     
    </>
  );
}

export default App;
