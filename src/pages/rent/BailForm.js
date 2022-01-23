import { useState } from "react";
import { toast } from "react-toastify";
import { admin, general, owner } from "../../resources/urls";
import { POST, PUT } from "../../utilities/Request";

const BailForm = (props) => {
  const [bail, setBail] = useState(
    props.data !== undefined
      ? {
          bailType: props.data.bailType,
          cost: props.data.cost,
          description: props.data.description,
        }
      : { bailType: "", cost: 0, description: "" }
  );
  const [errors, setErrors] = useState({
    bailTypeError: false,
    costError: false,
  });
  const [sending, setSending] = useState(false);

  const messages = {
    bailTypeIncorrect: "Wybierz rodzaj",
    costIncorrect: "Wprowadź poprawną wartość kaucji",
  };
  const formValidation = () => {
    let bailType = false;
    let cost = false;

    if (bail.bailType.length > 0) {
      bailType = true;
    }

    if (bail.cost > 0) {
      cost = true;
    }

    const correct = bailType && cost;

    return { correct, bailType, cost };
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBail({ ...bail, [name]: value });
  };

  const addBailRequest = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.newBail
        : props.roles[0] === "administrator"
        ? admin.rent.newBail
        : "";

    let json = JSON.stringify(bail);

    POST(`${urlByRole}${props.rentId}${general.rent.newBailSuffix}`, json).then(
      (res) => {
        if (res.ok) {
          toast.success("Dodano kaucję");
          props.handleReturn();
          setSending(false);
        } else {
          res.json().then((res) => {
            toast.error(`Nie udało się dodać kaucji: ${res.error}`);
            setSending(false);
          });
        }
      }
    );
  };

  const updateBailRequest = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.updateBail
        : props.roles[0] === "administrator"
        ? admin.rent.updateBail
        : "";

    let json = JSON.stringify(bail);

    PUT(
      `${urlByRole}${props.rentId}${general.rent.updateBailPrefix}${props.data.bailId}`,
      json
    ).then((res) => {
      if (res.ok) {
        toast.success("Aktualizowano kaucję");
        props.handleReturn();
        setSending(false);
      } else {
        res.json().then((res) => {
          toast.error(`Nie udało się aktualizować kaucji: ${res.error}`);
          setSending(false);
        });
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = formValidation();

    if (!sending && validation.correct) {
      setSending(true);

      props.data !== undefined ? updateBailRequest() : addBailRequest();
      setErrors({
        bailTypeError: false,
        costError: false,
      });
    } else {
      setErrors({
        bailTypeError: !validation.bailType,
        costError: !validation.cost,
      });
    }
  };

  return (
    <>
      <h1 className="content-container__title">Dodawanie kaucji</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="bailType"> Rodzaj płatności:</label>
            </div>
            <div className="row__col-75">
              <select
                name="bailType"
                id="bailType"
                className="form-container__input"
                onChange={handleChange}
                value={bail.bailType}
              >
                <option value=""></option>
                <option value="CARD_PAYMENT">płatność kartą/gotówką</option>
                <option value="CARD_WITHDRAW">wypłata kartą/gotówką</option>
                <option value="CONFIRMATION_OF_PAYMENT">
                  płatność przelewem
                </option>
                <option value="CONFIRMATION_OF_WITHDRAW">
                  wypłata przelewem
                </option>
              </select>
              {errors.bailTypeError && (
                <span className="form-container__error-msg">
                  {messages.bailTypeIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="cost"> Wartość:</label>
            </div>
            <div className="row__col-75">
              <input
                type="number"
                id="cost"
                name="cost"
                className="form-container__input"
                onChange={handleChange}
                value={bail.cost}
              />
              {errors.costError && (
                <span className="form-container__error-msg">
                  {messages.costIncorrect}
                </span>
              )}
            </div>
          </div>
          <div className="form-container__row">
            <div className="row__col-25">
              <label htmlFor="description"> Opis:</label>
            </div>
            <div className="row__col-75">
              <input
                type="text"
                id="description"
                name="description"
                className="form-container__input"
                placeholder="opcjonalnie"
                onChange={handleChange}
                value={bail.description}
              />
            </div>
          </div>

          <div className="form-container__buttons">
            <button onClick={() => props.handleReturn()}>Powrót</button>

            <button type="submit" className="">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BailForm;
