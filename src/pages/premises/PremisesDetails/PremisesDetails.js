import React, { useState } from "react";
import "./PremisesDetails.css";
import "../../../styles/App.css";
import PremisesEdit from "../PremisesEdit";
import keycloak from "../../../auth/keycloak";
import { Link } from "react-router-dom";

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
  deleteShowMessage,
  action,
  deleteURL,
  reloadData,
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
  const [deleted, setDeleted] = useState(false);

  const handleEdited = (msg) => {
    setEdit(false);
    setSubmitMessage(msg);
    setTimeout(() => {
      setSubmitMessage("");
    }, 3000);

    reloadData();
  };

  const handleDelete = () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten lokal?")) {
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
          setDeleted(true);

          const msg = response.ok
            ? "Lokal został usunięty"
            : "Nie udało się usunąć lokalu...";
          setSubmitMessage(msg);
          reloadData();

          return response;
        })
        .catch((err) => {
          deleteShowMessage(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      {edit ? (
        <PremisesEdit
          premisesId={premisesId}
          data={data}
          edited={(msg) => {
            handleEdited(msg);
          }}
          return={() => {
            setEdit(false);
          }}
        />
      ) : deleted ? (
        <div className="deleted-msg">
          <h2>{submitMessage}</h2>
          <button className="action-button" onClick={() => action(-1)}>
            Powrót
          </button>
        </div>
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
              <Link
                to={{
                  pathname: "/owner-rent-new",
                  state: {
                    premisesId: premisesId,
                    premises: {
                      name: location.locationName,
                      premisesNumber: premisesNumber,
                      locationId: location.locationId,
                      premisesType: premisesType.type,
                    },
                  },
                }}
              >
                <button>Wynajmij</button>
              </Link>
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
