import { useState, useEffect } from "react";
import RentBillingPeriods from "./RentBillingPeriods";
import { general } from "../../../resources/urls";
import { GET } from "../../../utilities/Request";

const RentForm = (props) => {
  const [premisesTypes, setPremisesTypes] = useState({ types: [] });
  const [rentDetails, setRentDetails] = useState({
    bailValue: props.default.bailValue,
    carNumber: props.default.carNumber,
    clientAccess: props.default.clientAccess,
    counterMediaRent: props.default.counterMediaRent,
    endDate: props.default.endDate,
    paymentDay: props.default.paymentDay,
    paymentValues: props.default.paymentValues,
    premisesType: {
      type: props.default.premisesType.type,
    },
    rentValue: props.default.rentValue,
    startDate: props.default.startDate,
    statePaymentValue: props.default.statePaymentValue,
  });
  const [errors, setErrors] = useState({
    bailValueError: false,
    carNumberError: false,
    endDateError: false,
    paymentDayError: false,
    rentValueError: false,
    startDateError: false,
    premisesTypeError: false,
  });

  const getDateToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    today = yyyy + "-" + mm + "-" + dd + "T" + time;
    return today;
  };

  const today = getDateToday();

  const messages = {
    bailValue_incorrect: "Podaj wartość kaucji",
    carNumber_incorrect: "Podaj wartość (7 znaków)",
    endDate_incorrect:
      "Wybierz właściwą datę (data zakończenia musi być późniejsza niż data rozpoczęcia)",
    paymentDay_incorrect: "Podaj wartość 1-31",
    rentValue_incorrect: "Podaj wartość",
    startDate_incorrect:
      "Wybierz właściwą datę (data rozpoczęcia musi poprzedzać datę zakończenia)",
    premisesType_incorrect: "Wybierz rodzaj wynajmu",
  };

  const formValidation = () => {
    let bailValue = false;
    let carNumber = false;
    let endDate = false;
    let paymentDay = false;
    let rentValue = false;
    let startDate = false;
    let premisesType = false;

    if (rentDetails.bailValue > 0) {
      bailValue = true;
    }

    if (rentDetails.carNumber.length > 0) {
      if (rentDetails.carNumber.length === 7) {
        carNumber = true;
      }
    } else {
      carNumber = true;
    }

    if (
      rentDetails.startDate.length > 0 &&
      rentDetails.startDate < rentDetails.endDate
    ) {
      startDate = true;
    }

    if (
      rentDetails.endDate.length > 0 &&
      rentDetails.startDate < rentDetails.endDate
    ) {
      endDate = true;
    }

    if (rentDetails.paymentDay > 0 && rentDetails.paymentDay <= 31) {
      paymentDay = true;
    }

    if (rentDetails.statePaymentValue && rentDetails.rentValue > 0) {
      rentValue = true;
    } else if (
      !rentDetails.statePaymentValue &&
      rentDetails.paymentValues.length > 0
    ) {
      rentValue = true;
    }

    if (rentDetails.premisesType.type.length > 0) {
      premisesType = true;
    }

    const correct =
      bailValue &&
      carNumber &&
      endDate &&
      paymentDay &&
      rentValue &&
      startDate &&
      premisesType;

    return {
      correct,
      bailValue,
      carNumber,
      endDate,
      paymentDay,
      rentValue,
      startDate,
      premisesType,
    };
  };

  const getPremisesTypes = async () => {
    let types = [];

    GET(general.premises.premisesTypes)
      .then((data) => {
        types = data.map((type) => {
          return {
            value: type.premisesTypeId,
            label: type.type,
          };
        });
        setPremisesTypes({ types });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getPremisesTypes();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;

    if (type === "checkbox") {
      const checked = e.target.checked;
      setRentDetails({ ...rentDetails, [name]: checked });
    } else if (name === "premisesType") {
      const value = e.target.value;
      setRentDetails({
        ...rentDetails,
        premisesType: { type: value },
      });
    } else {
      const value = e.target.value;
      setRentDetails({ ...rentDetails, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = e.currentTarget.dataset.name;

    const validation = formValidation();

    if (action === "next") {
      if (validation.correct) {
        props.setRentDetails(rentDetails);

        props.stepDone(2);

        setErrors({
          bailValueError: false,
          carNumberError: false,
          endDateError: false,
          paymentDayError: false,
          rentValueError: false,
          startDateError: false,
          premisesTypeError: false,
        });
      } else {
        setErrors({
          bailValueError: !validation.bailValue,
          carNumberError: !validation.carNumber,
          endDateError: !validation.endDate,
          paymentDayError: !validation.paymentDay,
          rentValueError: !validation.rentValue,
          startDateError: !validation.startDate,
          premisesTypeError: !validation.premisesType,
        });
      }
    } else {
      props.stepBack();
    }
  };

  const addBillingPeriod = (billingPeriod) => {
    let billingPeriods = [...rentDetails.paymentValues];
    billingPeriods.push(billingPeriod);

    setRentDetails({ ...rentDetails, paymentValues: billingPeriods });
  };

  return (
    <>
      <div>
        <h1>
          Lokal: {props.premises.name}, {props.premises.premisesNumber}
        </h1>
        <h1>Najemca: {props.user}</h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="startDate">Od: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  min={today}
                  value={rentDetails.startDate}
                  onChange={handleChange}
                />
                {errors.startDateError && (
                  <span className="form-container__error-msg">
                    {messages.startDate_incorrect}
                  </span>
                )}
              </div>
            </div>

            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="endDate">Do: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  min={today}
                  value={rentDetails.endDate}
                  onChange={handleChange}
                />
                {errors.endDateError && (
                  <span className="form-container__error-msg">
                    {messages.endDate_incorrect}
                  </span>
                )}
              </div>
            </div>

            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="premisesType">Rodzaj:</label>
              </div>
              <div className="row__col-75">
                <select
                  className="form-container__input"
                  value={rentDetails.premisesType.type}
                  id="premisesType"
                  name="premisesType"
                  onChange={handleChange}
                >
                  <option key="" value=""></option>
                  {premisesTypes.types.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.premisesTypeError && (
                  <span className="form-container__error-msg">
                    {messages.premisesType_incorrect}
                  </span>
                )}
              </div>
            </div>

            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="carNumber">carNumber: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="text"
                  id="carNumber"
                  name="carNumber"
                  value={rentDetails.carNumber}
                  onChange={handleChange}
                />
                {errors.carNumberError && (
                  <span className="form-container__error-msg">
                    {messages.carNumber_incorrect}
                  </span>
                )}
              </div>
            </div>

            <h1>Opłaty</h1>
            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="bailValue">Kaucja:</label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="number"
                  id="bailValue"
                  name="bailValue"
                  value={rentDetails.bailValue}
                  onChange={handleChange}
                />
                {errors.bailValueError && (
                  <span className="form-container__error-msg">
                    {messages.bailValue_incorrect}
                  </span>
                )}
              </div>
            </div>

            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="counterMediaRent">
                  Udostępniania mediów najemcy:
                </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input--checkbox"
                  type="checkbox"
                  id="counterMediaRent"
                  name="counterMediaRent"
                  checked={rentDetails.counterMediaRent}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="clientAccess">
                  Udostępnianie danych wynajmu najemcy:
                </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input--checkbox"
                  type="checkbox"
                  id="clientAccess"
                  name="clientAccess"
                  checked={rentDetails.clientAccess}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="statePaymentValue">
                  Stała wartość czynszu:
                </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input--checkbox"
                  type="checkbox"
                  id="statePaymentValue"
                  name="statePaymentValue"
                  checked={rentDetails.statePaymentValue}
                  onChange={handleChange}
                  
                />
              </div>
            </div> */}

            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="rentValue">Czynsz: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="number"
                  id="rentValue"
                  name="rentValue"
                  value={rentDetails.rentValue}
                  onChange={handleChange}
                  disabled={!rentDetails.statePaymentValue}
                />
                {errors.rentValueError && (
                  <span className="form-container__error-msg">
                    {messages.rentValue_incorrect}
                  </span>
                )}
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="paymentDay">Płatne do:</label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="number"
                  id="paymentDay"
                  name="paymentDay"
                  value={rentDetails.paymentDay}
                  onChange={handleChange}
                />
                {errors.paymentDayError && (
                  <span className="form-container__error-msg">
                    {messages.paymentDay_incorrect}
                  </span>
                )}
              </div>
            </div>
          </form>
          {!rentDetails.statePaymentValue && (
            <>
              <h3>Okresy rozliczeniowe czynszu</h3>
              <RentBillingPeriods
                addBillingPeriod={addBillingPeriod}
                startDate={rentDetails.startDate}
                endDate={rentDetails.endDate}
              />
              <ul>
                {rentDetails.paymentValues.map((payment) => (
                  <li>
                    {payment.startDate} - {payment.endDate} - {payment.value}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="form-container__buttons">
            <button
              onClick={handleSubmit}
              data-name="back"
              style={{ marginRight: "15px", marginTop: "30px" }}
            >
              Powrót
            </button>
            <button onClick={handleSubmit} data-name="next">
              Dalej
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentForm;
