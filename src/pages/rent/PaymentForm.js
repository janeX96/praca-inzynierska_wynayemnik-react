import { useState, useEffect } from "react";
import { admin, client, general, owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";

const PaymentForm = (props) => {
  const [media, setMedia] = useState();
  const handleChange = () => {};
  const formValidation = () => {};
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const getMedia = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.getAllMediaRent
        : props.roles[0] === "admin"
        ? admin.rent.getAllMediaRent
        : props.roles[0] === "client"
        ? client.rent.getAllMediaRent
        : "";
    GET(
      `${urlByRole}${props.rentId}${general.rent.getAllMediaRentSuffix}`
    ).then((res) => {
      setMedia(res);
    });
  };

  useEffect(() => {
    getMedia();
  }, []);

  return (
    <div className="form-container--table">
      <div className="form-container--table__column-titles">
        <div className="column-title">Nazwa</div>
        <div className="column-title">Ilość</div>
        <div className="column-title">Jedn.</div>
        <div className="column-title">Cena netto</div>
        <div className="column-title">VAT%</div>
        <div className="column-title">Wart. netto</div>
        <div className="column-title">Wart. brutto</div>
      </div>

      <form onSubmit={handleSubmit} className="form-container--table__form">
        {media.map((m) => (
          <>
            <input
              type="text"
              id="productName"
              name="productName"
              className="form-container--table__input--250"
              value={m.product.productName}
              //   onChange={}
            />
            <input
              type="text"
              id="1"
              name="1"
              className="form-container--table__input"
              value={m.product.productName}
              //   onChange={}
            />
            <input
              type="text"
              id="1"
              name="1"
              className="form-container--table__input"
            />
            <input
              type="text"
              id="1"
              name="1"
              className="form-container--table__input"
            />
            <input
              type="text"
              id="1"
              name="1"
              className="form-container--table__input"
            />
            <input
              type="text"
              id="1"
              name="1"
              className="form-container--table__input"
            />
            <input
              type="text"
              id="1"
              name="1"
              className="form-container--table__input"
            />
          </>
        ))}
      </form>
    </div>
  );
};

export default PaymentForm;
