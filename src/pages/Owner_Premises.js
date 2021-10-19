import React from "react";
import { Component } from "react";
import LoadData from "./LoadData";
import keycloak from "../auth/keycloak";
import "../styles/App.css";
import PremisesDetails from "./PremisesDetails/PremisesDetails";
import { Link } from "react-router-dom";

class Owner_Premises extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      choosenId: -1,
      deleteURL: "",
      deletedMessage: "",
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
      this.setState({ deleteURL: res.urls.owner.premisesDelete });
      //pobranie danych z wyciągniętego adresu url
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

            if (prem.furnished) {
              prem.furnished = "tak";
            } else {
              prem.furnished = "nie";
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
      return premises.premisesId === id;
    });
    console.log("wynik: ", res);
    return res;
  }

  //wybierając dany lokal zaamiętuję jego id, jeśi id jest >=0
  // to wyświetlam info, jeśli nie to pokazuje liste lokali
  handleAction = (id) => {
    this.setState({
      choosenId: id,
    });
  };

  deleteShowMessage = (res) => {
    this.handleAction(-1);
    const msg = res
      ? "Lokal został usunięty"
      : "Nie udało się usunąć lokalu...";
    this.setState({
      deletedMessage: msg,
    });
    setTimeout(() => {
      this.setState({
        deletedMessage: "",
      });
    }, 3000);
  };

  render() {
    console.log("render");
    return (
      <div className="content-container">
        {this.state.choosenId >= 0 ? (
          <PremisesDetails
            key={this.state.choosenId}
            action={this.handleAction}
            deleteURL={this.state.deleteURL}
            deleteShowMessage={(res) => this.deleteShowMessage(res)}
            {...this.findDataById(this.state.choosenId)}
          />
        ) : (
          <>
            <h1 className="content-title">Moje lokale</h1>
            <div>
              <Link to="/owner-premises-new">
                <button className="add-button" Link>
                  Dodaj nowy
                </button>
              </Link>
            </div>
            {this.state.data.length > 0 ? (
              <LoadData data={this.state.data} action={this.handleAction} />
            ) : (
              "brak"
            )}
          </>
        )}
        {this.state.deletedMessage && (
          <h2 className="submit-message">{this.state.deletedMessage}</h2>
        )}
      </div>
    );
  }
}

export default Owner_Premises;
