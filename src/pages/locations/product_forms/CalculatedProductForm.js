import "../../../styles/App.scss";
import { useState, useEffect } from "react";
import { GET } from "../../../utilities/Request";
import { general } from "../../../resources/urls";

const CalculatedProductForm = (props) => {
  const [product, setProduct] = useState(
    props.data !== undefined
      ? {
          type: "calculated",
          obj: {
            netto: props.data.netto,
            premisesTypes: props.data.premisesTypes,
            price: props.data.price,
            productName: props.data.productName,
            patternName: props.data.patternName,
            quantity: props.data.quantity,
            quantityUnit: props.data.quantityUnit,
            vat: props.data.vat,
          },
        }
      : {
          type: "calculated",
          obj: {
            netto: false,
            premisesTypes: [],
            price: 0,
            productName: "",
            patternName: "",
            quantity: "",
            quantityUnit: "",
            vat: "",
          },
        }
  );

  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    if (props.data !== undefined) {
      setProduct({
        type: "calculated",
        obj: {
          netto: props.data.netto,
          premisesTypes: props.data.premisesTypes,
          price: props.data.price,
          productName: props.data.productName,
          patternName: props.data.patternName,
          quantity: props.data.quantity,
          quantityUnit: props.data.quantityUnit,
          vat: props.data.vat,
        },
      });
    }
  }, []);

  useEffect(() => {
    const url = `${general.patterns}`;
    GET(url).then((response) => {
      setPatterns(response);
    });
  }, []);

  const [errors, setErrors] = useState({
    premisesTypes: false,
    price: false,
    productName: false,
    quantity: false,
    quantityUnit: false,
    pattern: false,
    vat: false,
  });

  const messages = {
    premisesTypesError: "Wybierz przynajmniej jeden",
    priceError: "Podaj cenę",
    productNameError: "Podaj nazwę produktu",
    quantityError: "Podaj ilość",
    quantityUnitError: "Podaj jednostkę miary",
    vatError: "Wpisz wartość podatku VAT",
    pattern: "Wybierz wartość",
  };

  const formValidation = () => {
    let premisesTypes = false;
    let price = false;
    let productName = false;
    let quantity = false;
    let quantityUnit = false;
    let vat = false;
    let pattern = false;

    if (product.obj.premisesTypes.length > 0) {
      premisesTypes = true;
    }
    if (product.obj.price > 0) {
      price = true;
    }
    if (
      product.obj.productName.length > 0 &&
      product.obj.productName.length < 41
    ) {
      productName = true;
    }
    if (product.obj.quantity > 0) {
      quantity = true;
    }
    if (
      product.obj.quantityUnit.length > 0 &&
      product.obj.quantityUnit.length < 5
    ) {
      quantityUnit = true;
    }
    if (product.obj.vat > 0 && product.obj.vat < 100) {
      vat = true;
    }
    if (product.obj.patternName.length > 0) {
      pattern = true;
    }

    const correct =
      premisesTypes &&
      price &&
      productName &&
      quantity &&
      quantityUnit &&
      vat &&
      pattern;

    return {
      correct,
      premisesTypes,
      price,
      productName,
      quantity,
      quantityUnit,
      pattern,
      vat,
    };
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;

    if (type === "text" || type === "number") {
      const value = e.target.value;
      setProduct({ ...product, obj: { ...product.obj, [name]: value } });
    } else if (type === "checkbox") {
      if (name === "premisesType") {
        var set = new Set(product.obj.premisesTypes);
        const value = e.target.id;
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }

        let arr = Array.from(set);

        setProduct({ ...product, obj: { ...product.obj, premisesTypes: arr } });
      } else {
        const checked = e.target.checked;
        setProduct({ ...product, obj: { ...product.obj, [name]: checked } });
      }
    } else if (type === "select-one") {
      const value = e.target.value;
      setProduct({ ...product, obj: { ...product.obj, [name]: value } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = formValidation();

    if (validation.correct) {
      if (props.data !== undefined) {
        props.updateProduct(product);
      } else {
        props.addProduct(product);
      }

      setErrors({
        premisesTypes: false,
        price: false,
        productName: false,
        quantity: false,
        pattern: false,
        quantityUnit: false,
        vat: false,
      });
    } else {
      setErrors({
        premisesTypes: !validation.premisesTypes,
        price: !validation.price,
        productName: !validation.productName,
        quantity: !validation.quantity,
        pattern: !validation.pattern,
        quantityUnit: !validation.quantityUnit,
        vat: !validation.vat,
      });
    }
  };

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
              id="productName"
              type="text"
              name="productName"
              value={product.obj.productName}
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
              id="price"
              type="number"
              name="price"
              value={product.obj.price}
              onChange={handleChange}
            />
            {errors.price && (
              <span className="error-msg">{messages.priceError}</span>
            )}
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="patternName">Wyliczalne z: </label>
          </div>
          <div className="row__col-75">
            <select
              name="patternName"
              id="patternName"
              value={product.obj.patternName}
              onChange={handleChange}
              className="form-container__input"
            >
              <option key="" value=""></option>
              {patterns.map((el) => (
                <option key={el.patternId} value={el.patternName}>
                  {el.patternName}
                </option>
              ))}
            </select>
            {errors.pattern && (
              <span className="error-msg">{messages.pattern}</span>
            )}
          </div>
        </div>

        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="netto">Netto: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              id="netto"
              type="checkbox"
              name="netto"
              value={product.obj.netto}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="quantity">Ilość: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              id="quantity"
              type="number"
              name="quantity"
              value={product.obj.quantity}
              onChange={handleChange}
            />
            {errors.quantity && (
              <span className="error-msg">{messages.quantityError}</span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="quantityUnit">Jedn. miary: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              id="quantityUnit"
              type="text"
              name="quantityUnit"
              value={product.obj.quantityUnit}
              onChange={handleChange}
            />
            {errors.quantityUnit && (
              <span className="error-msg">{messages.quantityUnitError}</span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="vat">VAT: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              id="vat"
              type="number"
              name="vat"
              value={product.obj.vat}
              onChange={handleChange}
            />
            {errors.vat && (
              <span className="error-msg">{messages.vatError}</span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="premisesType">Rodzaj wynajmu: </label>
          </div>
          <div className="row__col-75">
            {
              <ul>
                {props.premisesTypes.map((option) => (
                  <li key={option.value}>
                    {option.label}
                    <input
                      className="form-container__input"
                      key={option.value}
                      id={option.label}
                      name="premisesType"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  </li>
                ))}
              </ul>
            }
            {errors.premisesTypes && (
              <span className="error-msg">{messages.premisesTypesError}</span>
            )}
          </div>
        </div>
        <div className="form-container__buttons">
          <button type="submit">
            {props.data !== undefined ? "Zapisz" : "Dodaj"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CalculatedProductForm;
