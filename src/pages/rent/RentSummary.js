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
            console.log("UDAŁO SIE!!!");
            setSuccess(true);
            setSending(false);
          } else {
            console.log("NIE UDAŁO SIE... :(");
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
          endDate: endDate,
          paymentDay: paymentDay,
          paymentValues: paymentValues,
          premisesType: { type: premisesType.type },
          premisesId: premisesId,
          productWithCounterList: productWithCounterList,
          rentValue: rentValue,
          startDate: startDate,
          statePaymentValue: statePaymentValue,
        };
      } else {
        obj = rentObj;
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
        <>
          <ul>
            <li>
              <label>
                Najemca
                <input
                  type="text"
                  value={email + " - " + firstName + ", " + lastName}
                  disabled
                />
              </label>
            </li>
            <li>
              <label>
                <input
                  type="text"
                  disabled
                  value={
                    clientAccess
                      ? "Klient ma dostęp do konta"
                      : "Klient nie ma dostępu do konta"
                  }
                />
              </label>
            </li>
            <li>
              <label>
                <input
                  type="text"
                  disabled
                  value={
                    counterMediaRent
                      ? "Klient ma wgląd do liczników"
                      : "Klient nie ma wglądu do liczników"
                  }
                />
              </label>
            </li>

            <li>
              <label>
                Okres wynajmu:
                <input
                  type="text"
                  disabled
                  value={"od: " + startDate + " do: " + endDate}
                />
              </label>
            </li>
            <li>
              <label>
                Rodzaj wynajmu:
                <input type="text" disabled value={premisesType.type} />
              </label>
            </li>
            <li>
              <label>
                Kaucja:
                <input type="text" disabled value={bailValue} />
              </label>
            </li>
            <li>
              <label>
                Kwota czynszu:
                {statePaymentValue ? (
                  <input type="text" disabled value={rentValue} />
                ) : (
                  paymentValues.map((p) => {
                    <input
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
              </label>
            </li>
            <li>
              <label>
                Dzień płatności:
                <input type="text" disabled value={paymentDay} />
              </label>
            </li>
            {carNumber.length > 0 && (
              <li>
                <label>
                  Nr rejestracyjny pojazdu:
                  <input type="text" disabled value={carNumber} />
                </label>
              </li>
            )}
            <li>
              <label>
                Uwagi:
                <input
                  type="text"
                  disabled
                  value={description.length > 0 ? description : "brak"}
                />
              </label>
            </li>
            <li>
              <label>
                Załączone produkty:
                <ul>
                  {products.map((product) => {
                    return (
                      <li>
                        <input
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
              </label>
            </li>
          </ul>
          <button
            onClick={handleConfirm}
            data-name="back"
            className="action-button"
            style={{ marginRight: "15px", marginTop: "30px" }}
          >
            Powrót
          </button>
          <button
            onClick={handleConfirm}
            data-name="next"
            className="action-button"
          >
            Zapisz
          </button>
        </>
      )}
    </div>
  );
};

export default RentSummary;
