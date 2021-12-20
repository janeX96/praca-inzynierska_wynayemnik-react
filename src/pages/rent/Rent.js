import "../../styles/App.scss";
import { Stepper } from "react-form-stepper";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import UserFormForRent from "./UserFormForRent";
import RentForm from "./RentForm";
import ProductsForRent from "./ProductsForRent/ProductsForRent";
import RentSummary from "./RentSummary";

const Rent = () => {
  const location = useLocation();
  const { premisesId, premises } = location.state;

  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const [rent, setRent] = useState({
    address: {
      city: "",
      postCode: "",
      street: "",
      streetNumber: "",
    },
    company: {
      address: {
        city: "",
        postCode: "",
        street: "",
        streetNumber: "",
      },
      companyName: "",
      nip: "",
    },
    naturalPerson: true,
    ownSettings: false,
    bailValue: 0,
    carNumber: "",
    clientAccess: false,
    counterMediaRent: false,
    description: "",
    email: "",
    endDate: "",
    paymentDay: 0,
    paymentValues: [],
    premisesType: { type: "" },
    premisesId: premisesId,
    productWithCounterList: [],
    rentValue: 0,
    startDate: "",
    statePaymentValue: true,
    userAccount: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      sharing: false,
    },
  });

  const [selectedProductsSave, setSelectedProductsSave] = useState([]);

  const setUser = (userAccount) => {
    setRent({ ...rent, userAccount });
  };

  const setEmail = (email, userAccount) => {
    setRent({ ...rent, email, userAccount });
  };

  const stepDone = (index) => {
    setCompletedSteps({ ...completedSteps, [index]: true });
    setActiveStep(activeStep + 1);
  };

  const stepBack = (index) => {
    // setCompletedSteps({ [index]: true });
    setActiveStep(activeStep - 1);
  };

  //without products and descritpion
  const setRentDetails = (details) => {
    setRent({
      ...rent,
      bailValue: details.bailValue,
      carNumber: details.carNumber,
      clientAccess: details.clientAccess,
      counterMediaRent: details.counterMediaRent,
      premisesType: details.premisesType,
      endDate: details.endDate,
      paymentDay: details.paymentDay,
      paymentValues: details.paymentValues,
      premisesId: premisesId,
      productWithQuantityList: [],
      rentValue: details.rentValue,
      startDate: details.startDate,
      statePaymentValue: details.statePaymentValue,
    });
  };

  const addProductsAndDescritpion = (products, description) => {
    setRent({ ...rent, description, productWithCounterList: products });
  };

  const saveSelectedProducts = (selected) => {
    setSelectedProductsSave(selected);
  };

  const renderForm = (step) => {
    switch (step) {
      case 1:
        return (
          <UserFormForRent
            defaultEmail={rent.email}
            defaultUser={rent.userAccount}
            stepDone={stepDone}
            setUser={setUser}
            setEmail={setEmail}
          />
        );
        break;
      case 2:
        return (
          <RentForm
            default={rent}
            premises={premises}
            user={rent.userAccount.email}
            stepDone={stepDone}
            stepBack={stepBack}
            setRentDetails={setRentDetails}
          />
        );
        break;
      case 3:
        return (
          <ProductsForRent
            default={rent}
            locationId={premises.locationId}
            premisesType={premises.premisesType}
            stepDone={stepDone}
            stepBack={stepBack}
            addProductsAndDescritpion={addProductsAndDescritpion}
            saveSelectedProducts={saveSelectedProducts}
            selectedSave={selectedProductsSave}
          />
        );
        break;
      case 4:
        return (
          <RentSummary
            stepBack={stepBack}
            {...rent}
            userEmail={rent.email}
            rentObj={rent}
            products={selectedProductsSave}
          />
        );
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="content-container">
        <h1 className="content-title">Wynajem lokalu</h1>
        <Stepper
          styleConfig={{
            activeBgColor: "#48bd4c",
            inactiveBgColor: "#727178",
            completedBgColor: "#417843",
          }}
          steps={[
            { label: "Najemca" },
            { label: "Wynajem" },
            { label: "Produkty" },
            { label: "Podsumowanie" },
          ]}
          activeStep={activeStep - 1}
        />
        {renderForm(activeStep)}
      </div>
    </>
  );
};

export default Rent;
