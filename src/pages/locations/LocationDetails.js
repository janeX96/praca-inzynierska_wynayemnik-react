import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import MediaQuantityProductForm from "./MediaQuantityProductForm";

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
            setPremisesTypes({
              premisesTypes,
            });
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
    const url = urls.productURLPrefix + props.id + "/products?productType=";

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
    setProductType("wybierz rodzaj");

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
          alert("ok");
        }
        return response.json();
      })

      .catch((err) => {
        console.log("nie udane wysłanie żądania: ", err);
      });
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

      default:
        break;
    }
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  return (
    <>
      <h1 className="content-title">Lokacja:</h1>

      <div className="form-container">
        <form onSubmit="">
          <button onClick={() => props.handleAction(-1)}>Powrót</button>

          <div className="row">
            <div className="col-25"></div>
            <div className="col-75"></div>
          </div>

          <div className="row">
            <div className="col-25">
              <label htmlFor="city">Miasto: </label>
            </div>
            <div className="col-75">
              <input
                id="city"
                type="text"
                name="city"
                value={location.address.city}
                // onChange={handleChange}
              />
              {/* {errors.city && (
                <span className="error-msg">{messages.city_incorrect}</span>
              )} */}
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              {" "}
              <label htmlFor="postCode">Kod pocztowy: </label>
            </div>
            <div className="col-75">
              {" "}
              <input
                id="postCode"
                type="text"
                name="postCode"
                value={location.address.postCode}
                // onChange={handleChange}
              />
              {/* {errors.postCode && (
                <span className="error-msg">{messages.postCode_incorrect}</span>
              )} */}
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label htmlFor="street">Ulica: </label>
            </div>
            <div className="col-75">
              <input
                id="street"
                type="text"
                name="street"
                value={location.address.street}
                // onChange={handleChange}
              />
              {/* {errors.street && (
                <span className="error-msg">{messages.street_incorrect}</span>
              )} */}
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label htmlFor="streetNumber">Nr: </label>
            </div>
            <div className="col-75">
              <input
                id="streetNumber"
                type="text"
                name="streetNumber"
                value={location.address.streetNumber}
                // onChange={handleChange}
              />
              {/* {errors.streetNumber && (
                <span className="error-msg">
                  {messages.streetNumber_incorrect}
                </span>
              )} */}
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label htmlFor="locationName">Nazwa: </label>
            </div>
            <div className="col-75">
              <input
                id="locationName"
                type="text"
                name="locationName"
                value={location.locationName}
                // onChange={handleChange}
                placeholder="(opcjonalnie)"
              />
              {/* {errors.locationName && (
                <span className="error-msg">
                  {messages.locationName_incorrect}
                </span>
              )} */}
            </div>
          </div>

          <button type="submit">Zapisz</button>
        </form>
      </div>

      <h1>Produkty</h1>
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
      {productType.length === 0 && (
        <div>
          <ul>
            {products.map((product) => (
              <li key={product.obj.productName}>- {product.obj.productName}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default LocationDetails;
