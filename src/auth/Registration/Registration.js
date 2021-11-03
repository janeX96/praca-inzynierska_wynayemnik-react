import React, { useEffect, useState } from "react";
import "../../styles/App.css";
import "./Registration.css";
import ReCAPTCHA from "react-google-recaptcha";
import RegistrationComplete from "./RegistrationComplete";

const Registration = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    checkPassword: "",
    registrationErrors: "",
    success: false,
    token: "",
    registerURL: "",
  });

  //zaciągam url do POST-a
  useEffect(() => {
    async function getResources() {
      let res = await fetch("/resources.json");
      let response = await res.json();
      // console.log(response.urls.register);
      setData({ registerURL: response.urls.register });
    }
    getResources();
  }, []);

  const handleChange = (event) => {
    console.log("edytuje: ", event.target.name);
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  async function handleSubmit(event) {
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

    event.preventDefault();
    await fetch("http://localhost:8080/auth/register", requestOptions)
      .then((response) => {
        if (response.ok) {
          console.log("REJESTRACJA POMYŚLNA");
          setData({ success: true });
        }

        return response.json();
      })
      .catch((err) => console.log(err));
  }

  const handleReCAPTCHA = (value) => {
    console.log("Captcha value:", value);
    setData({ ...data, token: value });
  };

  return (
    <div className="content-container">
      {data.success ? (
        <RegistrationComplete />
      ) : (
        <div className="registration-container">
          <form onSubmit={handleSubmit}>
            <input
              className="register-input"
              type="firstName"
              name="firstName"
              placeholder="imię"
              value={data.firstName}
              onChange={handleChange}
              required
            />

            <input
              className="register-input"
              type="lastName"
              name="lastName"
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

            <input
              className="register-input"
              type="password"
              name="password"
              placeholder="hasło"
              value={data.password}
              onChange={handleChange}
              required
            />

            <input
              className="register-input"
              type="password"
              name="checkPassword"
              placeholder="powtórz hasło"
              value={data.checkPassword}
              onChange={handleChange}
              required
            />

            <div>
              <ReCAPTCHA
                sitekey="6LdYUw0dAAAAAPtkwRE9qReUtokW_mjQyH71PQgT"
                onChange={handleReCAPTCHA}
              />
            </div>

            <button type="submit" className="register-button">
              Zarejestruj
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Registration;
