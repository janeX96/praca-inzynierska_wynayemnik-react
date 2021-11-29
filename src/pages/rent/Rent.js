import "../../styles/App.css";
import { Stepper } from "react-form-stepper";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Rent = () => {
  const location = useLocation();
  const { premisesId } = location.state;

  const [rent, setRent] = useState({
    bailValue: 0,
    carNumber: "string",
    clientAccess: true,
    counterMediaRent: true,
    description: "string",
    email: "string",
    endDate: "2021-11-29T10:22:18.231Z",
    paymentDay: 0,
    paymentValues: [
      {
        endDate: "2021-11-29T10:22:18.231Z",
        startDate: "2021-11-29T10:22:18.231Z",
        value: 0,
      },
    ],
    premisesId: premisesId,
    productWithQuantityList: [
      {
        productId: 0,
        quantity: 0,
      },
    ],
    rentValue: 0,
    startDate: "2021-11-29T10:22:18.231Z",
    statePaymentValue: true,
    userAccount: {
      email: "string",
      firstName: "string",
      lastName: "string",
      phoneNumber: "string",
      sharing: true,
    },
  });

  return (
    <>
      <div class="content-container">
        <h1 className="content-title">Wynajem lokalu id= {premisesId}</h1>
        <Stepper
          steps={[
            { label: "Step 1" },
            { label: "Step 2" },
            { label: "Step 3" },
          ]}
          activeStep={0}
        />
      </div>
    </>
  );
};

export default Rent;
