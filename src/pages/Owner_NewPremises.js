import "../styles/App.css";
import { Component } from "react";
import keycloak from "../auth/keycloak";
import { Link } from "react-router-dom";

class Owner_NewPremises extends Component {
  state = {
    premisesNumber: "",
    area: "",
    premisesLevel: "",
    premisesType: {
      type: "",
    },
    furnished: false,
    choosenLocation: "",
    locationId: "",
    locations: [],
    premisesTypes: [],
    errors: {
      number: false,
      area: false,
      premisesLevel: false,
      location: false,
    },
    lastAdded: "",
    postURL: "",
  };

  async getResources() {
    const response = await fetch("/resources.json");
    const resources = await response.json();

    return resources;
  }

  getData = () => {
    this.getResources().then((res) => {
      //pobranie danych z wyciągniętego adresu url
      this.setState({
        postURL: res.urls.owner.newPremises,
      });
      fetch(res.urls.owner.locations, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const options = data.map((location) => {
            return {
              value: location.locationId,
              label: location.locationName,
            };
          });
          this.setState({ locations: options });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });

      //pobranie dostępnych typów lokali
      fetch(res.urls.owner.premisesTypes, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const options = data.map((type) => {
            return {
              value: type.premisesTypeId,
              label: type.type,
            };
          });
          this.setState({
            premisesTypes: options,
          });
        });
    });
  };

  componentDidMount() {
    this.getData();
  }

  messages = {
    number_incorrect: "Numer lokalu ma nieprawidłową formę",
    area_incorrect: "Powierzchnia ma nieprawidłową formę",
    premisesLevel_incorrect: "Poziom ma nieprawidłową formę",
    location_incorrect: "Wybierz adres z listy",
  };

  handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;
    console.log(name, ", type: ", type);

    if (type === "text" || type === "number" || type === "select-one") {
      const value = e.target.value;

      if (e.target.name === "choosenLocation") {
        let index = e.target.selectedIndex;
        let label = e.target[index].text;
        this.setState({
          [name]: label,
          locationId: value,
        });
      } else if (e.target.name === "premisesType") {
        this.setState({
          premisesType: {
            type: value,
          },
        });
      } else {
        this.setState({
          [name]: value,
        });
      }
    } else if (type === "checkbox") {
      const checked = e.target.checked;
      this.setState({
        [name]: checked,
      });
    }
  };

  //walidacja
  formValidation = () => {
    let number = false;
    let area = false;
    let premisesLevel = false;
    let location = false;
    let correct = false;
    let premisesType = false;

    if (
      this.state.premisesNumber.length > 0 &&
      this.state.premisesNumber.indexOf(" ") === -1
    ) {
      number = true;
    }

    if (this.state.area > 0) {
      area = true;
    }

    if (this.state.premisesLevel.length > 0) {
      premisesLevel = true;
    }

    if (this.state.choosenLocation.length > 0) {
      location = true;
    }

    if (this.state.premisesType.type.length > 0) {
      premisesType = true;
    }

    if (number && area && premisesLevel && location && premisesType) {
      correct = true;
    }

    return {
      number,
      area,
      premisesLevel,
      location,
      premisesType,
      correct,
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const validation = this.formValidation();

    if (validation.correct) {
      this.sendPost();

      this.setState({
        premisesNumber: "",
        area: "",
        premisesLevel: "",
        state: "",
        premisesType: {
          type: "",
        },
        locationId: "",
        furnished: false,

        errors: {
          number: false,
          area: false,
          premisesLevel: false,
          location: false,
        },
      });
    } else {
      this.setState({
        errors: {
          number: !validation.number,
          area: !validation.area,
          premisesLevel: !validation.premisesLevel,
          location: !validation.location,
          premisesType: !validation.premisesType,
        },
      });
    }
  };

  sendPost = () => {
    const newPremises = {
      area: this.state.area,
      furnished: this.state.furnished,
      location: {
        address: null,
        locationName: this.state.choosenLocation,
      },
      premisesLevel: this.state.premisesLevel,
      premisesNumber: this.state.premisesNumber,
      premisesType: {
        type: this.state.premisesType.type,
      },
    };

    // console.log("wysyłam:", JSON.stringify(newPremises));
    let json = JSON.stringify(newPremises);
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json", //"application/json",
        Authorization: " Bearer " + keycloak.token,
      },
      body: json,
    };

    // console.log(requestOptions);
    fetch(this.state.postURL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({ lastAdded: data.premisesId });
      })
      .catch((err) => console.log(err));
  };

  //   premisesTypeOptions = [
  //     { value: "residential", label: "Mieszkalny" },
  //     { value: "service", label: "Usługowy" },
  //   ];

  render() {
    return (
      <div className="content-container">
        <h1 className="content-title">Nowy lokal</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="choosenLocation">
            Adres:
            <select
              value={this.state.locationId}
              name="choosenLocation"
              id="choosenLocation"
              onChange={this.handleChange}
            >
              <option value=""></option>
              {this.state.locations.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
            {this.state.errors.location && (
              <span className="error-msg">
                {this.messages.location_incorrect}
              </span>
            )}
          </label>
          <label htmlFor="premisesNumber">
            Numer lokalu:
            <input
              id="premisesNumber"
              type="text"
              name="premisesNumber"
              value={this.state.premisesNumber}
              onChange={this.handleChange}
            />
            {this.state.errors.number && (
              <span className="error-msg">
                {this.messages.number_incorrect}
              </span>
            )}
          </label>
          <label htmlFor="area">
            Powierzchnia lokalu:
            <input
              id="area"
              type="number"
              name="area"
              value={this.state.area}
              onChange={this.handleChange}
            />
            {this.state.errors.area && (
              <span className="error-msg">{this.messages.area_incorrect}</span>
            )}
          </label>
          <label htmlFor="premisesLevel">
            Poziom:
            <input
              id="premisesLevel"
              type="text"
              name="premisesLevel"
              value={this.state.premisesLevel}
              onChange={this.handleChange}
            />
            {this.state.errors.premisesLevel && (
              <span className="error-msg">
                {this.messages.premisesLevel_incorrect}
              </span>
            )}
          </label>
          <label htmlFor="premisesType">
            Rodzaj:
            <select
              value={this.state.premisesType.type}
              id="premisesType"
              name="premisesType"
              onChange={this.handleChange}
            >
              <option value=""></option>
              {this.state.premisesTypes.map((option) => (
                <option value={option.label}>{option.label}</option>
              ))}
            </select>
            {this.state.errors.premisesType && (
              <span className="error-msg">
                {this.messages.premisesType_incorrect}
              </span>
            )}
          </label>
          <label htmlFor="furnished">
            Umeblowany:
            <input
              onChange={this.handleChange}
              type="checkbox"
              id="furnished"
              name="furnished"
              checked={this.state.furnished}
            />
          </label>
          <Link to="owner-premises">
            <button>Powrót</button>
          </Link>
          <button type="submit">Zapisz</button>
        </form>
      </div>
    );
  }
}

export default Owner_NewPremises;
