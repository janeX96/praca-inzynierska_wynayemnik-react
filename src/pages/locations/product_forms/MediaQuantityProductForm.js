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
      // quantity: "",
      quantityUnit: "",
      vat: "",
    },
  });

  const [premisesTypes, setPremisesTypes] = useState(props.premisesTypes);

  // const [mediaStandardProducts, setMediaStandardProducts] = useState();

  const [pattern, setPattern] = useState({
    attr1: "",
    arithm: "-",
    attr2: "",
  });

  // const getProductsMediaStandard = () => {
  //   const url = `${owner.productsForLocation.prefix}${props.locationId}${owner.productsForLocation.getAllMediaStandard}`;

  //   GET(url).then((res) => {
  //     console.log("mediastand: ", res);
  //     setMediaStandardProducts(res);
  //   });
  // };

  // useEffect(() => {
  //   getProductsMediaStandard();
  // }, []);

  useEffect(() => {
    const forAttribute =
      pattern.attr1 + " " + pattern.arithm + " " + pattern.attr2;
    setData({ ...data, obj: { ...data.obj, forAttribute } });
  }, [pattern]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const forAttribute =
      pattern.attr1 + " " + pattern.arithm + " " + pattern.attr2;
    setData({ ...data, obj: { ...data.obj, forAttribute } });

    props.addProduct(data);
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

  //todo
  const messages = {};
  //todo
  const formValidation = () => {};
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
            />
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
          </div>
        </div>

        {/* <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="quantity">Ilość: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              value={data.obj.quantity}
              id="quantity"
              type="number"
              name="quantity"
              onChange={handleChange}
            />
          </div>
        </div> */}

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
            </select>
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
              </ul>
            }
            {/* {state.errors.premisesType && (
              <span className="error-msg">
                {messages.premisesType_incorrect}
              </span>
            )} */}
          </div>
        </div>

        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};
export default MediaQuantityProductForm;
