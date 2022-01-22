import React, { useState } from "react";
import { toast } from "react-toastify";
import { user } from "../../resources/urls";
import { POST } from "../../utilities/Request";

const CompanyForm = (props) => {
  const [company, setCompany] = useState({
    address: {
      city: "",
      postCode: "",
      street: "",
      streetNumber: "",
    },
    companyName: "",
    nip: "",
  });
  const [errors, setErrors] = useState({
    cityError: false,
    postCodeError: false,
    streetError: false,
    streetNumberError: false,
    companyNameError: false,
    nipError: false,
  });
  const [sending, setSending] = useState(false);
  const messages = {
    cityIncorrect: "Wpisz nazwę miasta",
    postCodeIncorrect: "Wpisz włąściwy kod pocztowy",
    streetIncorrect: "Wpisz nazwę ulicy",
    streetNumberIncorrect: "Wpisz numer",
    companyNameIncorrect: "Wpisz nazwę firmy",
    nipIncorrect: "Wpisz poprawny NIP",
  };

  const formValidation = () => {
    let city = false;
    let postCode = false;
    let street = false;
    let streetNumber = false;
    let companyName = false;
    let nip = false;

    if (company.address.city.length > 0 && company.address.city.length < 31) {
      city = true;
    }
    if (/^[0-9]{2}-[0-9]{3}$/.test(company.address.postCode)) {
      postCode = true;
    }
    if (
      company.address.street.length > 0 &&
      company.address.street.length < 61
    ) {
      street = true;
    }
    if (
      company.address.streetNumber.length > 0 &&
      company.address.streetNumber.length < 5
    ) {
      streetNumber = true;
    }
    if (company.companyName.length > 3 && company.companyName.length < 61) {
      companyName = true;
    }
    if (company.nip.length === 10) {
      nip = true;
    }

    const correct = city & postCode & street & streetNumber & companyName & nip;

    return {
      correct,
      city,
      postCode,
      street,
      streetNumber,
      companyName,
      nip,
    };
  };

  const handleCompanySumbit = (e) => {
    e.preventDefault();

    if (!sending) {
      setSending(true);
      const validation = formValidation();
      if (validation.correct) {
        const obj = JSON.stringify(company);
        POST(user.createCompany, obj).then((res) => {
          if (res.ok) {
            toast.success("Dodano dane firmy");
            props.changeIsNaturalPerson();
            props.handleReturn();
          } else {
            res.json().then((res) => {
              toast.error(`Nie udało się dodać danych firmy: ${res.error}`);
            });
          }
        });
      } else {
        setSending(false);
        setErrors({
          cityError: !validation.city,
          postCodeError: !validation.postCode,
          streetError: !validation.street,
          streetNumberError: !validation.streetNumber,
          companyNameError: !validation.companyName,
          nipError: !validation.nip,
        });
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "companyName" || name === "nip") {
      setCompany({
        ...company,
        address: { ...company.address },
        [name]: value,
      });
    } else {
      setCompany({
        ...company,
        address: { ...company.address, [name]: value },
      });
    }
  };
  return (
    <>
      <div className="form-container">
        <h2 className="form-container__error-msg">
          Aby używac fakturowni musisz wprowadzić dane firmy
        </h2>
        <br />
        <form onSubmit={handleCompanySumbit}>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="city">Miasto:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="city"
                name="city"
                value={company.address.city}
                onChange={handleChange}
              />
              {errors.cityError && (
                <span className="form-container__error-msg">
                  {messages.cityIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="postCode">Kod pocztowy:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="postCode"
                name="postCode"
                value={company.address.postCode}
                onChange={handleChange}
              />
              {errors.postCodeError && (
                <span className="form-container__error-msg">
                  {messages.postCodeIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="street">Ulica:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="street"
                name="street"
                value={company.address.street}
                onChange={handleChange}
              />
              {errors.streetError && (
                <span className="form-container__error-msg">
                  {messages.streetIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="streetNumber">Numer:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="streetNumber"
                name="streetNumber"
                value={company.address.streetNumber}
                onChange={handleChange}
              />{" "}
              {errors.streetNumberError && (
                <span className="form-container__error-msg">
                  {messages.streetNumberIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="companyName">Nazwa Firmy:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="companyName"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
              />{" "}
              {errors.companyNameError && (
                <span className="form-container__error-msg">
                  {messages.companyNameIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="nip">Nip:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="nip"
                name="nip"
                value={company.nip}
                onChange={handleChange}
              />{" "}
              {errors.nipError && (
                <span className="form-container__error-msg">
                  {messages.nipIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__buttons">
            <button onClick={() => props.handleReturn()}>Powrót</button>

            <button type="submit" className="">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompanyForm;
