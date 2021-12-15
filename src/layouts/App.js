import "../styles/App.scss";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "../auth/keycloak";
import AppRouter from "./AppRouter";

const App = () => {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <div className="App">
        <AppRouter />
      </div>
    </ReactKeycloakProvider>
  );
};

export default App;
