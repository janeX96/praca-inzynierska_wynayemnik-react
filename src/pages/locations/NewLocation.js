import { useState, useEffect } from "react";
import "../../styles/App.css";
import CalculatedProductForm from "./CalculatedProductForm";

const NewLocation = () => {
  const [location, setLocation] = useState({
    address: {
      city: "",
      postCode: "",
      street: "",
      streetNumber: "",
    },
    locationName: "",
  });
  const [productType, setProductType] = useState("");
  const [products, setProducts] = useState([]);
  const [changed, setChanged] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({
    city: false,
    postCode: false,
    street: false,
    streetNumber: false,
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
    if (changed.length > 0) {
      reactiveValidation();
    }
  }, [changed]);

  const messages = {
    city_incorrect: "wpisz 3-30 znaków",
    postCode_incorrect: "wpisz poprawny kod pocztowy (00-000)",
    street_incorrect: "wpisz 3-60 znaków",
    streetNumber_incorrect: "wpisz 1-4 znaków",
  };

  const formValidation = () => {
    let city = false;
    let postCode = false;
    let street = false;
    let streetNumber = false;
    // let locationName = false;

    if (
      location.address.city.length > 2 &&
      location.address.city.length <= 30
    ) {
      city = true;
    }

    if (/^[0-9]{2}-[0-9]{3}$/.test(location.address.postCode)) {
      postCode = true;
    }

    if (
      location.address.street.length > 2 &&
      location.address.street.length < 60
    ) {
      street = true;
    }

    if (
      location.address.streetNumber.length > 0 &&
      location.address.streetNumber.length <= 4
    ) {
      streetNumber = true;
    }

    let correct = city && postCode && street && streetNumber;

    return { city, postCode, street, streetNumber, correct };
  };

  const validationErrorSetter = (name, condition) => {
    if (condition) {
      setErrors({
        ...errors,
        [name]: false,
      });
    } else {
      setErrors({
        ...errors,
        [name]: true,
      });
    }
  };

  const reactiveValidation = () => {
    const fieldName = changed;
    setChanged(false);
    const { city, postCode, street, streetNumber } = location.address;

    switch (fieldName) {
      case "city":
        validationErrorSetter("city", city.length > 2 && city.length <= 30);
        break;
      case "postCode":
        validationErrorSetter("postCode", /^[0-9]{2}-[0-9]{3}$/.test(postCode));
        break;
      case "street":
        validationErrorSetter(
          "street",
          street.length > 2 && street.length <= 60
        );
        break;
      case "streetNumber":
        validationErrorSetter(
          "streetNumber",
          /^[0-9a-zA-Z]{1,4}$/.test(streetNumber)
        );
        break;

      default:
        return null;
    }
  };

  const productTypes = [
    { value: "calculated", label: "Wyliczalny" },
    { value: "disposable", label: "Jednorazowy" },
    { value: "media-quantity", label: "Wyliczane z pola" },
    { value: "media-standard", label: "Standardowy" },
    { value: "state", label: "Stałe" },
  ];

  const productFormRender = (type) => {
    switch (type) {
      case "calculated":
        return <CalculatedProductForm addProduct={addProduct} />;
        break;

      default:
        break;
    }
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;
    const value = e.target.value;
    setChanged(name);
    if (name === "locationName") {
      setLocation({ ...location, [name]: value });
    } else {
      setLocation({
        ...location,
        address: {
          ...location.address,
          [name]: value,
        },
      });
    }
  };

  const addProduct = (product) => {
    let prods = [...products];
    prods.push(product);

    setProducts(prods);
    setProductType("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sending) {
      setSending(true);
      const validation = formValidation();
      if (validation.correct) {
        setLocation({
          address: {
            city: "",
            postCode: "",
            street: "",
            streetNumber: "",
          },
          locationName: "",
        });
        setErrors({
          city: false,
          postCode: false,
          street: false,
          streetNumber: false,
        });
      } else {
        setErrors({
          city: !validation.city,
          postCode: !validation.postCode,
          street: !validation.street,
          streetNumber: !validation.streetNumber,
        });
      }
      setSending(false);
    }
  };

  return (
    <>
      <div className="content-container">
        <h1 className="content-title">Nowa Lokacja</h1>
        <form onSubmit={handleSubmit}>
          <div className="new-premises-details">
            <label htmlFor="city">
              Miasto:
              <input
                id="city"
                type="text"
                name="city"
                value={location.address.city}
                onChange={handleChange}
              />
              {errors.city && (
                <span className="error-msg">{messages.city_incorrect}</span>
              )}
            </label>
            <label htmlFor="postCode">
              Kod pocztowy:
              <input
                id="postCode"
                type="text"
                name="postCode"
                value={location.address.postCode}
                onChange={handleChange}
              />
              {errors.postCode && (
                <span className="error-msg">{messages.postCode_incorrect}</span>
              )}
            </label>
            <label htmlFor="street">
              Ulica:
              <input
                id="street"
                type="text"
                name="street"
                value={location.address.street}
                onChange={handleChange}
              />
              {errors.street && (
                <span className="error-msg">{messages.street_incorrect}</span>
              )}
            </label>
            <label htmlFor="streetNumber">
              Nr:
              <input
                id="streetNumber"
                type="text"
                name="streetNumber"
                value={location.address.streetNumber}
                onChange={handleChange}
              />
              {errors.streetNumber && (
                <span className="error-msg">
                  {messages.streetNumber_incorrect}
                </span>
              )}
            </label>
            <label htmlFor="locationName">
              Nazwa:
              <input
                id="locationName"
                type="text"
                name="locationName"
                value={location.address.locationName}
                onChange={handleChange}
                placeholder="(opcjonalnie)"
              />
              {errors.locationName && (
                <span className="error-msg">
                  {messages.locationName_incorrect}
                </span>
              )}
            </label>
          </div>
          <h1>Produkty</h1>
          <div className="attach-products">
            <select
              value={productType}
              id="productType"
              name="productType"
              onChange={handleProductTypeChange}
            >
              <option key="" value=""></option>
              {productTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {productType.length === 0 && (
            <div>
              <ul>
                {products.map((product) => (
                  <li key={product.obj.productName}>
                    {product.obj.productName}
                  </li>
                ))}
              </ul>
              <button type="submit">Dodaj</button>
            </div>
          )}
        </form>
        {productFormRender(productType)}
      </div>
    </>
  );
};

export default NewLocation;
