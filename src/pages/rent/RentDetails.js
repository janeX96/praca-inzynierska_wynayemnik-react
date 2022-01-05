import { useState, useEffect } from "react";
import { owner, admin, client, general } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import ProductsForRentDetails from "./ProductsForRentDetails";

const RentDetails = (props) => {
  const [rent, setRent] = useState();
  const [payments, setPayments] = useState();
  const [showProducts, setShowProducts] = useState(false);
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
  const handleReturn = () => {
    setShowProducts(!showProducts);
  };

  useEffect(() => {
    if (props.rent !== undefined) {
      setRent(props.rent);
    } else {
      getData();
    }
    getPayments();
  }, []);

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
            <li>
              Kaucja: <b>{rent.bailValue} zł</b>
            </li>
            {rent.bails.length > 0 ? (
              <li>
                Wpłacono:
                <ul>
                  {rent.bails.map((b) => (
                    <li>
                      <b>{b}</b>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              ""
            )}
            <li>
              Płatne do: <b>{rent.paymentDay}</b> dnia miesiąca
            </li>
            <li>
              Nr rejestracyjny: <b>{rent.carNumber}</b>
            </li>
            <li>
              Dostępne dla klienta: <b>{rent.clientAccess ? "tak" : "nie"}</b>
            </li>
            <li>
              counterMediaRent: <b>{rent.counterMediaRent ? "tak" : "nie"}</b>
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

            <li>
              <h3
                className="details-container__history"
                onClick={
                  // products !== undefined && products.length > 0
                  () => setShowProducts(!showProducts)
                  // : () => alert("Brak produktów dla tego wynajmu")
                }
              >
                Produkty
              </h3>
            </li>
            <li>
              <h3>Płatności</h3>
            </li>
          </ul>
        </>
      );
    } else {
      return <p>...</p>;
    }
  };

  return (
    <>
      <h1 className="content-container__title">Szczegóły lokalu</h1>
      <div className="details-container">
        {showProducts ? (
          <ProductsForRentDetails
            roles={props.roles}
            rentId={rent.rentId}
            handleReturn={handleReturn}
            payments={payments}
          />
        ) : (
          <>
            {renderDetails()}
            <div className="contant-btns">
              <button
                className="content-container__button"
                onClick={props.handleReturn}
              >
                Powrót
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RentDetails;
