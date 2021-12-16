import React, { useState } from "react";
import "../../../styles/App.scss";
import PremisesEdit from "../PremisesEdit";
import { Link } from "react-router-dom";
import { BsTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import { owner } from "../../../resources/urls";
import { PATCH } from "../../../utilities/Request";

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
      PATCH(`${owner.premisesDelete}${premisesId}`)
        .then((response) => {
          setDeleted(true);
          const msg = response
            ? "Lokal został usunięty"
            : "Nie udało się usunąć lokalu...";
          setSubmitMessage(msg);
          reloadData();
        })
        .catch((err) => {
          deleteShowMessage(false);
          console.log("Error :", err);
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
        <>
          <h1 className="content-container__title">Szczegóły lokalu</h1>
          <div className="details-container">
            <ul>
              <li>
                Adres lokalu: <b>{location.locationName}</b>
              </li>
              <li>
                Numer lokalu: <b>{premisesNumber}</b>
              </li>
              <li>
                Powierzchnia (m2): <b>{area}</b>
              </li>
              <li>
                Rodzaj lokalu: <b>{premisesType.type}</b>
              </li>
              <li>
                Umeblowanie: <b>{furnished}</b>
              </li>
              <li>
                Poziom: <b>{premisesLevel}</b>
              </li>
              <li>
                Dodano: <b>{createdDate}</b>
              </li>
              <li>
                Status: <b>{state}</b>
              </li>
            </ul>
            <div className="details-container__buttons">
              <button
                className="details-container__button--return"
                onClick={() => action(-1)}
              >
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
                <div className="icon-container">
                  <FaKey className="icon-container__new-icon" />
                  <p>Wynajmij</p>
                </div>
              </Link>

              <div className="icon-container">
                <AiFillEdit
                  className="icon-container__edit-icon"
                  onClick={() => setEdit(true)}
                />
                <p>Edycja</p>
              </div>
              <div className="icon-container">
                <BsTrashFill
                  className="icon-container__delete-icon"
                  onClick={handleDelete}
                />
                <p>Usuń</p>
              </div>
            </div>
          </div>
          {submitMessage && <h1 className="submit-message">{submitMessage}</h1>}
        </>
      )}
    </>
  );
};

export default PremisesDetails;
