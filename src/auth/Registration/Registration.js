import React, { Component } from "react";
import "../../styles/App.css";
import "./Registration.css";
import keycloak from "../keycloak";
import ReCAPTCHA from "react-google-recaptcha";
import RegistrationComplete from "./RegistrationComplete";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      checkPassword: "",
      registrationErrors: "",
      success: false,
      token: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      checkPassword,
      token,
    } = this.state;

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

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: " Bearer " + keycloak.token,
      },
      body: jsonData,
    };

    // console.log("wysylam: ", requestOptions);

    event.preventDefault();
    const res = await fetch(
      "http://localhost:8080/auth/register",
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          console.log("REJESTRACJA POMYŚLNA");
          this.setState({ success: true });
        }

        return response.json();
      })
      .catch((err) => console.log(err));
  }

  handleReCAPTCHA = (value) => {
    console.log("Captcha value:", value);
    this.setState({ token: value });
  };

  render() {
    return (
      <div className="content-container">
        {this.state.success ? (
          <RegistrationComplete />
        ) : (
          <div className="registration-container">
            <form onSubmit={this.handleSubmit}>
              <input
                className="register-input"
                type="firstName"
                name="firstName"
                placeholder="imię"
                value={this.state.firstName}
                onChange={this.handleChange}
                required
              />

              <input
                className="register-input"
                type="lastName"
                name="lastName"
                placeholder="nazwisko"
                value={this.state.lastName}
                onChange={this.handleChange}
                required
              />

              <input
                className="register-input"
                type="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />

              <input
                className="register-input"
                type="tel"
                name="phoneNumber"
                pattern="[0-9]{9}"
                placeholder="numer tel : 123456789"
                value={this.state.phoneNumber}
                onChange={this.handleChange}
                required
              />

              <input
                className="register-input"
                type="password"
                name="password"
                placeholder="hasło"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />

              <input
                className="register-input"
                type="password"
                name="checkPassword"
                placeholder="powtórz hasło"
                value={this.state.checkPassword}
                onChange={this.handleChange}
                required
              />

              <div>
                <ReCAPTCHA
                  sitekey="6LdYUw0dAAAAAPtkwRE9qReUtokW_mjQyH71PQgT"
                  onChange={this.handleReCAPTCHA}
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
  }
}
