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

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBillingPeriod({ ...billingPeriod, [name]: value });
  };

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
      props.addBillingPeriod(billingPeriod);

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Data rozpoczęcia:
          <input
            type="date"
            id="startDate"
            name="startDate"
            onChange={handleChange}
            value={billingPeriod.startDate}
          />
          {errors.startDateError && (
            <span className="error-msg">{messages.startDate_incorrect}</span>
          )}
        </label>

        <label>
          Data zakończenia:
          <input
            type="date"
            id="endDate"
            name="endDate"
            onChange={handleChange}
            value={billingPeriod.endDate}
          />
          {errors.endDateError && (
            <span className="error-msg">{messages.endDate_incorrect}</span>
          )}
        </label>

        <label>
          Kwota:
          <input
            type="number"
            id="value"
            name="value"
            onChange={handleChange}
            value={billingPeriod.value}
          />
          {errors.valueError && (
            <span className="error-msg">{messages.value_incorrect}</span>
          )}
        </label>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default RentBillingPeriods;
