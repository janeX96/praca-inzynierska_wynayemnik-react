import React, { useState } from "react";
import "./PremisesDetails.css";
import "../../styles/App.css";

const PremisesDetails = ({
  premisesNumber,
  area,
  state,
  createdDate,
  isFurnished,
  premisesLevel,
  premisesType,
  location,
  action,
}) => {
  return (
    <>
      <h1 className="content-title">Szczegóły lokalu</h1>
      <div className="premises-details">
        <ul>
          <li>Adres lokalu: {location.locationName}</li>
          <li>Numer lokalu: {premisesNumber}</li>
          <li>Powierzchnia (m2): {area}</li>
          <li>Rodzaj lokalu: {premisesType.type}</li>
          <li>Umeblowanie: {isFurnished}</li>
          <li>Poziom: {premisesLevel}</li>
          <li>Dodano: {createdDate}</li>
          <li>Status: {state}</li>
        </ul>
        <div className="details-buttons">
          <button className="return-button" onClick={() => action(-1)}>
            Powrót
          </button>
          <button>Wynajmij</button>
          <button>Edytuj</button>
          <button>Usuń</button>
        </div>
      </div>
    </>
  );
};

export default PremisesDetails;
