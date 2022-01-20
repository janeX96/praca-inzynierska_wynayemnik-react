import React, { useEffect, useState } from "react";
import "../../styles/App.scss";
// import "./Registration.css";
import ReCAPTCHA from "react-google-recaptcha";
import RegistrationComplete from "./RegistrationComplete";
import WaitIcon from "../../images/icons/wait-icon.png";
import { POST } from "../../utilities/Request";
import { user } from "../../resources/urls";

const Registration = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    checkPassword: "",
    registrationError: "",
    success: false,
    token: "",
    registerURL: "",
    sending: false,
    // reCaptcha: false,
    errors: {
      passwordsNotSameError: false,
      passwordFormError: false,
      reCaptchaError: false,
    },
  });

  //zaciągam url do POST-a
  useEffect(() => {
    async function getResources() {
      let res = await fetch("/resources.json");
      let response = await res.json();
      // console.log(response.urls.register);
      setData({ ...data, registerURL: response.urls.register });
    }
    getResources();
  }, []);

  //reaktywna walidacja haseł i reCaptcha
  useEffect(() => {
    if (data.errors.passwordsNotSameError || data.errors.reCaptchaError) {
      const validation = formValidation();
      setData({
        ...data,
        errors: {
          passwordsNotSameError: !validation.passwordSame,
          reCaptchaError: !validation.reCaptcha,
        },
      });
    }
  }, [data.password, data.checkPassword, data.token]);

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });

    if (data.errors.passwordsNotSameError || data.errors.reCaptchaError) {
      const validation = formValidation();
      setData({
        ...data,
        [event.target.name]: event.target.value,
        errors: {
          passwordsNotSameError: !validation.passwordSame,
          reCaptchaError: !validation.reCaptcha,
        },
      });
    }
  };

  const formValidation = () => {
    let passwordSame = false;
    let reCaptcha = false;

    if (data.password === data.checkPassword) {
      passwordSame = true;
    }
    if ((data.token + "").length > 0) {
      reCaptcha = true;
    }

    let correct = passwordSame && reCaptcha;

    return { correct, passwordSame, reCaptcha };
  };

  const messages = {
    notSamePass: "Hasła nie są identyczne",
    reCaptchaErr: "Potwierdź że nie jesteś robotem (no chyba że jesteś...)",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!data.sending) {
      let validation = formValidation();
      if (validation.correct) {
        setData({ ...data, sending: true });

        const {
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
          checkPassword,
          token,
        } = data;

        let userData = {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
          checkPassword: checkPassword,
          recaptchaResponse: token,
        };

        let jsonData = JSON.stringify(userData);
        // console.log(jsonData);
        let errorMsg = "";
        await POST(user.register, jsonData, true)
          .then((res) => {
            // console.log("Otrzymalem: ", res);
            if (res.ok) {
              // console.log("REJESTRACJA POMYŚLNA");
              setData({ ...data, success: true });
            } else {
              res.json().then((res) => {
                errorMsg = res.error;
                setData({
                  ...data,
                  registrationError: errorMsg,
                  sending: false,
                  token: "",
                });
                window.grecaptcha.reset();
              });
            }
          })
          .catch((err) => {
            console.log("Błąd: ", err.message);
            setData({ ...data, sending: false });
          });
      } else {
        setData({
          ...data,
          errors: {
            passwordsNotSameError: !validation.passwordSame,
            reCaptchaError: !validation.reCaptcha,
          },
        });
      }
    }
  };

  const handleReCAPTCHA = (value) => {
    // console.log("Captcha value:", value);
    if (value === null) {
      setData({ ...data, token: "" });
    } else {
      setData({ ...data, token: value });
    }
  };

  return (
    <div className="content-container">
      {data.success ? (
        <RegistrationComplete />
      ) : (
        <div className="form-container">
          <span className="error-msg">{data.registrationError}</span>
          <form onSubmit={handleSubmit}>
            <div className="form-container__row">
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="firstName"
                  name="firstName"
                  placeholder="imię"
                  minLength="2"
                  maxLength="30"
                  value={data.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="lastName"
                  name="lastName"
                  minLength="2"
                  maxLength="30"
                  placeholder="nazwisko"
                  value={data.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  maxLength="60"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="tel"
                  name="phoneNumber"
                  pattern="[0-9]{9}"
                  placeholder="numer tel : 123456789"
                  value={data.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-container__row">
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="password"
                  name="password"
                  placeholder="hasło"
                  minLength="6"
                  maxLength="25"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
                {data.errors.passwordsNotSameError && (
                  <span className="error-msg">{messages.notSamePass}</span>
                )}
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="password"
                  name="checkPassword"
                  placeholder="powtórz hasło"
                  minLength="6"
                  maxLength="25"
                  value={data.checkPassword}
                  onChange={handleChange}
                  required
                />
                {data.errors.passwordsNotSameError && (
                  <span className="error-msg">{messages.notSamePass}</span>
                )}
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-75">
                <ReCAPTCHA
                  sitekey="6LdYUw0dAAAAAPtkwRE9qReUtokW_mjQyH71PQgT"
                  name="reCaptcha"
                  onChange={handleReCAPTCHA}
                />
                {data.errors.reCaptchaError && (
                  <span className="form-container__error-msg">
                    {messages.reCaptchaErr}
                  </span>
                )}
              </div>
            </div>

            <div className="form-container__buttons">
              {data.sending ? (
                <img className="register-button" src={WaitIcon} alt="..." />
              ) : (
                <button type="submit">Zarejestruj</button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Registration;
