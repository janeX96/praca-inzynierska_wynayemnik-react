import React, { useState, useEffect } from "react";
import "../../../styles/App.scss";
import PremisesEdit from "../PremisesEdit";
import { Link } from "react-router-dom";
import { BsTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import { owner } from "../../../resources/urls";
import { GET, PATCH } from "../../../utilities/Request";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rents from "../../rent/Rents";

const PremisesDetails = ({
  premisesId,
  deleteShowMessage,
  action,
  reloadData,
}) => {
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({
    premisesId: 0,
    premisesNumber: "",
    area: 0,
    premisesLevel: "",
    state: "",
    createdDate: "",
    premisesType: {
      premisesTypeId: 0,
      type: "",
    },
    location: {
      locationId: 0,
      locationName: "",
      address: {
        addressId: 0,
        street: "",
        postCode: "",
        city: "",
        streetNumber: "",
      },
    },
    furnished: false,
  });
  const [rents, setRents] = useState([]);
  const [activeRent, setActiveRent] = useState();
  const [showRents, setShowRents] = useState(false);

  const getData = () => {
    GET(`${owner.premisesDetails}${premisesId}`).then((res) => {
      setData(res);
    });
  };

  const getRents = () => {
    GET(`${owner.rents}${premisesId}`).then((res) => {
      setRents(res);
      res.find((rent) => {
        if (rent.state === "IN_PROGRESS") {
          setActiveRent(rent);
        }
      });
    });
  };

  useEffect(() => {
    getData();
    getRents();
  }, []);

  const handleEdited = (success) => {
    setEdit(false);
    success
      ? toast.success("Zmiany zostały zapisane")
      : toast.error("Nie udało się zapisać zmian...");

    reloadData();
    getData();
  };

  const handleDelete = () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten lokal?")) {
      PATCH(`${owner.premisesDelete}${premisesId}`)
        .then((response) => {
          deleteShowMessage(response);
        })
        .catch((err) => {
          console.log("Error :", err);
        });
    }
  };

  const render = () => {
    if (edit) {
      return (
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
      );
    } else if (showRents) {
      return <Rents data={rents} handleReturn={() => setShowRents(false)} />;
    } else {
      return (
        <>
          <h1 className="content-container__title">Szczegóły lokalu</h1>
          <div className="details-container">
            <ul>
              <li>
                Adres lokalu: <b>{data.location.locationName}</b>
              </li>
              <li>
                Numer lokalu: <b>{data.premisesNumber}</b>
              </li>
              <li>
                Powierzchnia (m2): <b>{data.area}</b>
              </li>
              <li>
                Rodzaj lokalu: <b>{data.premisesType.type}</b>
              </li>
              <li>
                Umeblowanie: <b>{data.furnished}</b>
              </li>
              <li>
                Poziom: <b>{data.premisesLevel}</b>
              </li>
              <li>
                Dodano: <b>{data.createdDate}</b>
              </li>
              <li>
                Status:
                <b
                  className={
                    data.state === "AVAILABLE"
                      ? "details-container__field-avb"
                      : "details-container__field-hired"
                  }
                >
                  {data.state === "AVAILABLE" ? "dostępny" : "zajęty"}
                </b>
              </li>
              <li
                className="details-container__history"
                onClick={() => setShowRents(true)}
              >
                <b>Historia wynajmów</b>
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
                      name: data.location.locationName,
                      premisesNumber: data.premisesNumber,
                      locationId: data.location.locationId,
                      premisesType: data.premisesType.type,
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
        </>
      );
    }
  };

  return <>{render()}</>;
};

export default PremisesDetails;
