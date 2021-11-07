import React from "react";
import Login from "../../components/Login/Login";
import "./Registration.css";
const RegistrationComplete = () => {
  return (
    <div className="confirm-container">
      <h1>Rejestracja przebiegła pomyślnie</h1>
      <a>
        <Login />
      </a>
    </div>
  );
};

export default RegistrationComplete;
