import { useState } from "react";
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

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getData = () => {};

  const messages = {};

  const formValidation = () => {};

  const reactiveValidation = () => {};

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
        return <CalculatedProductForm />;
        break;

      default:
        break;
    }
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const handleChange = (e) => {};

  const addProduct = (product) => {
    let prods = [...products];
    prods.push(product);

    setProducts(prods);
  };

  const handleSubmit = (e) => {};

  return (
    <>
      <div className="content-container">
        <h1 className="content-title">Nowa Lokacja</h1>
        <form onSubmit="">
          <div className="new-premises-details">
            <label htmlFor="city">
              Miasto:
              <input
                id="city"
                type="text"
                name="city"
                value={location.address.city}
                // onChange={handleChange}
              />
              {/* {state.errors.city && (
                <span className="error-msg">{messages.city_incorrect}</span>
              )} */}
            </label>
            <label htmlFor="postCode">
              Kod pocztowy:
              <input
                id="postCode"
                type="text"
                name="postCode"
                value={location.address.postCode}
                // onChange={handleChange}
              />
              {/* {state.errors.postCode && (
                <span className="error-msg">{messages.postCode_incorrect}</span>
              )} */}
            </label>
            <label htmlFor="street">
              Ulica:
              <input
                id="street"
                type="text"
                name="street"
                value={location.address.street}
                // onChange={handleChange}
              />
              {/* {state.errors.street && (
                <span className="error-msg">{messages.street_incorrect}</span>
              )} */}
            </label>
            <label htmlFor="streetNumber">
              Nr:
              <input
                id="streetNumber"
                type="text"
                name="streetNumber"
                value={location.address.streetNumber}
                // onChange={handleChange}
              />
              {/* {state.errors.streetNumber && (
                <span className="error-msg">
                  {messages.streetNumber_incorrect}
                </span>
              )} */}
            </label>
            <label htmlFor="locationName">
              Nazwa:
              <input
                id="locationName"
                type="text"
                name="locationName"
                value={location.address.locationName}
                // onChange={handleChange}
              />
              {/* {state.errors.locationName && (
                <span className="error-msg">
                  {messages.locationName_incorrect}
                </span>
              )} */}
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
        </form>
        {productFormRender(productType)}
      </div>
    </>
  );
};

export default NewLocation;
