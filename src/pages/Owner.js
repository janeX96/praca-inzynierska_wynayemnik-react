import React from "react";
import { Component } from "react";
import LoadData from "./LoadData";
import keycloak from "../auth/keycloak";
import "../styles/App.css";

class Owner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  // pobranie danych dot. endpointów
  async getResources() {
    const response = await fetch("/resources.json");
    const resources = await response.json();

    return resources;
  }

  getData = () => {
    this.getResources().then((res) => {
      fetch(res.urls.owner.premises, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.map((prem) => {
            if (prem.state === "HIRED") {
              prem.state = "wynajęty";
            }
          });
          this.setState({ data: data });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  handleAction = () => {
    alert("działa");
  };

  render() {
    return (
      <div className="content-container">
        <h1 className="content-title">Moje lokale</h1>
        {this.state.data.length > 0 ? (
          <LoadData data={this.state.data} action={this.handleAction} />
        ) : (
          "brak"
        )}
      </div>
    );
  }
}

export default Owner;
