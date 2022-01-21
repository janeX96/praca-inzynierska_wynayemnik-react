import { useState } from "react";

const RentBillingPeriods = (props) => {
  const [billingPeriod, setBillingPeriod] = useState({
    startDate: "",
    endDate: "",
    value: "",
  });
  const [errors, setErrors] = useState({
    startDateError: false,
    endDateError: false,
    valueError: false,
  });
  const [lastDate, setLastDate] = useState(props.startDate.split("T")[0]);
  const [rentEndDate, setRentEndDate] = useState(props.endDate.split("T")[0]);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBillingPeriod({ ...billingPeriod, [name]: value });
  };

  const [firstPeriod, setFirstPeriod] = useState(true);

  const messages = {
    startDate_incorrect: "Musisz wybrać datę początkową",
    endDate_incorrect: "Musisz wybrać datę końcową",
    value_incorrect: "Podaj wartość",
  };
  const formValidation = () => {
    let startDate = false;
    let endDate = false;
    let value = false;

    if (billingPeriod.startDate.length > 0) {
      startDate = true;
    }
    if (billingPeriod.endDate.length > 0) {
      endDate = true;
    }
    if (billingPeriod.value.length > 0) {
      value = true;
    }

    const correct = startDate && endDate && value;

    return { correct, startDate, endDate, value };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var validation = formValidation();

    if (validation.correct) {
      if (firstPeriod) {
        setFirstPeriod(false);
      }
      props.addBillingPeriod(billingPeriod);
      var date = new Date(billingPeriod.endDate);

      // if (firstPeriod) {
      date.setDate(date.getDate() + 1);
      date = formatDate(date);
      console.log("Next startdate: ", date);
      // } else {
      // date = calcEndOfPeriod();
      // date = formatDate(date);
      // console.log("Next startdate: ", date);
      // }

      setLastDate(date);
      setBillingPeriod({
        startDate: "",
        endDate: "",
        value: "",
      });

      setErrors({
        startDateError: false,
        endDateError: false,
        valueError: false,
      });
    } else {
      setErrors({
        startDateError: !validation.startDate,
        endDateError: !validation.endDate,
        valueError: !validation.value,
      });
    }
  };

  const formatDate = (date) => {
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0");
    var yyyy = date.getFullYear();

    const formattedDate = yyyy + "-" + mm + "-" + dd;
    return formattedDate;
  };

  const calcEndOfPeriod = () => {
    const d1 = new Date(lastDate);
    const lastMonth = d1.getMonth();

    let newDate = new Date(lastDate);

    newDate.setMonth(lastMonth + 1, 0);

    newDate = formatDate(newDate);

    console.log("newdate: ", newDate);

    if (newDate > rentEndDate || newDate === rentEndDate) {
      return rentEndDate;
    }

    return newDate;
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-container__row">
          <div className="row__col-25">
            <label>Data rozpoczęcia: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="date"
              id="startDate"
              name="startDate"
              min={lastDate}
              max={lastDate}
              onChange={handleChange}
              value={billingPeriod.startDate}
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
            <label>Data zakończenia: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="date"
              id="endDate"
              name="endDate"
              min={calcEndOfPeriod()}
              max={calcEndOfPeriod()}
              onChange={handleChange}
              value={billingPeriod.endDate}
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
            <label>Kwota: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="number"
              id="value"
              name="value"
              onChange={handleChange}
              value={billingPeriod.value}
            />
            {errors.valueError && (
              <span className="form-container__error-msg">
                {messages.value_incorrect}
              </span>
            )}
          </div>
        </div>
        <div className="form-container__buttons">
          <button disabled={lastDate > rentEndDate} type="submit">
            Dodaj
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentBillingPeriods;
