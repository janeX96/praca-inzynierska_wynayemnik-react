import "../../../styles/App.scss";
import { Stepper } from "react-form-stepper";
import { useState } from "react";
import UserFormForRent from "./UserFormForRent";
import RentForm from "./RentForm";
import ProductsForRent from "./ProductsForRent/ProductsForRent";
import RentSummary from "./RentSummary";

const Rent = (props) => {
  const { premisesId, premises, roles } = props;

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

  const [emailChanged, setEmailChanged] = useState("");

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

  const setAddress = (address, company = false) => {
    if (address === null) {
      console.log("JEST NULL");
      setRent((prevRent) => ({ ...prevRent, ownSettings: false }));
    } else if (!company) {
      setRent((prevRent) => ({
        ...prevRent,
        address: address,
        ownSettings: true,
        naturalPerson: true,
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
      }));
    } else {
      setRent((prevRent) => ({
        ...prevRent,
        company: address,
        ownSettings: true,
        naturalPerson: false,
        address: {
          city: "",
          postCode: "",
          street: "",
          streetNumber: "",
        },
      }));
    }
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
            handleReturn={props.handleReturn}
            defaultEmail={rent.email}
            defaultUser={rent.userAccount}
            defaultAddress={
              rent.naturalPerson ? rent.address : rent.company.address
            }
            defaultCompany={{
              companyName: rent.company.companyName,
              nip: rent.company.nip,
            }}
            defaultAddressSettings={{
              ownSettings: rent.ownSettings,
              isCompany: !rent.naturalPerson,
            }}
            stepDone={stepDone}
            setUser={setUser}
            setEmail={setEmail}
            setAddress={setAddress}
          />
        );
        break;
      case 2:
        return (
          <RentForm
            roles={roles}
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
            roles={roles}
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
            handleReturn={props.handleReturn}
            stepBack={stepBack}
            {...rent}
            userEmail={rent.email}
            rentObj={rent}
            products={selectedProductsSave}
            roles={roles}
          />
        );
        break;

      default:
        break;
    }
  };

  return (
    <>
      <h1 className="content-container__title">Wynajem lokalu</h1>
      <Stepper
        style={{
          marginTop: "0",
          marginBottom: "0",
          paddingTop: "0",
          paddingBottom: "0",
        }}
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
    </>
  );
};

export default Rent;
