import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import "./Login.css";
import { useHistory } from "react-router-dom";

const Login = () => {
  const { keycloak, initialized } = useKeycloak();

  const history = useHistory();

  const logout = () => {
    let path = `/`;
    history.push(path);
    keycloak.logout();
  };

  return (
    <div>
      {keycloak && !keycloak.authenticated && (
        <a onClick={() => keycloak.login()}>Logowanie</a>
      )}

      {keycloak && keycloak.authenticated && (
        <a onClick={() => logout()}>Wyloguj</a>
      )}
    </div>
  );
};

export default Login;
