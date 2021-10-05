import Navbar from './Navbar';
import '../styles/App.css';
import Footer from './Footer';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import AppRouter from './AppRouter';

const App = () => {

    return (
      <ReactKeycloakProvider authClient={keycloak}>
        <div className="App">
          <AppRouter/>    
        </div>
      </ReactKeycloakProvider>
    )
}

export default App;
