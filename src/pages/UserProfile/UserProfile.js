import React, { Component } from "react";
import keycloak from "../../auth/keycloak";
import "../../styles/App.css";
import "./UserProfile.css";
export default class UserProfile extends Component {
  state = {
    // firstName: "",
    // lastName: "",
    // email: "",
    // phoneNumber: "",
    // NIP: "",
    // isFakturownia: "",
    // isNaturalPerson: "",
    data: [],
  };
  async getResources() {
    const response = await fetch("/resources.json");
    const resources = await response.json();

    return resources;
  }

  getData() {
    this.getResources().then((res) => {
      this.setState({ deleteURL: res.urls.owner.premisesDelete });
      //pobranie danych z wyciągniętego adresu url
      fetch(res.urls.user, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.setState({ data });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  }

  componentDidMount() {
    this.getData();
  }
  render() {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      NIP,
      isFakturownia,
      isNaturalPerson,
    } = this.state.data;
    return (
      <div className="content-container">
        <h1 className="content-title">Dane użytkownika</h1>
        <div className="details">
          <ul>
            <li>Imię: {firstName}</li>
            <li>Nazwisko: {lastName}</li>
            <li>email: {email}</li>
            <li>numer tel: {phoneNumber}</li>
            <li>NIP: {NIP}</li>
            <li>
              rodzaj użytkownika: {isNaturalPerson ? "osoba fizyczna" : "firma"}
            </li>
            <li>fakturownia: {isFakturownia ? "tak" : "nie"}</li>
          </ul>
          <button className="edit-btn">Edytuj dane</button>
        </div>
      </div>
    );
  }
}
