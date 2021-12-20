import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import { POST } from "../../utilities/Request";
import Confirmation from "./Confirmation";
import { owner } from "../../resources/urls";

const RentSummary = ({
  userEmail,
  rentObj,
  products,
  productWithCounterList,
  stepBack,
  bailValue,
  carNumber,
  clientAccess,
  counterMediaRent,
  description,
  endDate,
  paymentDay,
  paymentValues,
  premisesType,
  premisesId,
  rentValue,
  startDate,
  statePaymentValue,
  userAccount: { email, firstName, lastName, phoneNumber, sharing },
}) => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const createRentRequest = async (obj) => {
    if (!sending) {
      setSending(true);

      let json = JSON.stringify(obj);

      POST(owner.rent.new, json)
        .then((response) => {
          if (response.ok) {
            console.log("UDAŁO SIE!!!");

            setSuccess(true);
            setSending(false);
          } else {
            response.json().then((res) => {
              const err = res.error;
              // console.log("BLAD: ", res.error);
              setError(err);
            });

            setSending(false);
            setSuccess(false);
          }
          return response.json();
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  };

  const handleConfirm = (e) => {
    const action = e.currentTarget.dataset.name;
    if (action === "next") {
      let obj = rentObj;

      if (userEmail.length === 0) {
        obj.email = null;
      }

      console.log("Objekt do wysłania: ", obj);
      createRentRequest(obj);
    } else {
      stepBack();
    }
  };

  return (
    <div>
      {success ? (
        <Confirmation />
      ) : (
        <div className="form-container">
          <ul>
            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Najemca </label>
                </div>
                <div className="row__col-75">
                  <input
                    className="form-container__input"
                    type="text"
                    value={email + " - " + firstName + ", " + lastName}
                    disabled
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="form-container__row">
                <div className="row__col-25"></div>
                <div className="row__col-75">
                  <input
                    className="form-container__input"
                    type="text"
                    disabled
                    value={
                      clientAccess
                        ? "Klient ma dostęp do konta"
                        : "Klient nie ma dostępu do konta"
                    }
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="form-container__row">
                <div className="row__col-25"></div>
                <div className="row__col-75">
                  {" "}
                  <input
                    className="form-container__input"
                    type="text"
                    disabled
                    value={
                      counterMediaRent
                        ? "Klient ma wgląd do liczników"
                        : "Klient nie ma wglądu do liczników"
                    }
                  />
                </div>
              </div>
            </li>

            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Okres wynajmu: </label>
                </div>
                <div className="row__col-75">
                  <input
                    className="form-container__input"
                    type="text"
                    disabled
                    value={"od: " + startDate + " do: " + endDate}
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Rodzaj wynajmu: </label>
                </div>
                <div className="row__col-75">
                  <input
                    className="form-container__input"
                    type="text"
                    disabled
                    value={premisesType.type}
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Kaucja: </label>
                </div>
                <div className="row__col-75">
                  <input
                    className="form-container__input"
                    type="text"
                    disabled
                    value={bailValue}
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Kwota czynszu: </label>
                </div>
                <div className="row__col-75">
                  {statePaymentValue ? (
                    <input
                      className="form-container__input"
                      type="text"
                      disabled
                      value={rentValue}
                    />
                  ) : (
                    paymentValues.map((p) => {
                      <input
                        className="form-container__input"
                        type="text"
                        disabled
                        value={
                          "od: " +
                          p.startDate +
                          " do: " +
                          p.endDate +
                          ", kwota: " +
                          p.value
                        }
                      />;
                    })
                  )}
                </div>
              </div>
            </li>
            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Dzień płatności: </label>
                </div>
                <div className="row__col-75">
                  <input
                    className="form-container__input"
                    type="text"
                    disabled
                    value={paymentDay}
                  />
                </div>
              </div>
            </li>
            {carNumber.length > 0 && (
              <li>
                <div className="form-container__row">
                  <div className="row__col-25">
                    <label>Nr rejestracyjny pojazdu: </label>
                  </div>
                  <div className="row__col-75">
                    <input
                      className="form-container__input"
                      type="text"
                      disabled
                      value={carNumber}
                    />
                  </div>
                </div>
              </li>
            )}
            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Uwagi: </label>
                </div>
                <div className="row__col-75">
                  <input
                    className="form-container__input"
                    type="text"
                    disabled
                    value={description.length > 0 ? description : "brak"}
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="form-container__row">
                <div className="row__col-25">
                  <label>Załączone produkty: </label>
                </div>
                <div className="row__col-75">
                  <ul>
                    {products.map((product) => {
                      return (
                        <li>
                          <input
                            className="form-container__input"
                            type="text"
                            disabled
                            value={
                              product.productName +
                              ", stan licznika: " +
                              product.counter
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </li>
            {error && (
              <span
                className="form-container__error-msg"
                style={{ fontSize: "25px" }}
              >
                {error}
              </span>
            )}
          </ul>
          <div className="form-container__buttons">
            <button onClick={handleConfirm} data-name="back">
              Powrót
            </button>
            <button onClick={handleConfirm} data-name="next">
              Zapisz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentSummary;
