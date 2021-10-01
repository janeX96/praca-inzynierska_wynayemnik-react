import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from '../pages/Home';
import SignIn from '../auth/SignIn'
import Navbar from './Navbar';
import '../styles/App.css';
import Page from './Page';
import Footer from './Footer';


function App() {
  return (
    <Router>
      <div>
        <main>
           {<Navbar/>}
           <section>
             {<Page/>}
           </section>
        </main>
        <footer>
           {<Footer/>}
        </footer>
      </div>
    </Router>
  );
}

export default App;
