import React, { useState, useEffect } from "react";
import "../../../styles/App.scss";
import PremisesEdit from "../PremisesEdit";
import { BsTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import { owner, admin } from "../../../resources/urls";
import { GET, PATCH } from "../../../utilities/Request";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rents from "../../rent/Rents";
import RentDetails from "../../rent/RentDetails";
import Rent from "../../rent/newRent/Rent";

const PremisesDetails = ({
  premisesId,
  deleteShowMessage,
  action,
  reloadData,
  roles,
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
  const [showActiveRent, setShowActiveRent] = useState(false);
  const [newRentForm, setNewRentForm] = useState(false);
  const [premises, setPremises] = useState();

  const getData = () => {
    let urlByRole =
      roles[0] === "owner"
        ? owner.premisesDetails
        : roles[0] === "admin"
        ? admin.premisesDetails
        : "";

    GET(`${urlByRole}${premisesId}`).then((res) => {
      setData(res);
      setPremises({
        name: res.location.locationName,
        premisesNumber: res.premisesNumber,
        locationId: res.location.locationId,
        premisesType: res.premisesType.type,
      });
    });
  };

  const getRents = () => {
    let urlByRole =
      roles[0] === "owner"
        ? owner.rent.rents
        : roles[0] === "admin"
        ? admin.rent.rents
        : "";
    GET(`${urlByRole}${premisesId}`).then((res) => {
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
      return (
        <Rents
          data={rents}
          premises={data}
          handleReturn={() => setShowRents(false)}
          roles={roles}
        />
      );
    } else if (showActiveRent && activeRent !== undefined) {
      return (
        <RentDetails
          rent={activeRent}
          handleReturn={() => setShowActiveRent(false)}
          roles={roles}
        />
      );
    } else {
      return (
        <>
          {newRentForm ? (
            <Rent premisesId={premisesId} premises={premises} roles={roles} />
          ) : (
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
                  <li
                    onClick={() => setShowActiveRent(true)}
                    style={{ cursor: "pointer" }}
                  >
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

                  <div
                    className="icon-container"
                    onClick={() => setNewRentForm(true)}
                  >
                    <FaKey className="icon-container__new-icon" />
                    <p>Wynajmij</p>
                  </div>

                  {roles[0] === "owner" && (
                    <div className="icon-container">
                      <AiFillEdit
                        className="icon-container__edit-icon"
                        onClick={() => setEdit(true)}
                      />
                      <p>Edycja</p>
                    </div>
                  )}

                  {roles[0] === "owner" && (
                    <div className="icon-container">
                      <BsTrashFill
                        className="icon-container__delete-icon"
                        onClick={handleDelete}
                      />
                      <p>Usuń</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      );
    }
  };

  return <>{render()}</>;
};

export default PremisesDetails;
