import React, { Component } from "react";
import axios from "axios";
import "../../styles/App.css";
import "./Registration.css";
import keycloak from "../keycloak";

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
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    const { firstName, lastName, phoneNumber, email, password, checkPassword } =
      this.state;

    axios
      .post(
        "http://localhost:8080/auth/register",
        {
          user: {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            password: password,
            checkPassword: checkPassword,
          },
        },
        { headers: { Authorization: " Bearer " + keycloak.token } },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.ok) {
          //if (response.data.status === "created")
          this.props.handleSuccessfulAuth(response.data);
        }
      })
      .catch((error) => {
        console.log("registration error", error);
      });
    event.preventDefault();
  }

  render() {
    return (
      <div className="content-container">
        <div className="registration-container">
          <form onSubmit={this.handleSubmit}>
            <input
              type="firstName"
              name="firstName"
              placeholder="first name"
              value={this.state.firstName}
              onChange={this.handleChange}
              required
            />

            <input
              type="lastName"
              name="lastName"
              placeholder="last name"
              value={this.state.lastName}
              onChange={this.handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />

            <input
              type="phoneNumber"
              name="phoneNumber"
              placeholder="phone number"
              value={this.state.phoneNumber}
              onChange={this.handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />

            <input
              type="password"
              name="checkPassword"
              placeholder="Password confirmation"
              value={this.state.checkPassword}
              onChange={this.handleChange}
              required
            />

            <button type="submit" className="register-button">
              Register
            </button>
          </form>
        </div>
      </div>
    );
  }
}
