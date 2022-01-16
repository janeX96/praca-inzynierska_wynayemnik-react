import { useState, useEffect } from "react";
import { admin, general, owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";

const PaymentDetails = (props) => {
  const [payment, setPayment] = useState();

  const getData = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.paymentDetails
        : props.roles[0] === "admin"
        ? admin.rent.paymentDetails
        : "";

    GET(
      `${urlByRole}${props.rentId}${general.rent.paymentDetailsSuffix}${props.paymentId}`
    ).then((res) => {
      setPayment(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1 className="content-container__title">Szczegóły płatności</h1>
      <div className="details-container">
        <ul>
          <li>
            Lokal:
            <b></b>
          </li>
        </ul>
      </div>
    </>
  );
};

export default PaymentDetails;
