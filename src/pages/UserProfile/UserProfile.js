import React, { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import "../../styles/App.css";
import "./UserProfile.css";
const UserProfile = () => {
  const [user, setUser] = useState({
    data: [],
  });

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();

    return resources;
  };

  useEffect(() => {
    const getData = () => {
      getResources().then((res) => {
        //pobranie danych z wyciągniętego adresu url
        fetch(res.urls.user, {
          headers: { Authorization: " Bearer " + keycloak.token },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setUser({ data });
          })
          .catch((err) => {
            console.log("Error Reading data " + err);
          });
      });
    };
    getData();
  }, []);

  return (
    <div className="content-container">
      <h1 className="content-title">Dane użytkownika</h1>
      <div className="details">
        <ul>
          <li>Imię: {user.data.firstName}</li>
          <li>Nazwisko: {user.data.lastName}</li>
          <li>email: {user.data.email}</li>
          <li>numer tel: {user.data.phoneNumber}</li>
          <li>NIP: {user.data.NIP}</li>
          <li>
            rodzaj użytkownika:{" "}
            {user.data.isNaturalPerson ? "osoba fizyczna" : "firma"}
          </li>
          <li>fakturownia: {user.data.isFakturownia ? "tak" : "nie"}</li>
        </ul>
        <button className="edit-btn">Edytuj dane</button>
      </div>
    </div>
  );
};

export default UserProfile;
