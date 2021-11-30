import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import RentBillingPeriods from "./RentBillingPeriods";

const RentForm = (props) => {
  const getDateToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };

  const [today, setToday] = useState(getDateToday);
  const [premisesTypes, setPremisesTypes] = useState({ types: [] });
  const [rentDetails, setRentDetails] = useState({
    bailValue: 0,
    carNumber: "",
    clientAccess: true,
    counterMediaRent: true,
    endDate: "",
    paymentDay: 0,
    paymentValues: [],
    premisesType: {
      type: "",
    },
    rentValue: 0,
    startDate: "",
    statePaymentValue: true,
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

  const messages = {
    bailValue_incorrect: "Podaj wartość kaucji",
    carNumber_incorrect: "Podaj wartość (7 znaków)",
    endDate_incorrect: "Podaj wartość",
    paymentDay_incorrect: "Podaj wartość 1-31",
    rentValue_incorrect: "Podaj wartość",
    startDate_incorrect: "Podaj wartość",
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

    if (rentDetails.startDate.length > 0) {
      startDate = true;
    }

    if (rentDetails.endDate.length > 0) {
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

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getPremisesTypes = async () => {
    let types = [];
    getResources()
      .then((res) => {
        fetch(res.urls.owner.premisesTypes, {
          headers: { Authorization: " Bearer " + keycloak.token },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            types = data.map((type) => {
              return {
                value: type.premisesTypeId,
                label: type.type,
              };
            });
            setPremisesTypes({ types });
          });
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  useEffect(() => {
    getPremisesTypes();
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

    const validation = formValidation();

    if (validation.correct) {
      props.setRentDetails(rentDetails);
      props.stepDone();
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

        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="startDate">
              Od:
              <input
                type="date"
                id="startDate"
                name="startDate"
                min={today}
                value={rentDetails.startDate}
                onChange={handleChange}
              />
              {errors.startDateError && (
                <span className="error-msg">
                  {messages.startDate_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="endDate">
              Do:
              <input
                type="date"
                id="endDate"
                name="endDate"
                min={today}
                value={rentDetails.endDate}
                onChange={handleChange}
              />
              {errors.endDateError && (
                <span className="error-msg">{messages.endDate_incorrect}</span>
              )}
            </label>
            <label htmlFor="premisesType">
              Rodzaj:
              <select
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
                <span className="error-msg">
                  {messages.premisesType_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="carNumber">
              carNumber:
              <input
                type="text"
                id="carNumber"
                name="carNumber"
                value={rentDetails.carNumber}
                onChange={handleChange}
              />
              {errors.carNumberError && (
                <span className="error-msg">
                  {messages.carNumber_incorrect}
                </span>
              )}
            </label>
            <h1>Opłaty</h1>
            <label htmlFor="bailValue">
              Kaucja:
              <input
                type="number"
                id="bailValue"
                name="bailValue"
                value={rentDetails.bailValue}
                onChange={handleChange}
              />
              {errors.bailValueError && (
                <span className="error-msg">
                  {messages.bailValue_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="counterMediaRent">
              Udostępniania mediów najemcy:
              <input
                type="checkbox"
                id="counterMediaRent"
                name="counterMediaRent"
                checked={rentDetails.counterMediaRent}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="clientAccess">
              Udostępnianie danych wynajmu najemcy:
              <input
                type="checkbox"
                id="clientAccess"
                name="clientAccess"
                checked={rentDetails.clientAccess}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="statePaymentValue">
              Stała wartość czynszu:
              <input
                type="checkbox"
                id="statePaymentValue"
                name="statePaymentValue"
                checked={rentDetails.statePaymentValue}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="rentValue">
              Czynsz:
              <input
                type="number"
                id="rentValue"
                name="rentValue"
                value={rentDetails.rentValue}
                onChange={handleChange}
                disabled={!rentDetails.statePaymentValue}
              />
              {errors.rentValueError && (
                <span className="error-msg">
                  {messages.rentValue_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="paymentDay">
              Płatne do:
              <input
                type="number"
                id="paymentDay"
                name="paymentDay"
                value={rentDetails.paymentDay}
                onChange={handleChange}
              />
              {errors.paymentDayError && (
                <span className="error-msg">
                  {messages.paymentDay_incorrect}
                </span>
              )}
            </label>

            {/* <label htmlFor="description">
              Uwagi:
              <textarea
                id="description"
                name="description"
                rows="4"
                cols="10"
                style={{ height: "150px", width: "250px" }}
                value={rentDetails.description}
                onChange={handleChange}
              ></textarea>
            </label> */}
          </form>
          {!rentDetails.statePaymentValue && (
            <>
              <h3>Okresy rozliczeniowe czynszu</h3>
              <RentBillingPeriods addBillingPeriod={addBillingPeriod} />
              <ul>
                {rentDetails.paymentValues.map((payment) => (
                  <li>
                    {payment.startDate} - {payment.endDate} - {payment.value}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button onClick={handleSubmit}>Dalej</button>
        </div>
      </div>
    </>
  );
};

export default RentForm;
