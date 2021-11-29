import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";

const RentForm = (props) => {
  const getDateToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    alert(today);
    return today;
  };

  const [today, setToday] = useState(getDateToday);

  const [premisesType, setPremisesType] = useState("");
  const [premisesTypes, setPremisesTypes] = useState({ types: [] });
  const [rentDetails, setRentDetails] = useState({
    bailValue: 0,
    carNumber: "string",
    counterMediaRent: true,
    description: "string",
    endDate: "",
    paymentDay: 0,
    paymentValues: [
      {
        endDate: "",
        startDate: "",
        value: 0,
      },
    ],

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
  const handleChange = (e) => {};

  return (
    <>
      <div>
        <h1>
          Lokal: {props.premises.name}, {props.premises.premisesNumber}
        </h1>
        <h1>Najemca: {props.user}</h1>

        <div>
          <form onSubmit="">
            <label htmlFor="startDate">
              Od:
              <input type="date" id="startDate" name="startDate" min={today} />
            </label>
            <label htmlFor="endDate">
              Do:
              <input type="date" id="endDate" name="endDate" />
            </label>
            <label htmlFor="premisesType">
              Rodzaj:
              <select
                value={premisesType}
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
          </form>
        </div>
      </div>
    </>
  );
};

export default RentForm;
