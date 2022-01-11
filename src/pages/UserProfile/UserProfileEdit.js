import React, { useState, useEffect } from "react";
import "../../styles/App.css";
import { PUT } from "../../utilities/Request";
import { user } from "../../resources/urls";
import { toast } from "react-toastify";

const UserProfileEdit = (props) => {
  const [userEdit, setUserEdit] = useState(props.data);
  const [errors, setErrors] = useState({
    firstNameError: false,
    lastNameError: false,
    phoneNumberError: false,
    NIPError: false,
    emailError: false,
  });

  const [updateUrl, setUpdateUrl] = useState();
  const [loading, setLoading] = useState(false);

  const messages = {
    firstName_incorrect: "Długość imienia jest niepoprawna",
    lastName_incorrect: "Długość nazwiska jest niepoprawna",
    email_incorrect: "Niepoprawna forma emaila",
    phoneNumber_incorrect: "Niepoprawna forma numeru",
    NIP_incorrect: "Niepoprawna forma NIPu",
  };

  const sendRequest = async () => {
    let json = JSON.stringify(userEdit);
    PUT(user.info, json)
      .then((res) => {
        if (res.ok) {
          setLoading(false);
          toast.success("Dane zostały zmienione");
          props.back();
        } else {
          res.json().then((res) => {
            toast.success(`Nie udało się zapisać zmian: ${res.error}`);
          });
        }

        return res.json();
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error Reading data " + err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loading) {
      setLoading(true);
      const validation = formValidation();

      if (validation.correct) {
        sendRequest();
      } else {
        setErrors({
          firstNameError: !validation.firstName,
          lastNameError: !validation.lastName,
          emailError: !validation.email,
          phoneNumberError: !validation.phoneNumber,
        });
        setLoading(false);
      }
    }
  };
  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;

    if (type === "text") {
      const value = e.target.value;
      setUserEdit({ ...userEdit, [name]: value });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const formValidation = () => {
    let firstName = false;
    if (userEdit.firstName.length > 0 && userEdit.firstName.length < 31)
      firstName = true;

    let lastName = false;
    if (userEdit.lastName.length > 0 && userEdit.lastName.length < 31)
      lastName = true;

    let phoneNumber = false;
    if (userEdit.phoneNumber.length === 9) phoneNumber = true;

    let email = false;
    if (validateEmail(userEdit.email) && userEdit.email.length < 61)
      email = true;

    let correct = firstName && lastName && phoneNumber && email;

    return {
      correct,
      firstName,
      lastName,
      phoneNumber,
      email,
    };
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="firstName">Imie</label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              name="firstName"
              id="firstName"
              value={userEdit.firstName}
              onChange={handleChange}
            />
            {errors.firstNameError && (
              <span className="error-msg">{messages.firstName_incorrect}</span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="lastName">Nazwisko</label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              name="lastName"
              id="lastName"
              value={userEdit.lastName}
              onChange={handleChange}
            />
            {errors.lastNameError && (
              <span className="error-msg">{messages.lastName_incorrect}</span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="email">Email</label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              name="email"
              id="email"
              value={userEdit.email}
              onChange={handleChange}
            />
            {errors.emailError && (
              <span className="error-msg">{messages.email_incorrect}</span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="phoneNumber">Numer telefonu</label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={userEdit.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumberError && (
              <span className="error-msg">
                {messages.phoneNumber_incorrect}
              </span>
            )}
          </div>
        </div>
        <div className="form-container__buttons">
          <button onClick={props.back}>Powrót</button>
          <button type="submit">Zapisz</button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileEdit;
