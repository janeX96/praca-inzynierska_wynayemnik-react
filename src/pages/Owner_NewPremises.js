import "../styles/App.css";
import { Component } from "react";
import keycloak from "../auth/keycloak";
import { Link } from "react-router-dom";
import Select from "react-select";

class Owner_NewPremises extends Component {
  state = {
    premisesNumber: "",
    area: "",
    premisesLevel: "",
    premisesType: {
      type: "Mieszkalny",
    },
    furnished: false,
    choosenLocation: "",
    locationId: "",
    locations: [],
    errors: {
      number: false,
      area: false,
      premisesLevel: false,
    },
  };

  async getResources() {
    const response = await fetch("/resources.json");
    const resources = await response.json();

    return resources;
  }

  getData = () => {
    this.getResources().then((res) => {
      //pobranie danych z wyciągniętego adresu url
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
    });
  };

  componentDidMount() {
    this.getData();
  }

  messages = {
    number_incorrect: "Numer lokalu ma nieprawidłową formę",
    area_incorrect: "Powierzchnia ma nieprawidłową formę",
    premisesLevel_incorrect: "Poziom ma nieprawidłową formę",
  };

  handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;
    console.log(name, ", type: ", type);

    if (type === "text" || type === "number" || type === "select-one") {
      const value = e.target.value;
      this.setState({
        [name]: value,
      });
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
    let correct = false;

    //TODO
    // jakie numery uznajemy ???
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

    if (number && area && premisesLevel) {
      correct = false;
    }

    return {
      number,
      area,
      premisesLevel,
      correct,
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const validation = this.formValidation();

    if (validation.correct) {
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
        },
      });
    } else {
      this.setState({
        errors: {
          number: !validation.number,
          area: !validation.area,
          premisesLevel: !validation.premisesLevel,
        },
      });
    }
  };

  //   premisesTypeOptions = [
  //     { value: "residential", label: "Mieszkalny" },
  //     { value: "service", label: "Usługowy" },
  //   ];

  getLocationOptions = () => {
    const options = this.state.locations.map((location) => {
      return {
        name: location.locationName,
        id: location.locationId,
      };
    });

    console.log("opcje: ", options);
  };

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
              {this.state.locations.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
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
              <option value="residential">Mieszkalny</option>
              <option value="service">Usługowy</option>
            </select>
          </label>
          <label htmlFor="isFurnished">
            Umeblowany:
            <input
              onChange={this.handleChange}
              type="checkbox"
              id="isFurnished"
              name="isFurnished"
              checked={this.state.isFurnished}
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
