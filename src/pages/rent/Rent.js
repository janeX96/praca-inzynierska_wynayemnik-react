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
    carNumber: "",
    clientAccess: true,
    counterMediaRent: true,
    description: "",
    email: "",
    endDate: "",
    paymentDay: 0,
    paymentValues: [
      {
        endDate: "",
        startDate: "",
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

  const setUser = (userAccount) => {
    setRent({ ...rent, userAccount });
  };

  const setEmail = (email, userAccount) => {
    setRent({ ...rent, email, userAccount });
  };

  const stepDone = (index) => {
    setCompletedSteps({ [index]: true });
    setActiveStep(activeStep + 1);
  };

  const renderForm = (step) => {
    switch (step) {
      case 0:
        return (
          <UserFormForRent
            stepDone={stepDone}
            setUser={setUser}
            setEmail={setEmail}
          />
        );
        break;
      case 1:
        return <RentForm premises={premises} user={rent.userAccount.email} />;

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
