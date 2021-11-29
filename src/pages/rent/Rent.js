import "../../styles/App.css";
import { Stepper } from "react-form-stepper";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import UserFormForRent from "./UserFormForRent";
import RentForm from "./RentForm";

const Rent = () => {
  const location = useLocation();
  const { premisesId, premises } = location.state;

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

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

  const setUser = (email) => {
    setRent({ ...rent, email });
  };

  const stepDone = (index) => {
    setCompletedSteps({ [index]: true });
    setActiveStep(activeStep + 1);
  };

  const renderForm = (step) => {
    switch (step) {
      case 0:
        return <UserFormForRent stepDone={stepDone} setUser={setUser} />;
        break;
      case 1:
        return <RentForm premises={premises} user={rent.email} />;

      default:
        break;
    }
  };

  return (
    <>
      <div className="content-container">
        <h1 className="content-title">Wynajem lokalu id= {premisesId}</h1>
        <Stepper
          steps={[
            { label: "Najemca" },
            { label: "Wynajem" },
            { label: "Produkty" },
            { label: "Podsumowanie" },
          ]}
          activeStep={activeStep}
        />
        {renderForm(activeStep)}
      </div>
    </>
  );
};

export default Rent;
