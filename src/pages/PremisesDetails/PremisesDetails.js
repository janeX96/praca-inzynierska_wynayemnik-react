import React, { useState } from "react";
import "./PremisesDetails.css";
import "../../styles/App.css";
import PremisesEdit from "./PremisesEdit";

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
              <button>Usuń</button>
            </div>
          </div>
          {submitMessage && <h1 className="submit-message">{submitMessage}</h1>}
        </div>
      )}
    </>
  );
};

export default PremisesDetails;
