import React, { useState, useEffect } from "react";

const CompanyForm = () => {
  const [company, setCompany] = useState({
    address: {
      city: "",
      postCode: "",
      street: "",
      streetNumber: "",
    },
    companyName: "",
    nip: "",
  });

  const handleCompanySumbit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setCompany({ ...company, [name]: value });
  };
  return (
    <>
      <div className="form-container">
        <form onSubmit={handleCompanySumbit}>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="city">Miasto:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="city"
                name="city"
                value={company.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="postCode">Kod pocztowy:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="postCode"
                name="postCode"
                value={company.postCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="street">Ulica:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="street"
                name="street"
                value={company.street}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="streetNumber">Numer:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="streetNumber"
                name="streetNumber"
                value={company.streetNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="companyName">Nazwa Firmy:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="companyName"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="nip">Nip:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                className="form-container__input"
                id="nip"
                name="nip"
                value={company.nip}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompanyForm;
