import React from "react";
import { Component } from "react";
import LoadData from "./LoadData";
import keycloak from "../auth/keycloak";
import "../styles/App.css";
import PremisesDetails from "./PremisesDetails/PremisesDetails";

class Owner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      choosenId: -1,
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
            } else {
              prem.state = "wolny";
            }

            if (prem.isFurnished) {
              prem.isFurnished = "tak";
            } else {
              prem.isFurnished = "nie";
            }
          });
          this.setState({ data: data });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  findDataById(id) {
    const res = this.state.data.find((premises) => {
      return premises.premisesNumber === id;
    });
    console.log("wynik: ", res);
    return res;
  }

  handleAction = (id) => {
    this.setState({
      choosenId: id,
    });
  };

  render() {
    console.log("w renderze: ", this.findDataById(this.state.choosenId));
    return (
      <div className="content-container">
        {this.state.choosenId >= 0 ? (
          <PremisesDetails
            key={this.state.choosenId}
            action={this.handleAction}
            {...this.findDataById(this.state.choosenId)}
          />
        ) : (
          <>
            <h1 className="content-title">Moje lokale</h1>
            {this.state.data.length > 0 ? (
              <LoadData data={this.state.data} action={this.handleAction} />
            ) : (
              "brak"
            )}
          </>
        )}
      </div>
    );
  }
}

export default Owner;
