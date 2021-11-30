import { types } from "@babel/core";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  const [premisesType, setPremisesType] = useState("");
  const [premisesTypes, setPremisesTypes] = useState({ types: [] });
  const [rentDetails, setRentDetails] = useState({
    bailValue: 0,
    carNumber: "",
    counterMediaRent: true,
    description: "",
    endDate: "",
    paymentDay: 0,
    paymentValues: [],

    productWithQuantityList: [
      {
        productId: 0,
        quantity: 0,
      },
    ],
    rentValue: 0,
    startDate: "",
    statePaymentValue: true,
  });

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
    } else {
      const value = e.target.value;
      setRentDetails({ ...rentDetails, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
            </label>
            <label htmlFor="premisesType">
              Rodzaj:
              <select
                value={rentDetails.premisesType}
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
              {/* {state.errors.premisesType && (
                <span className="error-msg">
                  {messages.premisesType_incorrect}
                </span>
              )} */}
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
        </div>
      </div>
    </>
  );
};

export default RentForm;
