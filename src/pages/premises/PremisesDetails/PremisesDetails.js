import React, { useState, useEffect, useCallback } from "react";
import "../../../styles/App.scss";
import PremisesEdit from "../PremisesEdit";
import { AiFillEdit } from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import { owner, admin } from "../../../resources/urls";
import { GET } from "../../../utilities/Request";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rents from "../../rent/Rents";
import RentDetails from "../../rent/RentDetails";
import Rent from "../../rent/newRent/Rent";

const PremisesDetails = ({ premisesId, action, reloadData, roles }) => {
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

  const getData = useCallback(() => {
    let urlByRole =
      roles[0] === "owner"
        ? owner.premisesDetails
        : roles[0] === "administrator"
        ? admin.premisesDetails
        : "";

    GET(`${urlByRole}${premisesId}`).then((res) => {
      if (res !== null) {
        setData(res);
        setPremises({
          name: res.location.locationName,
          premisesNumber: res.premisesNumber,
          locationId: res.location.locationId,
          premisesType: res.premisesType.type,
        });
      } else {
        toast.error("Błąd połączenia z serwerem...");
      }
    });
  }, [roles, premisesId]);

  const getRents = useCallback(() => {
    let urlByRole =
      roles[0] === "owner"
        ? owner.rent.rents
        : roles[0] === "administrator"
        ? admin.rent.rents
        : "";
    GET(`${urlByRole}${premisesId}`).then((res) => {
      setRents(res);
      res.find((rent) => {
        if (rent.state === "IN_PROGRESS") {
          setActiveRent(rent);
        }
        return rent;
      });
    });
  }, [roles, premisesId]);

  useEffect(() => {
    getData();
    getRents();
  }, [getData, getRents]);

  const handleEdited = (success) => {
    setEdit(false);
    success
      ? toast.success("Zmiany zostały zapisane")
      : toast.error("Nie udało się zapisać zmian...");

    reloadData();
    getData();
  };

  // const handleDelete = () => {
  //   if (window.confirm("Czy na pewno chcesz usunąć ten lokal?")) {
  //     PATCH(`${owner.premisesDelete}${premisesId}`)
  //       .then((response) => {
  //         deleteShowMessage(response);
  //       })
  //       .catch((err) => {
  //         console.log("Error :", err);
  //       });
  //   }
  // };

  const handleReturn = () => {
    setNewRentForm(false);
    getRents();
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
            <Rent
              premisesId={premisesId}
              premises={premises}
              roles={roles}
              handleReturn={handleReturn}
            />
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
                    Dodano: <b>{data.createdDate.split("T")[0]}</b>
                  </li>
                  <li
                    onClick={() => setShowActiveRent(true)}
                    style={{ cursor: "pointer" }}
                  >
                    Status:
                    <b
                      className={
                        activeRent === undefined
                          ? "details-container__field-avb"
                          : "details-container__field-hired"
                      }
                    >
                      {activeRent === undefined ? "dostępny" : "zajęty"}
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

                  {/* {roles[0] === "owner" && (
                    <div className="icon-container">
                      <BsTrashFill
                        className="icon-container__delete-icon"
                        onClick={handleDelete}
                      />
                      <p>Usuń</p>
                    </div>
                  )} */}
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
