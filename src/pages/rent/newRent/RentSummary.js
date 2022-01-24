import { useState } from "react";
import { POST } from "../../../utilities/Request";
import { owner, admin } from "../../../resources/urls";
import { toast } from "react-toastify";

const RentSummary = ({
  handleReturn,
  roles,
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
  const [error, setError] = useState("");

  const createRentRequest = async (obj) => {
    if (!sending) {
      setSending(true);

      let json = JSON.stringify(obj);
      let urlByRole =
        roles[0] === "owner"
          ? owner.rent.new
          : roles[0] === "administrator"
          ? admin.rent.new
          : "";
      POST(urlByRole, json)
        .then((response) => {
          if (response.ok) {
            toast.success("Wynajem został dodany");
            handleReturn();
            setSending(false);
          } else {
            response.json().then((res) => {
              const err = res.error;
              setError(err);
            });

            setSending(false);
          }
          return response.json();
        })
        .catch((err) => {});
    }
  };

  const handleConfirm = (e) => {
    const action = e.currentTarget.dataset.name;
    if (action === "next") {
      let obj = rentObj;

      if (userEmail.length === 0) {
        obj.email = null;
      }
      createRentRequest(obj);
    } else {
      stepBack();
    }
  };

  return (
    <div>
      <div className="form-container">
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

        <div className="form-container__row">
          <div className="row__col-25"> -</div>
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

        <div className="form-container__row">
          <div className="row__col-25">-</div>
          <div className="row__col-75">
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

        <div className="form-container__row">
          <div className="row__col-25">
            <label>Okres: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              disabled
              value={"od: " + startDate.split("T")[0]}
            />
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              disabled
              value={"do: " + endDate.split("T")[0]}
            />
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label>Rodzaj: </label>
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
              paymentValues.map((p) => (
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
                />
              ))
            )}
          </div>
        </div>

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

        {carNumber.length > 0 && (
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
        )}

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

        <div className="form-container__row">
          <div className="row__col-25">
            <label>Załączone produkty: </label>
          </div>
          <div className="row__col-75" style={{ width: "300px" }}>
            <ul style={{ "list-style": "square" }}>
              {products.map((product) => {
                return (
                  <li key={product.productName}>
                    <b>{product.productName}</b>
                    {product.productType === "MEDIA" &&
                    product.subtypeMedia === "STANDARD"
                      ? ", stan licznika:" + product.counter
                      : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {error && (
          <span
            className="form-container__error-msg"
            style={{ fontSize: "25px" }}
          >
            {error}
          </span>
        )}

        <div className="form-container__buttons">
          <button onClick={handleConfirm} data-name="back">
            Powrót
          </button>
          <button onClick={handleConfirm} data-name="next">
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentSummary;
