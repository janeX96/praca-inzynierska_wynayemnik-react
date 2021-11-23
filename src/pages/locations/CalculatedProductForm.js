import "../../styles/App.css";
import { useState } from "react";

const CalculatedProductForm = () => {
  const [data, setData] = useState({
    forAttribute: "",
    netto: true,
    premisesTypes: [],
    price: 0,
    productName: "",
    quantity: "",
    quantityUnit: "",
    vat: "",
  });

  const handleSubmit = (e) => {};

  const handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;

    if (type === "text" || type === "number" || type === "select-one") {
      const value = e.target.value;

      setData({ ...data, [name]: value });
    } else if (type === "checkbox") {
      const checked = e.target.checked;
      setData({ ...data, [name]: checked });
    }
  };

  const getData = () => {};

  const messages = {};

  const formValidation = () => {};

  const reactiveValidation = () => {};

  return (
    <div className="new-premises-details">
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">
          Nazwa:
          <input
            id="productName"
            type="text"
            name="productName"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Cena:
          <input
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
            id="netto"
            type="checkbox"
            name="netto"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="vat">
          Vat:
          <input
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
            id="quantity"
            type="number"
            name="quantity"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="quantityUnit">
          Jednostka miary:
          <input
            id="quantityUnit"
            type="text"
            name="quantityUnit"
            onChange={handleChange}
          />
        </label>

        <label htmlFor="forAttribute">
          Wzór:
          <input
            id="atr1"
            type="text"
            name="atr1"
            style={{ width: "40px" }}
            onChange={handleChange}
          />
          <input
            id="arithm"
            type="text"
            name="arithm"
            style={{ width: "15px" }}
            onChange={handleChange}
          />
          <input
            id="atr2"
            type="text"
            name="atr2"
            style={{ width: "40px" }}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default CalculatedProductForm;
