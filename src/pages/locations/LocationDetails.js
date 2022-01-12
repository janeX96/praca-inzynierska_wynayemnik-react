import React, { useState, useEffect } from "react";
import CalculatedProductForm from "./product_forms/CalculatedProductForm";
import DisposableProductForm from "./product_forms/DisposableProductForm";
import MediaQuantityProductForm from "./product_forms/MediaQuantityProductForm";
import MediaStandardProductForm from "./product_forms/MediaStandardProductForm";
import StateProductForm from "./product_forms/StateProductForm";
import { GET, POST, PUT } from "../../utilities/Request";
import { owner, general, admin } from "../../resources/urls";
import { toast } from "react-toastify";
import UpdateProductForm from "./product_forms/UpdateProductForm";
import { AiFillEdit } from "react-icons/ai";

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
  const [mediaStandardProducts, setMediaStandardProducts] = useState();

  const [errors, setErrors] = useState({
    city: false,
    postCode: false,
    street: false,
    streetNumber: false,
  });
  const [sending, setSending] = useState(false);

  const [updateProductId, setUpdateProductId] = useState(-1);
  // const [premisesTypesForProduct, setpremisesTypesForProduct] = useState();

  const getLocationData = async () => {
    GET(`${owner.locationDetails}${props.id}`)
      .then((data) => {
        setLocation(data);
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  //zaciągam produkty typu media standard
  const getProductsMediaStandard = () => {
    const url = `${owner.productsForLocation.prefix}${props.id}${owner.productsForLocation.getAllMediaStandard}`;

    GET(url).then((res) => {
      setMediaStandardProducts(res);
    });
  };

  const getData = () => {
    let premisesTypes = [];

    GET(general.premises.premisesTypes)
      .then((data) => {
        premisesTypes = data.map((type) => {
          return {
            value: type.premisesTypeId,
            label: type.type,
          };
        });
        setPremisesTypes(premisesTypes);
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  const getProducts = () => {
    GET(
      `${owner.productsForLocation.prefix}${props.id}${owner.productsForLocation.allProductsSuffix}`
    )
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
    getProductsMediaStandard();
  }, []);

  useEffect(() => {
    getProducts();
    getProductsMediaStandard();
  }, [productType]);

  const productTypes = [
    { value: "calculated", label: "Wyliczalny" },
    { value: "disposable", label: "Jednorazowy" },
    { value: "media-quantity", label: "Ilościowy" },
    { value: "media-standard", label: "Standardowy" },
    { value: "state", label: "Stałe" },
  ];

  const addProduct = async (product) => {
    if (!sending) {
      setSending(true);
      let suffix = "";
      switch (product.type) {
        case "media-quantity":
          suffix = owner.productsForLocation.addMiediaQuantity;
          break;
        case "media-standard":
          suffix = owner.productsForLocation.addMediaStandard;
          break;
        case "calculated":
          suffix = owner.productsForLocation.addCalculated;
          break;
        case "disposable":
          suffix = owner.productsForLocation.addDisposable;
          break;

        case "state":
          suffix = owner.productsForLocation.addState;
          break;

        default:
          suffix = "";
          break;
      }

      const url = `${owner.productsForLocation.prefix}${props.id}${suffix}`;

      let json = JSON.stringify(product.obj);
      // console.log("Dodaję: ", product.obj);
      POST(url, json)
        .then((response) => {
          if (response.ok) {
            setProductType("wybierz rodzaj");
            toast.success("Produkt został dodany");
            setSending(false);
          }
          // return response.json();
        })
        .catch((err) => {
          console.log("nie udane wysłanie żądania: ", err);
          setSending(false);
        });
    }
  };

  const updateProduct = async (product) => {
    const url = `${owner.productsForLocation.prefix}${props.id}${owner.productsForLocation.updateProduct}${updateProductId}`;
    let json = JSON.stringify(product.obj);
    console.log("obiekt do wysalania: ", product);

    PUT(url, json)
      .then((response) => {
        if (response.ok) {
          setProductType("wybierz rodzaj");
          toast.success("Produkt został zaktualizowany");
          setSending(false);
          setUpdateProductId(-1);
        } else {
          setSending(false);
          response.json().then((res) => {
            toast.error(`Nie udało się aktualizować produktu: ${res.error}`);
          });
        }
        // return response.json();
      })
      .catch((err) => {
        console.log("nie udane wysłanie żądania: ", err);
        setSending(false);
      });
  };

  const productFormRender = (type) => {
    switch (type) {
      case "media-quantity":
        return (
          <MediaQuantityProductForm
            addProduct={addProduct}
            premisesTypes={premisesTypes}
            locationId={props.id}
            mediaStandardProducts={mediaStandardProducts}
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

      case "updateProduct":
        return (
          <UpdateProductForm
            updateProduct={updateProduct}
            premisesTypes={premisesTypes}
            locationId={props.id}
            mediaStandardProducts={mediaStandardProducts}
            updateProductId={updateProductId}
            // premisesTypesForProduct={premisesTypesForProduct}
          />
        );
        break;

      default:
        return null;
        break;
    }
  };

  const handleProductTypeChange = (e) => {
    const value = e.target.value;
    setProductType(value);
  };

  // const getPremisesTypesForProduct = (id) => {
  //   let urlByRole = owner.defaultPrefix;
  //   let url = general.productsForLocation.premisesTypesForProductPrefix;
  //   // props.roles[0] === "owner"
  //   //   ? owner.defaultPrefix
  //   //   : props.roles[0] === "admin"
  //   //   ? admin.defaultPrefix
  //   //   : "";

  //   GET(
  //     // `${urlByRole}${general.productsForLocation.premisesTypesForProductPrefix}${id}`
  //     `${url}${id}`
  //   ).then((res) => {
  //     setpremisesTypesForProduct(res);
  //   });
  // };

  const handleEdit = (id) => {
    setUpdateProductId(id);
    setProductType("updateProduct");
    // getPremisesTypesForProduct(id);
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
    const url = `${owner.updateLocation}${props.id}`;

    PUT(url, json)
      .then((response) => {
        if (response.ok) {
          toast.success("Zmiany zostały zapisane");
          setSending(false);
        }
      })
      .catch((err) => {
        console.log("nie udane wysłanie żądania: ", err);
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
      <h1 className="content-container__title">Szczegóły lokacji</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="city">Miasto: </label>
            </div>
            <div className="row__col-75">
              <input
                className="form-container__input"
                id="city"
                type="text"
                name="city"
                value={location.address.city}
                onChange={handleChange}
              />
              {errors.city && (
                <span className="form-container__error-msg">
                  {messages.city_incorrect}
                </span>
              )}
            </div>
          </div>

          <div className="form-container__row">
            <div className="row__col-25">
              {" "}
              <label htmlFor="postCode">Kod pocztowy: </label>
            </div>
            <div className="row__col-75">
              {" "}
              <input
                className="form-container__input"
                id="postCode"
                type="text"
                name="postCode"
                value={location.address.postCode}
                onChange={handleChange}
              />
              {errors.postCode && (
                <span className="form-container__error-msg">
                  {messages.postCode_incorrect}
                </span>
              )}
            </div>
          </div>

          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="street">Ulica: </label>
            </div>
            <div className="row__col-75">
              <input
                className="form-container__input"
                id="street"
                type="text"
                name="street"
                value={location.address.street}
                onChange={handleChange}
              />
              {errors.street && (
                <span className="form-container__error-msg">
                  {messages.street_incorrect}
                </span>
              )}
            </div>
          </div>

          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="streetNumber">Nr: </label>
            </div>
            <div className="row__col-75">
              <input
                className="form-container__input"
                id="streetNumber"
                type="text"
                name="streetNumber"
                value={location.address.streetNumber}
                onChange={handleChange}
              />
              {errors.streetNumber && (
                <span className="form-container__error-msg">
                  {messages.streetNumber_incorrect}
                </span>
              )}
            </div>
          </div>

          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="locationName">Nazwa: </label>
            </div>
            <div className="row__col-75">
              <input
                className="form-container__input"
                id="locationName"
                type="text"
                name="locationName"
                value={location.locationName}
                onChange={handleChange}
                placeholder="(opcjonalnie)"
              />
              {errors.locationName && (
                <span className="form-container__error-msg">
                  {messages.locationName_incorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__buttons">
            <button onClick={() => props.handleAction(-1)}>Powrót</button>
            <button type="submit">Zapisz</button>
          </div>
        </form>
      </div>

      <h1
        style={{
          marginLeft: "150px",
          color: "#737279",
          paddingTop: "20px",
          fontSize: "30px",
        }}
      >
        Produkty
      </h1>

      <div className="content-container__attach-products">
        <ul>
          {products.map((product) => (
            <li key={product.productName}>
              - {product.productName}
              <div
                className="icon-container"
                style={{ fontSize: "15px" }}
                onClick={() => handleEdit(product.productId)}
              >
                <AiFillEdit className="icon-container__edit-icon" />
                <p>Edycja</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="content-container__attach-products">
        <label htmlFor="productType">
          Dodaj nowy:
          <select
            className="form-container__input"
            value={productType}
            id="productType"
            name="productType"
            onChange={handleProductTypeChange}
          >
            <option key="" value="">
              Wybierz rodzaj
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
