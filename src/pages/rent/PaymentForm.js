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
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-container__row">
          <div className="row__col-75">
            <label htmlFor="1">jeden:</label>
            <input type="text" id="1" name="1" />

            <label htmlFor="">
              dwa: <input type="text" />
            </label>
          </div>
        </div>
      </form>
    </>
  );
};

export default PaymentForm;
