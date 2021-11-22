import "../../styles/App.css";
import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";

const PremisesEdit = (props) => {
  const [state, setState] = useState({
    newLocation: {
      city: "",
      postCode: "",
      street: "",
      streetNumber: "",
      locationName: "",
    },
    premisesId: props.premisesId,
    premisesNumber: props.data.premisesNumber,
    area: props.data.area,
    premisesLevel: props.data.premisesLevel,
    premisesType: {
      type: props.data.premisesType.type,
    },
    furnished: props.data.furnished,
    choosenLocation: props.data.location.locationName,
    locationId: props.data.location.locationName,
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
    putURL: "",
    changed: "",
  });

  // const [changed, setChanged] = useState("");

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();

    return resources;
  };

  const getData = () => {
    getResources().then((res) => {
      //pobranie danych z wyciągniętego adresu url
      let putURL = res.urls.owner.premisesUpdate;
      let locations = [];
      let types = [];
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
          locations = options;
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
              const options = data.map((type) => {
                return {
                  value: type.premisesTypeId,
                  label: type.type,
                };
              });
              types = options;
              setState({
                ...state,
                premisesTypes: types,
                locations: locations,
                putURL: putURL,
              });
            });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (state.changed.length > 0) {
      setState({ ...state, changed: "" });
      reactiveValidation();
    }
  }, [state.changed]);

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
            ...this.state.newLocation,
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
    //tutaj regex
    if (state.newLocation.postCode.length > 3) {
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
        validationErrorSetter("postCode", /[0-9]{2}-[0-9]{3}/.test(postCode));
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

    const validation = formValidation();

    if (validation.correct) {
      sendPut().then((res) => {
        //na podstawie odpowiedzi od serwera określam komunikat (nie)powodzenia

        const message = res
          ? "Zmiany zostały zapisane"
          : "Nie udało się zapisać zmian...";

        setState({
          ...state,
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
        // console.log("wustawim odpowiedz na : ", message);
        props.edited(message);
      });
    } else {
      if (state.choosenLocation.length === 0) {
        setState({
          ...state,
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

  const sendPut = async () => {
    let newPremises = {};
    const isFurnished = state.furnished === "tak" ? true : false;
    if (state.choosenLocation.length > 0) {
      newPremises = {
        area: state.area,
        furnished: isFurnished,
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
        furnished: isFurnished,
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
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json", //"application/json",
        Authorization: " Bearer " + keycloak.token,
      },
      body: json,
    };

    let ok = false;
    const res = await fetch(
      state.putURL + `${state.premisesId}`,
      requestOptions
    )
      .then((data) => {
        if (data.ok) {
          ok = true;
        }
        return data;
      })
      .catch((err) => console.log(err));

    return ok;
  };

  return (
    <div className="content-container">
      <h1 className="content-title">Edycja lokalu</h1>
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
              <option value=""></option>
              {state.locations.map((option) => (
                <option value={option.value}>{option.label}</option>
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
            <option value=""></option>
            {state.premisesTypes.map((option) => (
              <option value={option.label}>{option.label}</option>
            ))}
          </select>
          {state.errors.premisesType && (
            <span className="error-msg">{messages.premisesType_incorrect}</span>
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

        <button onClick={props.return}>Powrót</button>

        <button type="submit">Zapisz</button>
      </form>
    </div>
  );
};

export default PremisesEdit;
