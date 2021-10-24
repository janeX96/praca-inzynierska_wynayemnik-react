import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import "./Login.css";

const Login = () => {
  const { keycloak, initialized } = useKeycloak();
  return (
    <div>
      {keycloak && !keycloak.authenticated && (
        <a onClick={() => keycloak.login()}>Logowanie</a>
      )}

      {keycloak && keycloak.authenticated && (
        <a onClick={() => keycloak.logout()}>Wyloguj</a>
      )}
    </div>
  );
};

export default Login;
