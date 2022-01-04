import { useState, useEffect } from "react";
import { owner, admin, client } from "../../resources/urls";
import { GET } from "../../utilities/Request";

const RentDetails = (props) => {
  const [rent, setRent] = useState();

  const getData = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.details
        : props.roles[0] === "admin"
        ? admin.rent.details
        : props.roles[0] === "client"
        ? client.rent.details
        : "";
    GET(`${urlByRole}${props.rentId}`).then((res) => {
      setRent(res);
    });
  };

  useEffect(() => {
    if (props.rent !== undefined) {
      setRent(props.rent);
    } else {
      getData();
    }
  }, []);

  return (
    <>
      <h1 className="content-container__title">Szczegóły lokalu</h1>
      <div className="details-container">
        {rent !== undefined ? <div>{rent.startDate}</div> : ":("}
        <div className="contant-btns">
          <button
            className="content-container__button"
            onClick={props.handleReturn}
          >
            Powrót
          </button>
        </div>
      </div>
    </>
  );
};

export default RentDetails;
