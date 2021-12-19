import "../../styles/App.scss";
import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";
import { GET } from "../../utilities/Request";
import { user as userReq } from "../../resources/urls";

const UserFormForRent = (props) => {
  const [sending, setSending] = useState(false);
  const [userEmail, setUserEmail] = useState(
    props.defaultEmail.length > 0 ? props.defaultEmail : props.defaultUser.email
  );
  const [emailSubmit, setEmailSubmit] = useState(false);
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

  const [errors, setErrors] = useState({
    emailError: false,
    firstNameError: false,
    lastNameError: false,
    phoneNumberError: false,
  });

  // const getResources = async () => {
  //   const response = await fetch("/resources.json");
  //   const resources = await response.json();
  //   return resources;
  // };

  const messages = {
    email_incorrect: "Podaj prawidłowy adres email",
    firstName_incorrect: "Wpisz od 3 do 30 znaków",
    lastName_incorrect: "Wpisz od 3 do 60 znaków",
    phoneNumber_incorrect: "Podaj prawidłowy numer telefonu (123456789)",
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

    const correct = email && firstName && lastName && phoneNumber;

    return {
      correct,
      firstName,
      lastName,
      phoneNumber,
      email,
    };
  };

  const findUserByEmail = async () => {
    let userExists = false;

    await GET(`${userReq.findByEmail}?email=${userEmail}`)
      .then((res) => {
        console.log("ODP: ", res);
        if (res.ok) {
          userExists = true;
          return res;
        } else {
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
          props.setEmail(userEmail, {
            email: userEmail,
            firstName: res.firstName,
            lastName: res.lastName,
            phoneNumber: res.phoneNumber,
            sharing: true,
          });
          props.stepDone(1);
        }
        return userExists;
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });

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
      setUser({
        ...user,
        userAccount: {
          ...user.userAccount,
          [name]: checked,
        },
      });
    }
  };

  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();

    if (!sending) {
      setSending(true);
      const validation = formValidation();

      if (validation.correct) {
        props.setUser(user.userAccount);
        props.stepDone(1);
      } else {
        setSending(false);
        setErrors({
          emailError: !validation.email,
          firstNameError: !validation.firstName,
          lastNameError: !validation.lastName,
          phoneNumberError: !validation.phoneNumber,
        });
      }
    }
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
                  <span className="error-msg">{messages.email_incorrect}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="form-container__buttons"
              disabled={user.toCreate}
            >
              Dalej
            </button>
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
                      <span className="error-msg">
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
                      <span className="error-msg">
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
                      <span className="error-msg">
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

                <button type="submit" className="form-container__buttons">
                  Stwórz
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserFormForRent;
