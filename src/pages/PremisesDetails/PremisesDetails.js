import React, { useState, useEffect } from "react";
import "./PremisesDetails.css";
import "../../styles/App.css";
import PremisesEdit from "./PremisesEdit";
import keycloak from "../../auth/keycloak";

const PremisesDetails = ({
  premisesId,
  premisesNumber,
  area,
  state,
  createdDate,
  furnished,
  premisesLevel,
  premisesType,
  location,
  action,
  deleteURL,
}) => {
  const [edit, setEdit] = useState(false);
  const data = {
    premisesNumber,
    area,
    state,
    furnished,
    premisesLevel,
    premisesType,
    location,
  };

  const [submitMessage, setSubmitMessage] = useState("");

  const handleEdited = () => {
    setEdit(false);
    setSubmitMessage("Zmiany zostały zapisane");
    setTimeout(() => {
      setSubmitMessage("");
    }, 3000);
  };

  const handleDelete = () => {
    alert("Opie wiesz czo ty robisz ?");
    const requestOptions = {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json", //"application/json",
        Authorization: " Bearer " + keycloak.token,
      },
    };

    fetch(deleteURL + `${premisesId}`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));

    //powrót do listy
    action(-1);
  };

  return (
    <>
      {edit ? (
        <PremisesEdit
          premisesId={premisesId}
          data={data}
          edited={() => {
            handleEdited();
          }}
          return={() => {
            setEdit(false);
          }}
        />
      ) : (
        <div>
          <h1 className="content-title">Szczegóły lokalu</h1>
          <div className="premises-details">
            <ul>
              <li>Adres lokalu: {location.locationName}</li>
              <li>Numer lokalu: {premisesNumber}</li>
              <li>Powierzchnia (m2): {area}</li>
              <li>Rodzaj lokalu: {premisesType.type}</li>
              <li>Umeblowanie: {furnished}</li>
              <li>Poziom: {premisesLevel}</li>
              <li>Dodano: {createdDate}</li>
              <li>Status: {state}</li>
            </ul>
            <div className="details-buttons">
              <button className="return-button" onClick={() => action(-1)}>
                Powrót
              </button>
              <button>Wynajmij</button>
              <button onClick={() => setEdit(true)}>Edytuj</button>
              <button onClick={handleDelete}>Usuń</button>
            </div>
          </div>
          {submitMessage && <h1 className="submit-message">{submitMessage}</h1>}
        </div>
      )}
    </>
  );
};

export default PremisesDetails;
