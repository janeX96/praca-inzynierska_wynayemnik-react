import "../../styles/App.css";
import { useState, useEffect } from "react";

const MediaQuantityProductForm = (props) => {
  const [data, setData] = useState({
    type: "media-quantity",
    obj: {
      forAttribute: "",
      netto: true,
      premisesTypes: [],
      price: 0,
      productName: "",
      quantity: "",
      quantityUnit: "",
      vat: "",
    },
  });
  const [premisesTypes, setPremisesTypes] = useState(
    props.premisesTypes.premisesTypes
  );

  const [pattern, setPattern] = useState({
    attr1: "",
    arithm: "",
    attr2: "",
  });

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
    console.log(name);
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
        console.log(">>>>", value);
        if (set.has(value)) {
          set.delete(value);
          console.log("usunieto:", value);
        } else {
          set.add(value);
          console.log("dodano:", value);
        }

        let arr = Array.from(set);

        setData({ ...data, obj: { ...data.obj, premisesTypes: arr } });
      } else {
        const checked = e.target.checked;
        setData({ ...data, obj: { ...data.obj, [name]: checked } });
      }
    } // else if (type === "select-multiple") {

    // }
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
        <div className="row">
          <div className="col-25">
            <label htmlFor="productName">Nazwa: </label>
          </div>
          <div className="col-75">
            <input
              value={data.obj.productName}
              id="productName"
              type="text"
              name="productName"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="price">Cena: </label>
          </div>
          <div className="col-75">
            <input
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

        <div className="row">
          <div className="col-25">
            <label htmlFor="netto">Netto: </label>
          </div>
          <div className="col-75">
            <input
              value={data.obj.netto}
              id="netto"
              type="checkbox"
              name="netto"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="vat">Vat: </label>
          </div>
          <div className="col-75">
            <input
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

        <div className="row">
          <div className="col-25">
            <label htmlFor="quantity">Ilość: </label>
          </div>
          <div className="col-75">
            <input
              value={data.obj.quantity}
              id="quantity"
              type="number"
              name="quantity"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="quantityUnit">Jednostka miary: </label>
          </div>
          <div className="col-75">
            <input
              value={data.obj.quantityUnit}
              id="quantityUnit"
              type="text"
              name="quantityUnit"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="forAttribute">Wzór: </label>
          </div>
          <div className="col-75">
            <input
              value={pattern.attr1}
              id="attr1"
              type="text"
              name="attr1"
              style={{ width: "40px" }}
              onChange={handleChange}
            />
            <input
              value={pattern.arithm}
              id="arithm"
              type="text"
              name="arithm"
              style={{ width: "15px" }}
              onChange={handleChange}
            />
            <input
              value={pattern.attr2}
              id="attr2"
              type="text"
              name="attr2"
              style={{ width: "40px" }}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="premisesType">Domyślne dla rodzaju lokalu: </label>
          </div>
          <div className="col-75">
            {
              <ul>
                {premisesTypes.map((option) => (
                  <li>
                    {option.label}
                    <input
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
