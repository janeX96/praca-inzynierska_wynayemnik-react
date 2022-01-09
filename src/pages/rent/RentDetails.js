import { useState, useEffect } from "react";
import { BsTrashFill } from "react-icons/bs";
import { ImCancelCircle } from "react-icons/im";
import { toast } from "react-toastify";
import { owner, admin, client, general } from "../../resources/urls";
import { GET, PATCH } from "../../utilities/Request";
import BailsForRent from "./BailsForRent";
import PaymentsForRent from "./PaymentsForRent";
import ProductsForRentDetails from "./ProductsForRentDetails";

const RentDetails = (props) => {
  const [rent, setRent] = useState();
  const [payments, setPayments] = useState();
  const [showProducts, setShowProducts] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showBails, setShowBails] = useState(false);
  const [sumOfBails, setSumOfBails] = useState(0);

  const getData = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.details
        : props.roles[0] === "admin"
        ? admin.rent.details
        : props.roles[0] === "client"
        ? client.rent.details
        : "";
    GET(`${urlByRole}${props.rentId}`).then((res) => {
      setRent(res);
    });
  };
  const getPayments = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.payments
        : props.roles[0] === "admin"
        ? admin.rent.payments
        : props.roles[0] === "client"
        ? client.rent.payments
        : "";
    GET(`${urlByRole}${props.rentId}${general.rent.paymentsSuffix}`).then(
      (res) => {
        setPayments(res);
      }
    );
  };

  const getSumOfBails = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.sumOfBails
        : props.roles[0] === "admin"
        ? admin.rent.sumOfBails
        : "";
    GET(`${urlByRole}${props.rentId}`).then((res) => {
      setSumOfBails(res);
    });
  };

  const handleReturn = () => {
    setShowProducts(false);
    setShowPayments(false);
    setShowBails(false);
    getSumOfBails();
  };

  useEffect(() => {
    if (props.rent !== undefined) {
      setRent(props.rent);
    } else {
      getData();
    }
    getPayments();
    getSumOfBails();
  }, [showPayments, showProducts]);

  const handleChangeAccess = () => {
    if (
      window.confirm(
        "Czy na pewno chcesz zmienić uprawnienia temu użytkownikowi?"
      )
    ) {
      let urlByRole =
        props.roles[0] === "owner"
          ? owner.rent.changeUserAccess
          : props.roles[0] === "admin"
          ? admin.rent.changeUserAccess
          : "";
      PATCH(`${urlByRole}${rent.rentId}`)
        .then((res) => {
          if (res) {
            toast.success("Zmieniono uprawienia użytkownikowi");
          } else {
            toast.error("Nie udało się zmienić uprawień...");
          }
          return res;
        })
        .then((res) => {
          getData();
        });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten wynajem?")) {
      let urlByRole =
        props.roles[0] === "owner"
          ? owner.rent.deleteRent
          : props.roles[0] === "admin"
          ? admin.rent.deleteRent
          : "";
      PATCH(`${urlByRole}${rent.rentId}`).then((res) => {
        if (res) {
          toast.success("Wynajem został usunięty");
          props.handleReturn();
        } else {
          toast.error("Nie udało się usunąć wynajmu...");
        }
        return res;
      });
    }
  };

  const handleCancelRent = () => {
    if (window.confirm("Czy na pewno chcesz anulować ten wynajem?")) {
      let urlByRole =
        props.roles[0] === "owner"
          ? owner.rent.cancelRent
          : props.roles[0] === "admin"
          ? admin.rent.cancelRent
          : "";
      PATCH(`${urlByRole}${rent.rentId}`).then((res) => {
        if (res) {
          toast.success("Wynajem został anulowany");
          getData();
          // props.handleReturn();
        } else {
          toast.error("Nie udało się anulować wynajmu...");
        }
        return res;
      });
    }
  };

  const renderDetails = () => {
    if (rent !== undefined) {
      return (
        <>
          <ul>
            <li>
              Lokal:
              <ul>
                <li>
                  <b>
                    {rent.premises.location.locationName},
                    {rent.premises.location.address.streetNumber}
                  </b>
                </li>
                <li>
                  Nr lokalu: <b>{rent.premises.premisesNumber}</b>
                </li>
              </ul>
            </li>
            <br />
            <li>
              Rodzaj wynajmu: <b>{rent.premisesType.type}</b>
            </li>
            <li>
              Rozpoczęcie: <b>{rent.startDate}</b>
            </li>
            <li>
              Zakończenie: <b>{rent.endDate}</b>
            </li>
            <li>
              Stan: <b>{rent.state}</b>
            </li>
            <li>
              Najemca:{" "}
              <b>
                {rent.userAccount.firstName} {rent.userAccount.lastName}, email:{" "}
                {rent.userAccount.email}, tel: {rent.userAccount.phoneNumber}
              </b>
            </li>
            <li>
              Opis: <b>{rent.description}</b>
            </li>
            <li>
              Czynsz: <b>{rent.rentValue} zł</b>
            </li>

            <li style={{ borderStyle: "groove", marginRight: "70%" }}>
              Kaucja: <b>{rent.bailValue} zł</b>
              <br />
              Wpłacono: <b>{sumOfBails} zł</b>
            </li>

            <li>
              Płatne do: <b>{rent.paymentDay}</b> dnia miesiąca
            </li>
            <li>
              Nr rejestracyjny: <b>{rent.carNumber}</b>
            </li>
            {(props.roles[0] === "owner" || props.roles[0] === "admin") && (
              <li>
                Dostępne dla klienta:{" "}
                <b
                  className="details-container__history"
                  onClick={handleChangeAccess}
                >
                  {rent.clientAccess ? "tak" : "nie"}
                </b>
              </li>
            )}
            <li>
              Liczniki dostepne dla klienta:{" "}
              <b>{rent.counterMediaRent ? "tak" : "nie"}</b>
            </li>
            {rent.paymentValues.length > 0 ? (
              <li>
                paymentValues:
                <ul>
                  {rent.paymentValues.map((p) => (
                    <li>
                      <b>{p}</b>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              ""
            )}

            {rent.cancelledDate !== null ? (
              <li>
                Usunięto: <b>{rent.cancelledDate}</b>
              </li>
            ) : (
              ""
            )}

            {(props.roles[0] === "owner" || props.roles[0] === "admin") && (
              <>
                <li style={{ marginRight: "80%" }}>
                  <h3
                    className="details-container__history"
                    onClick={() => setShowProducts(true)}
                  >
                    Produkty
                  </h3>
                </li>
                <li style={{ marginRight: "80%" }}>
                  <h3
                    className="details-container__history"
                    onClick={() => setShowPayments(true)}
                  >
                    Płatności
                  </h3>
                </li>
                <li style={{ marginRight: "80%" }}>
                  <h3
                    className="details-container__history"
                    onClick={() => setShowBails(true)}
                  >
                    Kaucje
                  </h3>
                </li>
              </>
            )}
          </ul>
        </>
      );
    } else {
      return <p>...</p>;
    }
  };

  return (
    <>
      {showProducts ? (
        <ProductsForRentDetails
          roles={props.roles}
          rentId={rent.rentId}
          handleReturn={handleReturn}
          payments={payments}
        />
      ) : showPayments ? (
        <PaymentsForRent
          roles={props.roles}
          rentId={rent.rentId}
          handleReturn={handleReturn}
          payments={payments}
          reloadPayments={getPayments}
        />
      ) : showBails ? (
        <BailsForRent
          roles={props.roles}
          rentId={rent.rentId}
          handleReturn={handleReturn}
        />
      ) : (
        <>
          <h1 className="content-container__title">Szczegóły wynajmu</h1>
          <div className="details-container">
            {renderDetails()}
            <div className="details-container__buttons">
              <button
                className="details-container__button--return"
                onClick={props.handleReturn}
              >
                Powrót
              </button>
              {(props.roles[0] === "owner" || props.roles[0] === "admin") && (
                <div className="icon-container">
                  <ImCancelCircle
                    className="icon-container__delete-icon"
                    onClick={handleCancelRent}
                  />
                  <p>Anuluj</p>
                </div>
              )}
              {/* {(props.roles[0] === "owner" || props.roles[0] === "admin") && (
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
};

export default RentDetails;
