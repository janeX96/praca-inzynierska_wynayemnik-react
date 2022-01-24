import "../../../styles/App.scss";
import { useState } from "react";
import { GET } from "../../../utilities/Request";
import { user as userReq } from "../../../resources/urls";
import { toast } from "react-toastify";

const UserFormForRent = (props) => {
  const [sending, setSending] = useState(false);
  const [userEmail, setUserEmail] = useState(
    props.defaultEmail !== null && props.defaultEmail.length > 0
      ? props.defaultEmail
      : props.defaultUser.email
  );

  const [user, setUser] = useState({
    toCreate:
      props.defaultUser.email.length > 0 && !props.defaultEmail.length > 0,
    userAccount: {
      email: props.defaultUser.email,
      firstName: props.defaultUser.firstName,
      lastName: props.defaultUser.lastName,
      phoneNumber: props.defaultUser.phoneNumber,
      sharing: props.defaultUser.sharing,
    },
  });

  const [ownSettings, setOwnSettings] = useState(
    props.defaultAddressSettings.ownSettings
  );

  const [address, setAddress] = useState(props.defaultAddress);

  const [isCompany, setIsCompany] = useState(
    props.defaultAddressSettings.isCompany
  );
  const [company, setCompany] = useState(props.defaultCompany);

  const [errors, setErrors] = useState({
    emailError: false,
    firstNameError: false,
    lastNameError: false,
    phoneNumberError: false,
    cityError: false,
    streetError: false,
    streetNumberError: false,
    postCodeError: false,
    companyNameError: false,
    nipError: false,
  });

  const messages = {
    email_incorrect: "Podaj prawidłowy adres email",
    firstName_incorrect: "Wpisz od 3 do 30 znaków",
    lastName_incorrect: "Wpisz od 3 do 60 znaków",
    phoneNumber_incorrect: "Podaj prawidłowy numer telefonu (123456789)",
    city_incorrect: "Podaj nazwę miasta",
    street_incorrect: "Podaj nazwę ulicy",
    streetNumber_incorrect: "Podaj numer ulicy",
    companyName_incorrect: "Podaj nazwę firmy",
    postCode_incorrect: "Podaj prawidłowy kod pocztowy",
    nip_incorrect: "Podaj prawidłowy numer NIP",
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const formValidation = () => {
    let email = false;
    let firstName = false;
    let lastName = false;
    let phoneNumber = false;
    let city = false;
    let street = false;
    let streetNumber = false;
    let postCode = false;

    if (validateEmail(userEmail)) {
      email = true;
    }

    if (
      user.userAccount.firstName.length > 2 &&
      user.userAccount.firstName.length < 30
    ) {
      firstName = true;
    }

    if (
      user.userAccount.lastName.length > 2 &&
      user.userAccount.lastName.length < 60
    ) {
      lastName = true;
    }

    if (user.userAccount.phoneNumber.match(/^[0-9]{9}$/)) {
      phoneNumber = true;
    }

    if (address.city.length >= 3) {
      city = true;
    }
    if (/^[0-9]{2}-[0-9]{3}$/.test(address.postCode)) {
      postCode = true;
    }
    if (address.street.length > 3) {
      street = true;
    }
    if (address.streetNumber.length > 0) {
      streetNumber = true;
    }

    let companyName = false;
    let nip = false;
    if (isCompany) {
      if (company.companyName.length > 1 && company.companyName.length <= 60) {
        companyName = true;
      }
      if (company.nip.length === 10) {
        nip = true;
      }
    }

    let correct = false;

    if (isCompany) {
      if (user.toCreate) {
        correct =
          email &&
          firstName &&
          lastName &&
          phoneNumber &&
          city &&
          postCode &&
          street &&
          streetNumber &&
          companyName &&
          nip;

        return {
          correct,
          firstName,
          lastName,
          phoneNumber,
          email,
          city,
          postCode,
          street,
          streetNumber,
          companyName,
          nip,
        };
      } else if (ownSettings) {
        correct =
          city && postCode && street && streetNumber && companyName && nip;
        return {
          correct,
          city,
          postCode,
          street,
          streetNumber,
          companyName,
          nip,
        };
      }
    } else {
      if (user.toCreate) {
        correct =
          email &&
          firstName &&
          lastName &&
          phoneNumber &&
          city &&
          postCode &&
          street &&
          streetNumber;

        return {
          correct,
          firstName,
          lastName,
          phoneNumber,
          email,
          city,
          postCode,
          street,
          streetNumber,
        };
      } else if (ownSettings) {
        correct = city && postCode && street && streetNumber;

        return {
          correct,
          city,
          postCode,
          street,
          streetNumber,
        };
      }
    }
  };

  const findUserByEmail = async () => {
    let userExists = false;

    await GET(`${userReq.findByEmail}?email=${userEmail}`)
      .then((res) => {
        if (res != null) {
          userExists = true;
          return res;
        } else {
          toast.info(
            "Nie znaleziono konta przypisanego do tego adresu email, możesz je utworzyć."
          );
          setUser({
            toCreate: true,
            userAccount: {
              email: userEmail,
              firstName: "",
              lastName: "",
              phoneNumber: "",
              sharing: false,
            },
          });
          props.setEmail("", {
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            sharing: false,
          });
          return false;
        }
      })
      .then((res) => {
        if (userExists) {
          if (ownSettings) {
            const validation = formValidation();
            if (validation.correct) {
              props.setEmail(userEmail, {
                email: userEmail,
                firstName: res.firstName,
                lastName: res.lastName,
                phoneNumber: res.phoneNumber,
                sharing: true,
              });
              if (isCompany) {
                const companyAddr = {
                  address: address,
                  companyName: company.companyName,
                  nip: company.nip,
                };
                props.setAddress(companyAddr, true);
              } else {
                props.setAddress(address, false);
              }
              props.stepDone(1);
            } else {
              setErrors({
                cityError: !validation.city,
                streetError: !validation.street,
                streetNumberError: !validation.streetNumber,
                postCodeError: !validation.postCode,
                companyNameError: !validation.companyName,
                nipError: !validation.nip,
              });
            }
          } else {
            props.setEmail(userEmail, {
              email: userEmail,
              firstName: res.firstName,
              lastName: res.lastName,
              phoneNumber: res.phoneNumber,
              sharing: true,
            });
            props.setAddress(null);
            props.stepDone(1);
          }
        }
        return userExists;
      })
      .catch((err) => {});

    return userExists;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    findUserByEmail();
  };

  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const val = e.target.value;

    if (name === "email") {
      setUserEmail(val);
      setUser({ ...user, toCreate: false });
    } else if (type === "text") {
      setUser({
        ...user,
        userAccount: {
          ...user.userAccount,
          [name]: val,
        },
      });
    } else if (type === "checkbox") {
      const checked = e.target.checked;
      if (name === "ownSettings") {
        setOwnSettings(checked);
      } else if (name === "isCompany") {
        setIsCompany(checked);
      } else {
        setUser({
          ...user,
          userAccount: {
            ...user.userAccount,
            [name]: checked,
          },
        });
      }
    }
  };

  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();

    if (!sending) {
      setSending(true);
      const validation = formValidation();

      if (validation.correct) {
        props.setUser(user.userAccount);
        if (isCompany) {
          const companyAddr = {
            address: address,
            companyName: company.companyName,
            nip: company.nip,
          };
          props.setAddress(companyAddr, true);
        } else {
          props.setAddress(address, false);
        }
        props.stepDone(1);
      } else {
        setSending(false);
        setErrors({
          emailError: !validation.email,
          firstNameError: !validation.firstName,
          lastNameError: !validation.lastName,
          phoneNumberError: !validation.phoneNumber,
          cityError: !validation.city,
          streetError: !validation.street,
          streetNumberError: !validation.streetNumber,
          postCodeError: !validation.postCode,
          companyNameError: !validation.companyName,
          nipError: !validation.nip,
        });
      }
    }
  };

  const addressHandleChange = (e) => {
    const name = e.target.name;
    const val = e.target.value;

    setAddress({ ...address, [name]: val });
  };

  const companyHandleChange = (e) => {
    const name = e.target.name;
    const val = e.target.value;

    setCompany({ ...company, [name]: val });
  };

  const addressForm = () => {
    return (
      <>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="lastName">Miasto: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              id="city"
              name="city"
              onChange={addressHandleChange}
              value={address.city}
            ></input>
            {errors.cityError && (
              <span className="form-container__error-msg">
                {messages.city_incorrect}
              </span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="lastName">Kod Pocztowy: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              id="postCode"
              name="postCode"
              onChange={addressHandleChange}
              value={address.postCode}
            ></input>
            {errors.postCodeError && (
              <span className="form-container__error-msg">
                {messages.postCode_incorrect}
              </span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="lastName">Ulica: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              id="street"
              name="street"
              onChange={addressHandleChange}
              value={address.street}
            ></input>
            {errors.streetError && (
              <span className="form-container__error-msg">
                {messages.street_incorrect}
              </span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="lastName">Numer: </label>
          </div>
          <div className="row__col-75">
            <input
              className="form-container__input"
              type="text"
              id="streetNumber"
              name="streetNumber"
              onChange={addressHandleChange}
              value={address.streetNumber}
            ></input>
            {errors.streetNumberError && (
              <span className="form-container__error-msg">
                {messages.streetNumber_incorrect}
              </span>
            )}
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">Firma:</div>
          <div className="row__col-75">
            <input
              className="form-container__input--checkbox"
              type="checkbox"
              id="isCompany"
              name="isCompany"
              onChange={handleChange}
              checked={isCompany}
            ></input>
          </div>
        </div>
        {isCompany ? (
          <>
            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="lastName">Nazwa firmy: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="text"
                  id="companyName"
                  name="companyName"
                  onChange={companyHandleChange}
                  value={company.companyName}
                ></input>
                {errors.companyNameError && (
                  <span className="form-container__error-msg">
                    {messages.companyName_incorrect}
                  </span>
                )}
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="lastName">NIP: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="text"
                  id="nip"
                  name="nip"
                  onChange={companyHandleChange}
                  value={company.nip}
                ></input>
                {errors.nipError && (
                  <span className="form-container__error-msg">
                    {messages.nip_incorrect}
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>
    );
  };
  return (
    <>
      <div>
        <h2>Dane użytkownika</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-container__row">
              <div className="row__col-25">
                <label htmlFor="email">Email najemcy: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={userEmail}
                />
                {errors.emailError && (
                  <span className="form-container__error-msg">
                    {messages.email_incorrect}
                  </span>
                )}
              </div>
            </div>
            <div className="form-container__row">
              <div className="row__col-25">Dodaj adres do faktury:</div>
              <div className="row__col-75">
                <input
                  className="form-container__input--checkbox"
                  type="checkbox"
                  id="ownSettings"
                  name="ownSettings"
                  onChange={handleChange}
                  checked={ownSettings}
                ></input>
              </div>
            </div>
            {ownSettings ? <>{addressForm()}</> : ""}

            <div className="form-container__buttons">
              <button onClick={() => props.handleReturn()}>Anuluj</button>
              <button type="submit" disabled={user.toCreate}>
                Dalej
              </button>
            </div>
          </form>
          {user.toCreate && (
            <>
              <h1>Stwórz konto dla najemcy</h1>
              <form onSubmit={handleCreateAccountSubmit}>
                <div className="form-container__row">
                  <div className="row__col-25">
                    <label htmlFor="firstName">Imię: </label>
                  </div>
                  <div className="row__col-75">
                    <input
                      className="form-container__input"
                      type="text"
                      id="firstName"
                      name="firstName"
                      onChange={handleChange}
                      value={user.userAccount.firstName}
                    ></input>
                    {errors.firstNameError && (
                      <span className="form-container__error-msg">
                        {messages.firstName_incorrect}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-container__row">
                  <div className="row__col-25">
                    <label htmlFor="lastName">Nazwisko: </label>
                  </div>
                  <div className="row__col-75">
                    <input
                      className="form-container__input"
                      type="text"
                      id="lastName"
                      name="lastName"
                      onChange={handleChange}
                      value={user.userAccount.lastName}
                    ></input>
                    {errors.lastNameError && (
                      <span className="form-container__error-msg">
                        {messages.lastName_incorrect}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-container__row">
                  <div className="row__col-25">
                    <label htmlFor="phoneNumber">Nr telefonu: </label>
                  </div>
                  <div className="row__col-75">
                    <input
                      className="form-container__input"
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      pattern="[0-9]{9}"
                      placeholder="numer tel : 123456789"
                      onChange={handleChange}
                      value={user.userAccount.phoneNumber}
                    ></input>
                    {errors.phoneNumberError && (
                      <span className="form-container__error-msg">
                        {messages.phoneNumber_incorrect}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-container__row">
                  <div className="row__col-25">
                    <label htmlFor="sharing">
                      Udostępnianie konta najemcy:{" "}
                    </label>
                  </div>
                  <div className="row__col-75">
                    <input
                      className="form-container__input--checkbox"
                      type="checkbox"
                      id="sharing"
                      name="sharing"
                      onChange={handleChange}
                      checked={user.userAccount.sharing}
                    ></input>
                  </div>
                </div>
                {addressForm()}
                <div className="form-container__buttons">
                  <button type="submit">Stwórz</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserFormForRent;
