const RentSummary = ({
  products,
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
  const handleConfirm = (e) => {
    const action = e.currentTarget.dataset.name;
    if (action === "next") {
      //   props.stepDone(4);
    } else {
      stepBack();
    }
  };
  return (
    <div>
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

      <button onClick={handleConfirm} name="back">
        Powrót
      </button>
      <button onClick={handleConfirm} name="next">
        Dalej
      </button>
    </div>
  );
};

export default RentSummary;
