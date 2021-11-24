import "../../styles/App.css";
import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import { Link } from "react-router-dom";
import WaitIcon from "../../images/icons/wait-icon.png";

const Owner_NewPremises = () => {
  const [state, setState] = useState({
    isSending: false,
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
    lastAdded: -1,
    postURL: "",
    changed: "",
    submitMessage: "",
  });

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getData = () => {
    let postURL = "";
    let locations = [];
    let types = [];
    getResources().then((res) => {
      //pobranie danych z wyciągniętego adresu url
      postURL = res.urls.owner.newPremises;
      fetch(res.urls.owner.locations, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          locations = data.map((location) => {
            return {
              value: location.locationId,
              label: location.locationName,
            };
          });
        })
        .then(() => {
          //pobranie dostępnych typów lokali
          fetch(res.urls.owner.premisesTypes, {
            headers: { Authorization: " Bearer " + keycloak.token },
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              types = data.map((type) => {
                return {
                  value: type.premisesTypeId,
                  label: type.type,
                };
              });
              setState({
                ...state,
                postURL: postURL,
                locations: locations,
                premisesTypes: types,
              });
            });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
      return res;
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (state.changed.length > 0) {
      reactiveValidation();
    }

    if (state.submitMessage !== "") {
      setTimeout(() => {
        setState({
          ...state,
          submitMessage: "",
        });
      }, 3000);
    }
  }, [state.changed, state.submitMessage]);

  const messages = {
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

  const handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;
    setState({ ...state, changed: name });

    if (type === "text" || type === "number" || type === "select-one") {
      const value = e.target.value;

      if (e.target.name === "choosenLocation") {
        let index = e.target.selectedIndex;
        let label = e.target[index].text;
        setState({
          ...state,
          [name]: label,
          locationId: value,
        });
      } else if (e.target.name === "premisesType") {
        setState({
          ...state,
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
        setState({
          ...state,
          newLocation: {
            ...state.newLocation,
            [name]: value,
          },
        });
      } else {
        setState({
          ...state,
          [name]: value,
        });
      }
    } else if (type === "checkbox") {
      const checked = e.target.checked;
      setState({
        ...state,
        [name]: checked,
      });
    }
  };

  //walidacja
  const formValidation = () => {
    let city = false;
    let postCode = false;
    let street = false;
    let streetNumber = false;
    let locationName = false;

    if (state.newLocation.city.length >= 3) {
      city = true;
    }

    if (/^[0-9]{2}-[0-9]{3}$/.test(state.newLocation.postCode)) {
      postCode = true;
    }
    if (state.newLocation.street.length > 3) {
      street = true;
    }
    if (state.newLocation.streetNumber.length > 0) {
      streetNumber = true;
    }
    if (state.newLocation.locationName.length > 1) {
      locationName = true;
    }

    let number = false;
    let area = false;
    let premisesLevel = false;
    let location = false;
    let correct = false;
    let premisesType = false;

    if (
      state.premisesNumber.length > 0 &&
      state.premisesNumber.indexOf(" ") === -1
    ) {
      number = true;
    }

    if (state.area > 0) {
      area = true;
    }

    if (state.premisesLevel.length > 0) {
      premisesLevel = true;
    }

    if (state.choosenLocation.length > 0) {
      location = true;
    }

    if (state.premisesType.type.length > 0) {
      premisesType = true;
    }

    if (number && area && premisesLevel && premisesType) {
      correct = true;
    }

    if (state.choosenLocation.length === 0) {
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

  const validationErrorSetter = (name, condition) => {
    if (condition) {
      setState({
        ...state,
        errors: {
          [name]: false,
        },
      });
    } else {
      setState({
        ...state,
        errors: {
          [name]: true,
        },
      });
    }
  };

  const reactiveValidation = () => {
    const fieldName = state.changed;
    setState({
      ...state,
      changed: "",
    });

    const { city, postCode, street, streetNumber, locationName } =
      state.newLocation;

    const { premisesNumber, area, premisesLevel } = state;
    const { type } = state.premisesType;

    switch (fieldName) {
      case "city":
        validationErrorSetter("city", city.length > 0 && city.length <= 30);
        break;
      case "postCode":
        validationErrorSetter("postCode", /^[0-9]{2}-[0-9]{3}$/.test(postCode));
        break;
      case "street":
        validationErrorSetter(
          "street",
          street.length > 0 && street.length <= 60
        );
        break;
      case "streetNumber":
        validationErrorSetter(
          "streetNumber",
          /^[0-9a-zA-Z]{1,4}$/.test(streetNumber)
        );
        break;
      case "locationName":
        validationErrorSetter(
          "locationName",
          locationName.length > 0 && locationName.length <= 40
        );
        break;
      case "premisesNumber":
        validationErrorSetter(
          "premisesNumber",
          /^[0-9a-zA-Z]{1,10}$/.test(premisesNumber)
        );
        break;
      case "area":
        validationErrorSetter("area", /^[0-9]{1,10}$/.test(area));
        break;
      case "premisesLevel":
        validationErrorSetter(
          "premisesLevel",
          premisesLevel.length > 0 && premisesLevel.length <= 20
        );
        break;
      case "premisesType":
        validationErrorSetter("premisesType", type.length > 0);
        break;

      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.isSending) {
      setState({ ...state, isSending: true });
      const validation = formValidation();

      if (validation.correct) {
        sendPost()
          .then((res) => {
            const message =
              res > 0
                ? "Lokal został dodany"
                : "Wystąpił problem przy dodawaniu lokalu...";

            setState({
              ...state,
              submitMessage: message,
              lastAdded: -1,
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
          })
          .catch((err) => {
            setState({ ...state, isSending: false });
          });
      } else {
        if (state.choosenLocation.length === 0) {
          setState({
            ...state,
            isSending: false,
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
          setState({
            ...state,
            isSending: false,
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
    }
  };

  const sendPost = async () => {
    let newPremises = {};
    if (state.choosenLocation.length > 0) {
      newPremises = {
        area: state.area,
        furnished: state.furnished,
        location: {
          address: null,
          locationName: state.choosenLocation,
        },
        premisesLevel: state.premisesLevel,
        premisesNumber: state.premisesNumber,
        premisesType: {
          type: state.premisesType.type,
        },
      };
    } else {
      newPremises = {
        area: state.area,
        furnished: state.furnished,
        location: {
          address: {
            city: state.newLocation.city,
            postCode: state.newLocation.postCode,
            street: state.newLocation.street,
            streetNumber: state.newLocation.streetNumber,
          },
          locationName: state.newLocation.locationName,
        },
        premisesLevel: state.premisesLevel,
        premisesNumber: state.premisesNumber,
        premisesType: {
          type: state.premisesType.type,
        },
      };
    }

    let json = JSON.stringify(newPremises);
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: " Bearer " + keycloak.token,
      },
      body: json,
    };

    const res = await fetch(state.postURL, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setState({ ...state, lastAdded: data.premisesId });

        return data;
      })
      .catch((err) => {
        console.log("nie udane wysłanie żądania: ", err);
        setState({ ...state, isSending: false });
      });

    return res;
  };

  return (
    <div className="content-container">
      <h1 className="content-title">Nowy lokal</h1>
      <form onSubmit={handleSubmit}>
        <div className="location-choose">
          <label style={{ fontWeight: "bold" }} htmlFor="choosenLocation">
            Wybierz istniejący adres:
            <select
              value={state.locationId}
              name="choosenLocation"
              id="choosenLocation"
              onChange={handleChange}
            >
              <option key="" value=""></option>
              {state.locations.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {state.errors.location && (
              <span className="error-msg">{messages.location_incorrect}</span>
            )}
          </label>
          <p style={{ fontWeight: "bold" }}>Lub dodaj nowy:</p>
          <label htmlFor="city">
            Miasto:
            <input
              id="city"
              type="text"
              name="city"
              disabled={state.choosenLocation.length > 0 ? true : false}
              value={state.newLocation.city}
              onChange={handleChange}
            />
            {state.errors.city && (
              <span className="error-msg">{messages.city_incorrect}</span>
            )}
          </label>
          <label htmlFor="street">
            Ulica:
            <input
              id="street"
              type="text"
              name="street"
              disabled={state.choosenLocation.length > 0 ? true : false}
              value={state.newLocation.street}
              onChange={handleChange}
            />
            {state.errors.street && (
              <span className="error-msg">{messages.street_incorrect}</span>
            )}
          </label>
          <label htmlFor="streetNumber">
            Nr:
            <input
              id="streetNumber"
              type="text"
              name="streetNumber"
              disabled={state.choosenLocation.length > 0 ? true : false}
              value={state.newLocation.streetNumber}
              onChange={handleChange}
            />
            {state.errors.streetNumber && (
              <span className="error-msg">
                {messages.streetNumber_incorrect}
              </span>
            )}
          </label>
          <label htmlFor="postCode">
            Kod pocztowy:
            <input
              id="postCode"
              type="text"
              name="postCode"
              disabled={state.choosenLocation.length > 0 ? true : false}
              value={state.newLocation.postCode}
              onChange={handleChange}
            />
            {state.errors.postCode && (
              <span className="error-msg">{messages.postCode_incorrect}</span>
            )}
          </label>
          <label htmlFor="locationName">
            Nazwa:
            <input
              id="locationName"
              type="text"
              name="locationName"
              disabled={state.choosenLocation.length > 0 ? true : false}
              value={state.newLocation.locationName}
              onChange={handleChange}
            />
            {state.errors.locationName && (
              <span className="error-msg">
                {messages.locationName_incorrect}
              </span>
            )}
          </label>
        </div>
        <div className="new-premises-details">
          <label htmlFor="premisesNumber">
            Numer lokalu:
            <input
              id="premisesNumber"
              type="text"
              name="premisesNumber"
              value={state.premisesNumber}
              onChange={handleChange}
            />
            {state.errors.number && (
              <span className="error-msg">{messages.number_incorrect}</span>
            )}
          </label>
          <label htmlFor="area">
            Powierzchnia lokalu:
            <input
              id="area"
              type="number"
              name="area"
              value={state.area}
              onChange={handleChange}
            />
            {state.errors.area && (
              <span className="error-msg">{messages.area_incorrect}</span>
            )}
          </label>
          <label htmlFor="premisesLevel">
            Poziom:
            <input
              id="premisesLevel"
              type="text"
              name="premisesLevel"
              value={state.premisesLevel}
              onChange={handleChange}
            />
            {state.errors.premisesLevel && (
              <span className="error-msg">
                {messages.premisesLevel_incorrect}
              </span>
            )}
          </label>
          <label htmlFor="premisesType">
            Rodzaj:
            <select
              value={state.premisesType.type}
              id="premisesType"
              name="premisesType"
              onChange={handleChange}
            >
              <option key="" value=""></option>
              {state.premisesTypes.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            {state.errors.premisesType && (
              <span className="error-msg">
                {messages.premisesType_incorrect}
              </span>
            )}
          </label>
          <label htmlFor="furnished">
            Umeblowany:
            <input
              onChange={handleChange}
              type="checkbox"
              id="furnished"
              name="furnished"
              checked={state.furnished}
            />
          </label>
          <Link to="owner-premises">
            <button>Powrót</button>
          </Link>
          {state.isSending ? (
            <img src={WaitIcon} alt="..." />
          ) : (
            <button type="submit">Zapisz</button>
          )}
        </div>
      </form>
      {state.submitMessage && (
        <h3 className="submit-message">{state.submitMessage}</h3>
      )}
    </div>
  );
};

export default Owner_NewPremises;
