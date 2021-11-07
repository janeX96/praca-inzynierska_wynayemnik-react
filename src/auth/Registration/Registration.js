import React, { useEffect, useState } from "react";
import "../../styles/App.css";
import "./Registration.css";
import ReCAPTCHA from "react-google-recaptcha";
import RegistrationComplete from "./RegistrationComplete";
import WaitIcon from "../../images/icons/wait-icon.png";

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

  async function handleSubmit(event) {
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
        console.log(jsonData);

        const requestOptions = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: jsonData,
        };

        await fetch("http://localhost:8080/auth/register", requestOptions)
          .then((response) => {
            if (response.ok) {
              console.log("REJESTRACJA POMYŚLNA");
              setData({ ...data, success: true });
            } else {
              const err = response;
              console.log(">>>Błąd rejestracji: ", err);
              // setData({
              //   ...data,
              //   registrationError: response.errors.json(),
              //   sending: false,
              // });
            }

            return response.json();
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
  }

  const handleReCAPTCHA = (value) => {
    console.log("Captcha value:", value);
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
        <div className="registration-container">
          <span className="error-msg">{data.registrationError}</span>
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              className="register-input"
              type="firstName"
              name="firstName"
              placeholder="imię"
              minLength="2"
              maxLength="30"
              value={data.firstName}
              onChange={handleChange}
              required
            />

            <input
              className="register-input"
              type="lastName"
              name="lastName"
              minLength="2"
              maxLength="30"
              placeholder="nazwisko"
              value={data.lastName}
              onChange={handleChange}
              required
            />

            <input
              className="register-input"
              type="email"
              name="email"
              placeholder="Email"
              maxLength="60"
              value={data.email}
              onChange={handleChange}
              required
            />

            <input
              className="register-input"
              type="tel"
              name="phoneNumber"
              pattern="[0-9]{9}"
              placeholder="numer tel : 123456789"
              value={data.phoneNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">
              <input
                className="register-input"
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
            </label>

            <label htmlFor="checkPassword">
              <input
                className="register-input"
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
            </label>

            <div className="reCaptcha">
              <ReCAPTCHA
                sitekey="6LdYUw0dAAAAAPtkwRE9qReUtokW_mjQyH71PQgT"
                name="reCaptcha"
                onChange={handleReCAPTCHA}
              />
              {data.errors.reCaptchaError && (
                <span className="error-msg">{messages.reCaptchaErr}</span>
              )}
            </div>

            {data.sending ? (
              <img className="register-button" src={WaitIcon} alt="..." />
            ) : (
              <button type="submit" className="register-button">
                Zarejestruj
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Registration;
