import React from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";
import keycloak from "../../auth/keycloak";

const Login = () => {
  const history = useHistory();

  const logout = () => {
    let path = `/`;
    history.push(path);
    keycloak.logout();
  };

  return (
    <div>
      {keycloak && !keycloak.authenticated && (
        <p onClick={() => keycloak.login()}>Logowanie</p>
      )}

      {keycloak && keycloak.authenticated && (
        <p onClick={() => logout()}>Wyloguj</p>
      )}
    </div>
  );
};

export default Login;
