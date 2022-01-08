import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { owner, admin, general } from "../../resources/urls";
import { GET, POST } from "../../utilities/Request";
const ProductsForRentDetails = (props) => {
  const [products, setProducts] = useState();
  const [values, setValues] = useState();
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  const [countersAvailable, setCountersAvailable] = useState(false);
  const [lastPaymentDate, setLastPaymentDate] = useState();
  const [errorMsg, setErrorMsg] = useState("Wypełnij wszystkie pola");
  const getProducts = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.products
        : props.roles[0] === "admin"
        ? admin.rent.products
        : "";

    GET(`${urlByRole}${props.rentId}${general.rent.productsSuffix}`).then(
      (res) => {
        setProducts(res);
        let valuesObj = {};
        res.map((prod) => {
          const obj = {};
          obj[prod.product.productId] = {
            counter: "",
            quantity: false,
          };
          Object.assign(valuesObj, obj);
        });
        setValues(valuesObj);
      }
    );
  };

  const getDateToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    today = yyyy + "-" + mm + "-" + dd + "T" + time;
    return today;
  };

  useEffect(() => {
    var today = new Date();

    let lessThanMonthAgo = "";
    if (props.payments !== undefined) {
      lessThanMonthAgo = props.payments.find((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        var Difference_In_Time = paymentDate.getTime() - today.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        return Difference_In_Days < 30;
      });

      if (lessThanMonthAgo !== undefined) {
        setCountersAvailable(false);
        setLastPaymentDate(lessThanMonthAgo.paymentDate);
      } else {
        setCountersAvailable(true);
      }
    } else {
      setCountersAvailable(true);
    }

    getProducts();
  }, []);

  const formValidation = () => {
    let correct = false;
    const valuesArr = Object.values(values);
    const emptyValue = valuesArr.find((val) => val.counter.length === 0);

    if (emptyValue === undefined) {
      correct = true;
    }

    return { correct };
  };

  const addCountersRequest = async () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.addAllMediaCounters
        : props.roles[0] === "admin"
        ? admin.rent.addAllMediaCounters
        : "";

    let objArr = [];
    const date = getDateToday();

    for (const [key, value] of Object.entries(values)) {
      const isQuantiy = value.quantity;
      const counter = {
        counter: isQuantiy ? "" : value.counter,
        quantity: isQuantiy ? value.counter : "",
        productId: key,
        startDate: date,
      };
      objArr.push(counter);
    }

    let json = JSON.stringify(objArr);

    return await POST(
      `${urlByRole}${props.rentId}${general.rent.addAllMediaCountersSuffix}`,
      json
    ).then((res) => {
      if (res.ok) {
        toast.success("Stan liczników został zapisany");
      } else {
        toast.error("Nie udało się zapisać stanu liczników...");
      }
      return res;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = formValidation();
    console.log("correct: ", validation.correct);
    if (!sending) {
      setSending(true);
      if (validation.correct) {
        addCountersRequest().then((res) => {
          setSending(false);
          if (!res.ok) {
            setError(true);
            setErrorMsg(res.json().error);
          } else {
            setError(false);
            props.handleReturn();
          }
        });
      } else {
        setError(true);
        setSending(false);
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const type = e.target.type;

    if (type === "checkbox") {
      const checked = e.target.checked;
      const counterValue = values[name].counter;
      setValues({
        ...values,
        [name]: { counter: counterValue, quantity: checked },
      });
    } else {
      const value = e.target.value;
      const quantityValue = values[name].quantity;
      setValues({
        ...values,
        [name]: { quantity: quantityValue, counter: value },
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {products !== undefined && values !== undefined
          ? products.map((prod) => (
              <>
                <div className="form-container__row">
                  <div className="row__col-25">
                    <label htmlFor={prod.product.productId}>
                      {prod.product.productName}
                    </label>
                  </div>
                  <div className="row__col-75">
                    <input
                      disabled={!countersAvailable}
                      placeholder={
                        !countersAvailable
                          ? `ostatnia płatność: ${lastPaymentDate}`
                          : "Wprowadź stan licznika"
                      }
                      className="form-container__input"
                      type="number"
                      name={prod.product.productId}
                      id={prod.product.productId}
                      value={values[prod.product.productId.counter]}
                      onChange={handleChange}
                    />
                    różnica:
                    <input
                      disabled={!countersAvailable}
                      type="checkbox"
                      name={prod.product.productId}
                      id={prod.product.productId}
                      value={values[prod.product.quantity]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ))
          : ""}
        <div className="form-container__row">
          <div>
            {error && (
              <span className="form-container__error-msg">{errorMsg}</span>
            )}
          </div>
        </div>

        <div className="form-container__buttons">
          <button
            className="content-container__button"
            onClick={() => props.handleReturn()}
          >
            Powrót
          </button>
          <button type="submit">Zapisz</button>
        </div>
      </form>
    </div>
  );
};

export default ProductsForRentDetails;
