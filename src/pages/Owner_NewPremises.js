import "../styles/App.css";
import { Component } from "react";
import keycloak from "../auth/keycloak";
import { Link } from "react-router-dom";

class Owner_NewPremises extends Component {
  state = {
    newLocation: {
      city: "",
      postCode: "",
      street: "",
      streetNumber: "",
      locationName: "",
    },
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
      premisesType: false,
      city: false,
      postCode: false,
      street: false,
      streetNumber: false,
      locationName: false,
    },
    lastAdded: "",
    postURL: "",
    changed: "",
    submitMessage: "",
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

  componentDidUpdate() {
    //walidacja reaktywnie
    if (this.state.changed.length > 0) {
      this.reactiveValidation();
    }

    if (this.state.submitMessage !== "") {
      setTimeout(() => {
        this.setState({
          submitMessage: "",
        });
      }, 3000);
    }
  }

  messages = {
    number_incorrect: "Numer lokalu ma nieprawidłową formę",
    area_incorrect: "Powierzchnia ma nieprawidłową formę",
    premisesLevel_incorrect: "Poziom ma nieprawidłową formę",
    location_incorrect: "Wybierz adres z listy",
    premisesType_incorrect: "Wybierz adres z listy",

    city_incorrect: "Nieprawidłowa nazwa miasta",
    postCode_incorrect: "Nie poprawny kod pocztowy",
    street_incorrect: "Nieprawidłowa nazwa uliicy",
    streetNumber_incorrect: "Nie poprawny numer",
    locationName_incorrect: "Nie poprawna nazwa",
  };

  handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;
    this.setState({ changed: name });
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
      } else if (
        e.target.name === "city" ||
        e.target.name === "postCode" ||
        e.target.name === "street" ||
        e.target.name === "streetNumber" ||
        e.target.name === "locationName"
      ) {
        console.log("zmieniam>>> ", name);
        this.setState({
          newLocation: {
            ...this.state.newLocation,
            [name]: value,
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
    let city = false;
    let postCode = false;
    let street = false;
    let streetNumber = false;
    let locationName = false;

    if (this.state.newLocation.city.length >= 3) {
      city = true;
    }
    //tutaj regex
    if (this.state.newLocation.postCode.length > 3) {
      postCode = true;
    }
    if (this.state.newLocation.street.length > 3) {
      street = true;
    }
    if (this.state.newLocation.streetNumber.length > 0) {
      streetNumber = true;
    }
    if (this.state.newLocation.locationName.length > 1) {
      locationName = true;
    }

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

    if (number && area && premisesLevel && premisesType) {
      correct = true;
    }

    if (this.state.choosenLocation.length === 0) {
      correct =
        correct && city && postCode && street && streetNumber && locationName;
      return {
        city,
        postCode,
        street,
        streetNumber,
        locationName,
        number,
        area,
        premisesLevel,
        location,
        premisesType,
        correct,
      };
    }

    correct = correct && location;
    return {
      number,
      area,
      premisesLevel,
      location,
      premisesType,
      correct,
    };
  };

  validationErrorSetter = (name, condition) => {
    if (condition) {
      this.setState({
        errors: {
          [name]: false,
        },
      });
    } else {
      this.setState({
        errors: {
          [name]: true,
        },
      });
    }
  };

  reactiveValidation = () => {
    const fieldName = this.state.changed;
    this.setState({
      changed: "",
    });

    const { city, postCode, street, streetNumber, locationName } =
      this.state.newLocation;

    const { premisesNumber, area, premisesLevel } = this.state;
    const { type } = this.state.premisesType;

    switch (fieldName) {
      case "city":
        this.validationErrorSetter(
          "city",
          city.length > 0 && city.length <= 30
        );
        break;
      case "postCode":
        this.validationErrorSetter(
          "postCode",
          /[0-9]{2}-[0-9]{3}/.test(postCode)
        );
        break;
      case "street":
        this.validationErrorSetter(
          "street",
          street.length > 0 && street.length <= 60
        );
        break;
      case "streetNumber":
        this.validationErrorSetter(
          "streetNumber",
          /^[0-9a-zA-Z]{1,4}$/.test(streetNumber)
        );
        break;
      case "locationName":
        this.validationErrorSetter(
          "locationName",
          locationName.length > 0 && locationName.length <= 40
        );
        break;
      case "premisesNumber":
        this.validationErrorSetter(
          "premisesNumber",
          /^[0-9a-zA-Z]{1,10}$/.test(premisesNumber)
        );
        break;
      case "area":
        this.validationErrorSetter("area", /^[0-9]{1,10}$/.test(area));
        break;
      case "premisesLevel":
        this.validationErrorSetter(
          "premisesLevel",
          premisesLevel.length > 0 && premisesLevel.length <= 20
        );
        break;
      case "premisesType":
        this.validationErrorSetter("premisesType", type.length > 0);
        break;

      default:
        return null;
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const validation = this.formValidation();

    if (validation.correct) {
      this.sendPost();

      this.setState({
        submitMessage: "Lokal został dodany",
        newLocation: {
          city: "",
          postCode: "",
          street: "",
          streetNumber: "",
          locationName: "",
        },
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
          premisesType: false,
          city: false,
          postCode: false,
          street: false,
          streetNumber: false,
          locationName: false,
        },
      });
    } else {
      if (this.state.choosenLocation.length === 0) {
        this.setState({
          errors: {
            number: !validation.number,
            area: !validation.area,
            premisesLevel: !validation.premisesLevel,
            premisesType: !validation.premisesType,
            city: !validation.city,
            postCode: !validation.postCode,
            street: !validation.street,
            streetNumber: !validation.streetNumber,
            locationName: !validation.locationName,
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
    }
  };

  sendPost = () => {
    let newPremises = {};
    if (this.state.choosenLocation.length > 0) {
      newPremises = {
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
    } else {
      newPremises = {
        area: this.state.area,
        furnished: this.state.furnished,
        location: {
          address: {
            city: this.state.newLocation.city,
            postCode: this.state.newLocation.postCode,
            street: this.state.newLocation.street,
            streetNumber: this.state.newLocation.streetNumber,
          },
          locationName: this.state.newLocation.locationName,
        },
        premisesLevel: this.state.premisesLevel,
        premisesNumber: this.state.premisesNumber,
        premisesType: {
          type: this.state.premisesType.type,
        },
      };
    }

    console.log("wysyłam:", JSON.stringify(newPremises));
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

  render() {
    return (
      <div className="content-container">
        <h1 className="content-title">Nowy lokal</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="location-choose">
            <label style={{ fontWeight: "bold" }} htmlFor="choosenLocation">
              Wybierz istniejący adres:
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
            <p style={{ fontWeight: "bold" }}>Lub dodaj nowy:</p>
            <label htmlFor="city">
              Miasto:
              <input
                id="city"
                type="text"
                name="city"
                disabled={this.state.choosenLocation.length > 0 ? true : false}
                value={this.state.newLocation.city}
                onChange={this.handleChange}
              />
              {this.state.errors.city && (
                <span className="error-msg">
                  {this.messages.city_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="street">
              Ulica:
              <input
                id="street"
                type="text"
                name="street"
                disabled={this.state.choosenLocation.length > 0 ? true : false}
                value={this.state.newLocation.street}
                onChange={this.handleChange}
              />
              {this.state.errors.street && (
                <span className="error-msg">
                  {this.messages.street_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="streetNumber">
              Nr:
              <input
                id="streetNumber"
                type="text"
                name="streetNumber"
                disabled={this.state.choosenLocation.length > 0 ? true : false}
                value={this.state.newLocation.streetNumber}
                onChange={this.handleChange}
              />
              {this.state.errors.streetNumber && (
                <span className="error-msg">
                  {this.messages.streetNumber_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="postCode">
              Kod pocztowy:
              <input
                id="postCode"
                type="text"
                name="postCode"
                disabled={this.state.choosenLocation.length > 0 ? true : false}
                value={this.state.newLocation.postCode}
                onChange={this.handleChange}
              />
              {this.state.errors.postCode && (
                <span className="error-msg">
                  {this.messages.postCode_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="locationName">
              Nazwa:
              <input
                id="locationName"
                type="text"
                name="locationName"
                disabled={this.state.choosenLocation.length > 0 ? true : false}
                value={this.state.newLocation.locationName}
                onChange={this.handleChange}
              />
              {this.state.errors.locationName && (
                <span className="error-msg">
                  {this.messages.locationName_incorrect}
                </span>
              )}
            </label>
          </div>

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
        {this.state.submitMessage && (
          <h3 className="submit-message">{this.state.submitMessage}</h3>
        )}
      </div>
    );
  }
}

export default Owner_NewPremises;
