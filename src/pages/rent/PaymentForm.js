import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { admin, client, general, owner } from "../../resources/urls";
import { GET, POST } from "../../utilities/Request";

const PaymentForm = (props) => {
  const [media, setMedia] = useState();
  const [mediaForPayment, setMediaForPayment] = useState();
  const [today, setToday] = useState();
  const [payment, setPayment] = useState({
    income: true,
    invoiceId: "",
    paymentDate: 0,
    paymentTypeId: 1,
    positionOnPaymentSet: [],
    startDate: "",
  });

  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({
    paymentDateError: false,
  });

  const getMedia = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.getAllMediaRent
        : props.roles[0] === "admin"
        ? admin.rent.getAllMediaRent
        : props.roles[0] === "client"
        ? client.rent.getAllMediaRent
        : "";
    GET(
      `${urlByRole}${props.rentId}${general.rent.getAllMediaRentSuffix}`
    ).then((res) => {
      setMedia(res);
      let mediaArr = [];
      res.map((m) => {
        mediaArr.push(m.mediaRentId);
      });
      setMediaForPayment(mediaArr);
    });
  };

  const addMediaQuantRequest = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.sumMediaQuantity
        : props.roles[0] === "admin"
        ? admin.rent.sumMediaQuantity
        : "";
    POST(
      `${urlByRole}${props.rentId}${general.rent.sumMediaQuantitySuffix}`
    ).then((res) => {
      if (res.ok) {
        toast.success("Dodano media ilościowe");
      } else {
        res.json().then((res) => {
          const errMsg = res.error;
          toast.error(
            `Wystapił problem z dodaniem mediów ilościowych: 
            ${errMsg}`
          );
        });
      }
    });
  };
  useEffect(() => {
    const todayVal = getDateToday();
    setToday(todayVal);
    setPayment({
      ...payment,
      startDate: todayVal,
    });
    getMedia();
    addMediaQuantRequest();
  }, []);

  useEffect(() => {
    if (mediaForPayment !== undefined) {
      let mediaArr = [];
      let mediaSet = new Set(mediaForPayment);
      media.map((m) => {
        const id = parseInt(m.mediaRentId);
        if (mediaSet.has(id)) {
          const obj = { mediaRentId: id, name: m.product.productName };
          mediaArr.push(obj);
        }
      });

      setPayment({ ...payment, positionOnPaymentSet: mediaArr });
    }
  }, [mediaForPayment]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setPayment({
      ...payment,
      [name]: value,
    });
  };

  const formValidation = () => {
    let paymentDate = false;

    if (payment.paymentDate > 0 && payment.paymentDate < 32) {
      paymentDate = true;
    }

    const correct = paymentDate;

    return { correct, paymentDate };
  };

  const handleMediaForPayment = (e) => {
    const name = parseInt(e.target.name);

    let set = new Set(mediaForPayment);

    if (set.has(name)) {
      set.delete(name);
    } else {
      set.add(name);
    }

    setMediaForPayment(Array.from(set));
  };

  const getDateToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();

    today = yyyy + "-" + mm + "-" + dd + "T" + time;
    return today;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = formValidation();

    if (!sending && validation.correct) {
      setSending(true);
      let urlByRole =
        props.roles[0] === "owner"
          ? owner.rent.newPayment
          : props.roles[0] === "admin"
          ? admin.newPayment
          : "";

      const obj = { ...payment };

      let json = JSON.stringify(obj);

      POST(
        `${urlByRole}${props.rentId}${general.rent.newPaymentSuffix}`,
        json
      ).then((res) => {
        if (res.ok) {
          toast.success("Dodano płatność pomyślnie");
          props.handleReturn();
        } else {
          toast.success("Nie udało się dodać płatności...");
        }
      });

      setErrors({ paymentDateError: false });
    } else {
      setSending(true);
      setErrors({ paymentDateError: !validation.paymentDate });
    }
  };
  return (
    <>
      <h1 className="content-container__title">Dodawanie płatności</h1>
      <div className="form-container">
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="">Od:</label>
          </div>
          <div className="row__col-75">
            <input
              type="datetime-local"
              min={today}
              id="startDate"
              name="startDate"
              className="form-container--table__input--250"
              value={payment.startDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="">Rodzaj:</label>
          </div>
          <div className="row__col-75">
            <select
              name="paymentTypeId"
              id="paymentTypeId"
              className="form-container--table__input--250"
              value={payment.paymentTypeId}
              // onChange={}
            >
              <option value="1">1</option>
            </select>
          </div>
        </div>
        <div className="form-container__row">
          <div className="row__col-25">
            <label htmlFor="">Dzień:</label>
          </div>
          <div className="row__col-75">
            <input
              type="number"
              max={31}
              id="paymentDate"
              name="paymentDate"
              className="form-container--table__input--250"
              value={payment.paymentDate}
              onChange={handleChange}
            />
            {errors.paymentDateError && (
              <span className="form-container__error-msg">
                Wprowadź poprawną wartość (1-31)
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="form-container--table">
        {media !== undefined && media.length > 0 ? (
          <>
            <div className="form-container--table__column-titles">
              <div className="column-title">Nazwa</div>
              <div className="column-title">Ilość</div>
              <div className="column-title">Jedn.</div>
              <div className="column-title">Cena netto</div>
              <div className="column-title">VAT%</div>
              <div className="column-title">Wart. netto</div>
              <div className="column-title">Wart. brutto</div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="form-container--table__form"
            >
              {media.map((m) => (
                <>
                  <input
                    disabled="true"
                    type="text"
                    id="productName"
                    name="productName"
                    className="form-container--table__input--250"
                    value={m.product.productName}
                  />
                  <input
                    disabled="true"
                    type="text"
                    id="1"
                    name="1"
                    className="form-container--table__input"
                    value={m.quantity}
                    //   onChange={}
                  />
                  <input
                    disabled="true"
                    type="text"
                    id="1"
                    name="1"
                    className="form-container--table__input"
                    value={m.product.quantityUnit}
                  />
                  <input
                    disabled="true"
                    type="text"
                    id="1"
                    name="1"
                    className="form-container--table__input"
                    value={m.price}
                  />
                  <input
                    disabled="true"
                    type="text"
                    id="1"
                    name="1"
                    className="form-container--table__input"
                    value={m.vat}
                  />
                  <input
                    disabled="true"
                    type="text"
                    id="1"
                    name="1"
                    className="form-container--table__input"
                    value={m.quantity * m.price}
                  />
                  <input
                    disabled="true"
                    type="text"
                    id="1"
                    name="1"
                    className="form-container--table__input"
                    value={m.price + m.price * (m.vat / 100)}
                  />
                  <input
                    defaultChecked="true"
                    type="checkbox"
                    id="check"
                    name={m.mediaRentId}
                    className="form-container--table__input"
                    onChange={handleMediaForPayment}
                  />
                </>
              ))}
              <div className="form-container__buttons">
                <button onClick={props.handleReturn}>Powrót</button>
                <button type="submit">Zapisz</button>
              </div>
            </form>
          </>
        ) : (
          "Brak mediów"
        )}

        {media === undefined || media.length === 0 ? (
          <div className="form-container__buttons">
            <button onClick={props.handleReturn}>Powrót</button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PaymentForm;
