import { useState } from "react";
import "../../../styles/App.css";

const StateProductForm = (props) => {
  const [product, setProduct] = useState({
    netto: false,
    premisesTypes: [],
    price: 0,
    productName: "",
    quantity: "",
    quantityUnit: "",
    vat: "",
  });

  const [errors, setErrors] = useState({
    premisesTypes: false,
    price: false,
    productName: false,
    quantity: false,
    quantityUnit: false,
    vat: false,
  });

  const messages = {
    premisesTypesError: "Wybierz przynajmniej jeden",
    priceError: "Podaj cenę",
    productNameError: "Podaj nazwę produktu",
    quantityError: "Podaj ilość",
    quantityUnitError: "Podaj jednostkę miary",
    vatError: "Wpisz wartość podatku VAT",
  };

  const formValidation = () => {};

  const handleChange = (e) => {};

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="productName">Nazwa: </label>
          </div>
          <div className="col-75">
            <input
              id="productName"
              type="text"
              name="productName"
              value={"..."}
              onChange={handleChange}
            />
            {/* {errors.postCode && (
              <span className="error-msg">{messages.postCode_incorrect}</span>
            )} */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default StateProductForm;
