import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import Confirmation from "./Confirmation";

const RentSummary = ({
  userEmail,
  rentObj,
  products,
  productWithCounterList,
  stepBack,
  stepDone,
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
  const [createURL, setCreateURL] = useState();
  const [success, setSuccess] = useState(false);

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  useEffect(() => {
    getResources().then((res) => {
      const url = res.urls.owner.rent.new;
      setCreateURL(url);
    });
  }, []);

  const createRentRequest = async (obj) => {
    if (!sending) {
      setSending(true);

      let json = JSON.stringify(obj);
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: " Bearer " + keycloak.token,
        },
        body: json,
      };

      const res = await fetch(createURL, requestOptions)
        .then((response) => {
          if (response.ok) {
            // console.log("UDAŁO SIE!!!");
            setSuccess(true);
            setSending(false);
          } else {
            // console.log("NIE UDAŁO SIE... :(");
            setSending(false);
            setSuccess(false);
          }
          return response.json();
        })
        .catch((err) => {
          console.log("Error: ", err);
          setSending(false);
          setSuccess(false);
        });
    }
  };

  const handleConfirm = (e) => {
    const action = e.currentTarget.dataset.name;
    if (action === "next") {
      let obj = {};
      if (userEmail.length > 0) {
        obj = {
          bailValue: bailValue,
          carNumber: carNumber,
          clientAccess: clientAccess,
          counterMediaRent: counterMediaRent,
          description: description,
          email: email,
          endDate: endDate + "T20:44:36.263", //tymczasowe (czy potrzebna godzina ? )
          paymentDay: paymentDay,
          paymentValues: paymentValues,
          premisesType: { type: premisesType.type },
          premisesId: premisesId,
          productWithCounterList: productWithCounterList,
          rentValue: rentValue,
          startDate: startDate + "T20:44:36.263", //tymczasowe
          statePaymentValue: statePaymentValue, //tymczasowe
        };
      } else {
        obj = rentObj;
        obj.email = null;
        obj.startDate = obj.startDate + "T20:44:36.263";
        obj.endDate = obj.endDate + "T20:44:36.263";
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
