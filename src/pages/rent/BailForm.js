import { useState, useEffect } from "react";

const BailForm = (props) => {
  const [bail, setBail] = useState({
    bailType: "",
    cost: 0,
    description: "",
    nameOnInvoice: "",
  });

  const formValidation = () => {
    let bailType = false;
    let cost = false;
    let description = false;

    if (bailType) {
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <h1 className="content-container__title">Dodawanie kaucji</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="bailType"> Rodzaj:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                id="bailType"
                name="bailType"
                className="form-container__input"
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="cost"> Wartość:</label>
            </div>
            <div className="row__col-75">
              <input
                type="number"
                id="cost"
                name="cost"
                className="form-container__input"
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="nameOnInvoice"> Przychodząca:</label>
            </div>
            <div className="row__col-75">
              <input
                type="checkbox"
                id="nameOnInvoice"
                name="nameOnInvoice"
                className="form-container__input--checkbox"
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="description"> Opis:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                id="description"
                name="description"
                className="form-container__input"
              />
            </div>
          </div>
          <div className="form-container__buttons">
            <button onClick={() => props.handleReturn()}>Powrót</button>

            <button type="submit" className="">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BailForm;
