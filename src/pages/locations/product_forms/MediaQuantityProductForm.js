import "../../../styles/App.css";
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
    <div className="new-premises-details">
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">
          Nazwa:
          <input
            value={data.obj.productName}
            id="productName"
            type="text"
            name="productName"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Cena:
          <input
            value={data.obj.price}
            id="price"
            type="number"
            min="1"
            step="any"
            name="price"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="netto">
          Netto:
          <input
            value={data.obj.netto}
            id="netto"
            type="checkbox"
            name="netto"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="vat">
          Vat:
          <input
            value={data.obj.vat}
            id="vat"
            type="number"
            min="1"
            step="any"
            name="vat"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="quantity">
          Ilość:
          <input
            value={data.obj.quantity}
            id="quantity"
            type="number"
            name="quantity"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="quantityUnit">
          Jednostka miary:
          <input
            value={data.obj.quantityUnit}
            id="quantityUnit"
            type="text"
            name="quantityUnit"
            onChange={handleChange}
          />
        </label>

        <label htmlFor="forAttribute">
          Wzór:
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
        </label>
        <label htmlFor="premisesType">
          Domyślne dla rodzaju lokalu:
          {/* <select
            value={data.obj.premisesTypes}
            id="premisesType"
            name="premisesType"
            onChange={handleChange}
            multiple
          >
            <option key="" value=""></option>
            {premisesTypes.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select> */}
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
        </label>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default MediaQuantityProductForm;
