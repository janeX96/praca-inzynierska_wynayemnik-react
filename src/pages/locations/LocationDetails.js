import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import CalculatedProductForm from "./product_forms/CalculatedProductForm";
import DisposableProductForm from "./product_forms/DisposableProductForm";
import MediaQuantityProductForm from "./product_forms/MediaQuantityProductForm";
import MediaStandardProductForm from "./product_forms/MediaStandardProductForm";
import StateProductForm from "./product_forms/StateProductForm";

const LocationDetails = (props) => {
  const [location, setLocation] = useState({
    locationName: "",
    address: {
      city: "",
      street: "",
      postCode: "",
      streetNumber: "",
    },
  });
  const [productType, setProductType] = useState("");
  const [products, setProducts] = useState([]);
  const [premisesTypes, setPremisesTypes] = useState([]);
  const [urls, setUrls] = useState({
    postURL: "",
    productURLPrefix: "",
    calculatedProdPostURL: "",
    disposableProdPostURL: "",
    mediaQuantProdPostURL: "",
    mediaStandProdPostURL: "",
    stateProdPostURL: "",
  });
  const [errors, setErrors] = useState({
    city: false,
    postCode: false,
    street: false,
    streetNumber: false,
  });
  const [sending, setSending] = useState(false);

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getLocationData = async () => {
    getResources().then((res) => {
      const url = res.urls.owner.locationDetails + props.id;
      fetch(url, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLocation(data);
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  const getData = () => {
    let postURL = "";
    let productURLPrefix = "";
    let calculatedProdPostURL = "";
    let disposableProdPostURL = "";
    let mediaQuantProdPostURL = "";
    let mediaStandProdPostURL = "";
    let stateProdPostURL = "";
    let premisesTypes = [];
    getResources()
      .then((res) => {
        console.log(res.urls.owner.newLocation);
        postURL = res.urls.owner.newLocation;
        productURLPrefix = res.urls.owner.products.prefix;
        calculatedProdPostURL = res.urls.owner.products.addCalculated;
        disposableProdPostURL = res.urls.owner.products.addDisposable;
        mediaQuantProdPostURL = res.urls.owner.products.addMiediaQuantity;
        mediaStandProdPostURL = res.urls.owner.products.addMediaStandard;
        stateProdPostURL = res.urls.owner.products.addState;

        fetch(res.urls.owner.premisesTypes, {
          headers: { Authorization: " Bearer " + keycloak.token },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            premisesTypes = data.map((type) => {
              return {
                value: type.premisesTypeId,
                label: type.type,
              };
            });
            setPremisesTypes(premisesTypes);
            setUrls({
              postURL,
              productURLPrefix,
              calculatedProdPostURL,
              disposableProdPostURL,
              mediaQuantProdPostURL,
              mediaStandProdPostURL,
              stateProdPostURL,
            });
          });
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  const getProducts = () => {
    const url =
      "http://localhost:8080/owner/location/" + props.id + "/productGroupType";

    console.log("url >>>:", url);
    fetch(url, {
      headers: { Authorization: " Bearer " + keycloak.token },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  useEffect(() => {
    getLocationData();
    getData();
    getProducts();
  }, []);

  useEffect(() => {
    getProducts();
  }, [productType]);

  const productTypes = [
    { value: "calculated", label: "Wyliczalny" },
    { value: "disposable", label: "Jednorazowy" },
    { value: "media-quantity", label: "Wyliczane z pola" },
    { value: "media-standard", label: "Standardowy" },
    { value: "state", label: "Stałe" },
  ];

  const addProduct = async (product) => {
    if (!sending) {
      setSending(true);
      const url =
        urls.productURLPrefix + props.id + "/product/" + product.type + "/add";

      let json = JSON.stringify(product.obj);
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: " Bearer " + keycloak.token,
        },
        body: json,
      };
      const res = await fetch(url, requestOptions)
        .then((response) => {
          if (response.ok) {
            setProductType("wybierz rodzaj");
            setSending(false);
          }
          return response.json();
        })

        .catch((err) => {
          console.log("nie udane wysłanie żądania: ", err);
          setSending(false);
        });
    }
  };

  const productFormRender = (type) => {
    switch (type) {
      case "media-quantity":
        return (
          <MediaQuantityProductForm
            addProduct={addProduct}
            premisesTypes={premisesTypes}
          />
        );
        break;

      case "state":
        return (
          <StateProductForm
            addProduct={addProduct}
            premisesTypes={premisesTypes}
          />
        );
        break;

      case "calculated":
        return (
          <CalculatedProductForm
            addProduct={addProduct}
            premisesTypes={premisesTypes}
          />
        );
        break;

      case "disposable":
        return (
          <DisposableProductForm
            addProduct={addProduct}
            premisesTypes={premisesTypes}
          />
        );
        break;

      case "media-standard":
        return (
          <MediaStandardProductForm
            addProduct={addProduct}
            premisesTypes={premisesTypes}
          />
        );
        break;

      default:
        return null;
        break;

    }
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
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
  const messages = {
    city_incorrect: "wpisz 3-30 znaków",
    postCode_incorrect: "wpisz poprawny kod pocztowy (00-000)",
    street_incorrect: "wpisz 3-60 znaków",
    streetNumber_incorrect: "wpisz 1-4 znaków",
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;
    const value = e.target.value;

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

  const sendPost = async () => {
    let json = JSON.stringify(location);
    const requestOptions = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: " Bearer " + keycloak.token,
      },
      body: json,
    };

    const res = await fetch(
      `http://localhost:8080/owner/location/${props.id}`,
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          console.log("OK");
          setSending(false);
        }
        return response.json();
      })
      .catch((err) => {
        console.error("nie udane wysłanie żądania: ", err);
        setSending(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sending) {
      setSending(true);
      const validation = formValidation();
      if (validation.correct) {
        sendPost();

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
      <h1 className="content-title">Lokacja:</h1>

      <form onSubmit={handleSubmit}>
        <button onClick={() => props.handleAction(-1)}>Powrót</button>
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
              value={location.locationName}
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
        <button type="submit">Zapisz</button>
      </form>

      <h1>Produkty</h1>

      <div>
        <ul>
          {products.map((product) => (
            <li key={product.productName}>- {product.productName}</li>
          ))}
        </ul>
      </div>

      <div className="attach-products">
        <label htmlFor="productType">
          Dodaj nowy:
          <select
            value={productType}
            id="productType"
            name="productType"
            onChange={handleProductTypeChange}
          >
            <option key="" value="">
              wybierz rodzaj
            </option>
            {productTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {productFormRender(productType)}
      </div>
    </>
  );
};

export default LocationDetails;
