import React, { useState, useEffect } from "react";
import "../../styles/App.scss";
import "./UserProfile.css";
import UserProfileEdit from "./UserProfileEdit";
import { GET, PATCH, PUT } from "../../utilities/Request";
import { user as userReq } from "../../resources/urls";
import ToggleButton from "react-toggle-button";
import { toast } from "react-toastify";
import CompanyForm from "./CompanyForm";

const UserProfile = () => {
  const [user, setUser] = useState({
    data: [],
  });
  const [edit, setEdit] = useState(false);
  const [showFakturowniaSettingsForm, setShowFakturowniaSettingsForm] =
    useState();
  const [fakturowniaSettings, setFakturowniaSettings] = useState({
    apiToken: "",
    prefix: "",
  });
  const [company, setCompany] = useState();
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [sending, setSending] = useState(false);

  const getData = () => {
    GET(userReq.info)
      .then((data) => {
        console.log("blablabla", data);
        setUser({ data });
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  const getCompany = () => {
    GET(userReq.getCompany).then((res) => {
      setCompany(res);
    });
  };

  useEffect(() => {
    getData();
    getCompany();
  }, [edit]);

  const handleChangeIsFakturownia = () => {
    console.log("Company: ", company);
    if (user.data.isNaturalPerson) {
      toast.info("Nie mozesz dodać fakturowni jako osoba fizyczna");
    } else if (user.data.apiToken === null || user.data.prefix === null) {
      setShowFakturowniaSettingsForm(true);
    } else {
      PATCH(userReq.changeIsFakturownia).then((res) => {
        if (res) {
          getData();
        } else {
          toast.info("Dodaj dane do fakturowni");
          setShowFakturowniaSettingsForm(true);
        }
      });
    }
  };

  const handleFakturSettSubmit = (e) => {
    e.preventDefault();
    if (!sending) {
      setSending(true);
      const obj = JSON.stringify(fakturowniaSettings);
      PUT(userReq.updateFakturowniaSettings, obj).then((res) => {
        if (res.ok) {
          setShowFakturowniaSettingsForm(false);
          toast.success("Dodano fakturownię");
          setSending(false);
          PATCH(userReq.changeIsFakturownia).then((res) => {
            getData();
          });
        } else {
          res.json().then((res) => {
            toast.success(`Nie udało się dodać fakturowni: ${res.error}`);
            setSending(false);
          });
        }
      });
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name);
    setFakturowniaSettings({ ...fakturowniaSettings, [name]: value });
  };

  const handleReturn = () => {
    setShowCompanyForm(false);
    setEdit(false);
    getData();
    getCompany();
  };

  const changeIsNaturalPerson = () => {
    const oldStatus = user.data.isNaturalPerson;
    const newStatus = oldStatus ? "firmę" : "osobę fizyczną";
    PATCH(userReq.updateIsNaturalPerson).then((res) => {
      if (res) {
        toast.success(`Zmieniono rodzaj użytkownika na ${newStatus}`);
        getData();
      } else {
        toast.error("Nie udało się zmienić statusu użytkownika...");
      }
    });
  };

  const handleIsNaturalPersonChange = () => {
    const oldStatus = user.data.isNaturalPerson;
    const newStatus = oldStatus ? "firmę" : "osobę fizyczną";
    if (window.confirm(`Czy na chcesz zmienić status na ${newStatus}?`)) {
      if (company === undefined || company.length === 0) {
        setShowCompanyForm(true);
      } else {
        changeIsNaturalPerson();
      }
    }
  };

  const fakturowniaSettingsForm = (updata = false) => {
    return (
      <>
        <h3 className="form-container__error-msg">
          Wprowadź token i prefix fakturowni
        </h3>
        <form onSubmit={handleFakturSettSubmit}>
          <div
            style={{
              margin: "0 0 0 0 ",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="" style={{ padding: "0 0 0 0" }}>
              ApiToken:{" "}
              <input
                required="true"
                type="text"
                name="apiToken"
                id="apiToken"
                className="form-container--table__input"
                style={{ maxWidth: "250px", margin: "0 0 0 0" }}
                value={fakturowniaSettings.apiToken}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="" style={{ padding: "3px 0 0 0" }}>
              Prefix:{" "}
              <input
                required="true"
                type="text"
                name="prefix"
                id="prefix"
                className="form-container--table__input"
                style={{ maxWidth: "250px", margin: "0 0 0 0" }}
                value={fakturowniaSettings.prefix}
                onChange={handleChange}
              />
            </label>
          </div>
          <button
            type="submit"
            className="details-container__button"
            style={{ marginTop: "15px" }}
          >
            Zapisz
          </button>
        </form>
      </>
    );
  };

  return (
    <div className="content-container">
      <h1 className="content-container__title">Dane użytkownika</h1>
      {edit ? (
        <UserProfileEdit data={user.data} back={handleReturn} />
      ) : showCompanyForm ? (
        <CompanyForm
          handleReturn={handleReturn}
          changeIsNaturalPerson={changeIsNaturalPerson}
        />
      ) : (
        <div className="details-container">
          <ul style={{ marginBottom: "50px" }}>
            <li>Imię: {user.data.firstName}</li>
            <li>Nazwisko: {user.data.lastName}</li>
            <li>Email: {user.data.email}</li>
            <li>Numer tel: {user.data.phoneNumber}</li>
            <li>
              Rodzaj użytkownika:
              <b
                className="details-container__history"
                onClick={handleIsNaturalPersonChange}
              >
                {user.data.isNaturalPerson ? "osoba fizyczna" : "firma"}
              </b>
            </li>
            <li>
              <div className="togglebutton-container">
                <h3 className="togglebutton-container__label">Fakturownia</h3>
                <ToggleButton
                  value={user.data.isFakturownia}
                  onToggle={() => handleChangeIsFakturownia()}
                />
              </div>
            </li>
            <li>
              {showFakturowniaSettingsForm ? fakturowniaSettingsForm() : ""}
            </li>
            <li>
              {user.data.isFakturownia && (
                <>
                  <b
                    className="details-container__history"
                    // onClick={handleIsNaturalPersonChange}
                  >
                    Pokaż ustawienia API
                  </b>
                  {/* <div className="togglebutton-container">
                <h3 className="togglebutton-container__label">isDepartment</h3>
                <ToggleButton
                  value={user.data.isFakturownia}
                  onToggle={() => handleChangeIsFakturownia()}
                />
              </div> */}
                </>
              )}
            </li>
          </ul>

          <button
            onClick={() => setEdit(true)}
            className="details-container__button"
          >
            Edytuj dane
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
