import "../../../styles/App.scss";
import { useState, useEffect } from "react";
import { GET } from "../../../utilities/Request";
import { owner } from "../../../resources/urls";

const MediaQuantityProductForm = (props) => {
  const [data, setData] = useState({
    type: "media-quantity",
    obj: {
      forAttribute: "",
      netto: true,
      premisesTypes: [],
      price: 0,
      productName: "",
      quantityUnit: "",
      vat: "",
    },
  });

  const [premisesTypes, setPremisesTypes] = useState(props.premisesTypes);

  const [pattern, setPattern] = useState({
    attr1: "",
    arithm: "-",
    attr2: "",
  });

  const [errors, setErrors] = useState({
    premisesTypes: false,
    price: false,
    productName: false,
    quantityUnit: false,
    vat: false,
    attr1: false,
    attr2: false,
  });

  const messages = {
    premisesTypesError: "Wybierz przynajmniej jeden",
    priceError: "Podaj cenę",
    productNameError: "Podaj nazwę produktu",
    quantityError: "Podaj ilość",
    quantityUnitError: "Podaj jednostkę miary",
    vatError: "Wpisz wartość podatku VAT",
    attr1Error: "Wybierz pozycję z listy",
    attr2Error: "Wybierz pozycję z listy",
  };

  useEffect(() => {
    const forAttribute =
      pattern.attr1 + " " + pattern.arithm + " " + pattern.attr2;
    setData({ ...data, obj: { ...data.obj, forAttribute } });
  }, [pattern]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = formValidation();

    if (validation.correct) {
      const forAttributePattern =
        pattern.attr1 + " " + pattern.arithm + " " + pattern.attr2;
      // setData({ ...data, obj: { ...data.obj, forAttribute } });
      let product = data;

      product.obj.forAttribute = forAttributePattern;

      props.addProduct(product);

      setErrors({
        premisesTypes: false,
        price: false,
        productName: false,
        quantityUnit: false,
        vat: false,
        attr1: false,
        attr2: false,
      });
    } else {
      setErrors({
        premisesTypes: !validation.premisesTypes,
        price: !validation.price,
        productName: !validation.productName,
        quantityUnit: !validation.quantityUnit,
        vat: !validation.vat,
        attr1: !validation.attr1,
        attr2: !validation.attr2,
      });
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;

    if (type === "text" || type === "number" || type === "select-one") {
      const value = e.target.value;

      if (name === "attr1" || name === "attr2" || name === "arithm") {
        setPattern({ ...pattern, [name]: value });
      } else {
        setData({ ...data, obj: { ...data.obj, [name]: value } });
      }
    } else if (type === "checkbox") {
      if (name === "premisesType") {
        var set = new Set(data.obj.premisesTypes);
        const value = e.target.id;
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }

        let arr = Array.from(set);

        setData({ ...data, obj: { ...data.obj, premisesTypes: arr } });
      } else {
        const checked = e.target.checked;
        setData({ ...data, obj: { ...data.obj, [name]: checked } });
      }
    }
  };

  const formValidation = () => {
    let premisesTypes = false;
    let price = false;
    let productName = false;
    let quantityUnit = false;
    let vat = false;
    let attr1 = false;
    let attr2 = false;

    if (data.obj.premisesTypes.length > 0) {
      premisesTypes = true;
    }
    if (data.obj.price > 0) {
      price = true;
    }
    if (data.obj.productName.length > 0) {
      productName = true;
    }

    if (data.obj.quantityUnit.length > 0) {
      quantityUnit = true;
    }
    if (data.obj.vat > 0) {
      vat = true;
    }
    if (pattern.attr1.length > 0) {
      attr1 = true;
    }
    if (pattern.attr2.length > 0) {
      attr2 = true;
    }

    const correct =
      premisesTypes &&
      price &&
      productName &&
      quantityUnit &&
      vat &&
      attr1 &&
      attr2;

    return {
      correct,
      premisesTypes,
      price,
      productName,
      quantityUnit,
      vat,
      attr1,
      attr2,
    };
  };
  //todo
  const reactiveValidation = () => {};

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="productName">Nazwa: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              value={data.obj.productName}
              id="productName"
              type="text"
              name="productName"
              onChange={handleChange}
            />
            {errors.productName && (
              <span className="error-msg">{messages.productNameError}</span>
            )}
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="price">Cena: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              value={data.obj.price}
              id="price"
              type="number"
              min="1"
              step="any"
              name="price"
              onChange={handleChange}
            />{" "}
            {errors.price && (
              <span className="error-msg">{messages.priceError}</span>
            )}
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="netto">Netto: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input--checkbox"
              value={data.obj.netto}
              id="netto"
              type="checkbox"
              name="netto"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="vat">Vat: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              value={data.obj.vat}
              id="vat"
              type="number"
              min="1"
              step="any"
              name="vat"
              onChange={handleChange}
            />
            {errors.vat && (
              <span className="error-msg">{messages.vatError}</span>
            )}
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="quantityUnit">Jednostka miary: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              value={data.obj.quantityUnit}
              id="quantityUnit"
              type="text"
              name="quantityUnit"
              onChange={handleChange}
            />
            {errors.quantityUnit && (
              <span className="error-msg">{messages.quantityUnitError}</span>
            )}
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="forAttribute">Wzór: </label>
          </div>
          <div className="row__col-75">
            <select
              className="form-container__input"
              value={pattern.attr1}
              id="attr1"
              name="attr1"
              onChange={handleChange}
            >
              <option key="" value=""></option>
              {props.mediaStandardProducts.map((option) => (
                <option key={option.productId} value={option.productName}>
                  {option.productName}
                </option>
              ))}
            </select>{" "}
            {errors.attr1 && (
              <span className="error-msg">{messages.attr1Error}</span>
            )}
            <input
              className="form-container__input"
              value={pattern.arithm}
              id="arithm"
              type="text"
              name="arithm"
              disabled="true"
              style={{ width: "15px" }}
              onChange={handleChange}
            />
            <select
              className="form-container__input"
              value={pattern.attr2}
              id="attr2"
              name="attr2"
              onChange={handleChange}
            >
              <option key="" value=""></option>
              {props.mediaStandardProducts.map((option) => (
                <option key={option.productId} value={option.productName}>
                  {option.productName}
                </option>
              ))}
            </select>
            {errors.attr2 && (
              <span className="error-msg">{messages.attr2Error}</span>
            )}
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="premisesType">Domyślne dla rodzaju lokalu: </label>
          </div>
          <div className="row__col-75">
            {
              <ul>
                {premisesTypes.map((option) => (
                  <li>
                    {option.label}
                    <input
                      className="form-container__input--checkbox"
                      key={option.value}
                      id={option.label}
                      name="premisesType"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  </li>
                ))}
                {errors.premisesTypes && (
                  <span className="error-msg">
                    {messages.premisesTypesError}
                  </span>
                )}
              </ul>
            }
          </div>
        </div>

        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};
export default MediaQuantityProductForm;
