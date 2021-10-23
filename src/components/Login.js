import React from "react";
import { useKeycloak } from "@react-keycloak/web";

const Login = () => {
  const { keycloak, initialized } = useKeycloak();
  return (
    <div>
      {keycloak && !keycloak.authenticated && (
        <button onClick={() => keycloak.login()}>Zaloguj</button>
      )}

      {keycloak && keycloak.authenticated && (
        <button onClick={() => keycloak.logout()}>
          Wyloguj ({keycloak.tokenParsed.preferred_username})
        </button>
      )}
    </div>
  );
};

export default Login;
