import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { owner, admin, general } from "../../resources/urls";
import { GET, POST } from "../../utilities/Request";
const ProductsForRentDetails = (props) => {
  const [products, setProducts] = useState();
  const [values, setValues] = useState();
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
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
        let valuesArr = [];
        res.map((prod) => {
          const value = { [prod.product.productId]: "" };
          valuesArr.push(value);
        });
        let valuesObj = {};
        Object.assign(valuesObj, ...valuesArr);
        setValues(valuesObj);
      }
    );
  };

  useEffect(() => {
    getProducts();
  }, []);

  const formValidation = () => {
    let correct = false;
    const valuesArr = Object.values(values);
    const emptyValue = valuesArr.find((val) => val.length === 0);

    if (emptyValue === undefined) {
      correct = true;
    }

    return { correct };
  };

  const addCountersRequest = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.addAllMediaCounters
        : props.roles[0] === "admin"
        ? admin.rent.addAllMediaCounters
        : "";

    //przygotować obiekt

    POST(
      `${urlByRole}${props.rentId}${general.rent.addAllMediaCountersSuffix}`
    ).then((res) => {
      if (res.ok) {
        toast.success("Stan liczników został zapisany");
      } else {
        toast.error("Nie udało się zapisać stanu liczników...");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = formValidation();
    console.log("correct: ", validation.correct);
    if (!sending) {
      setSending(true);
      if (validation.correct) {
        addCountersRequest().then(setSending(false));
        setError(false);
      } else {
        setError(true);
        setSending(false);
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
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
                      className="form-container__input"
                      type="number"
                      name={prod.product.productId}
                      id={prod.product.productId}
                      value={values[prod.product.productId]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ))
          : ""}
        {error && <span className="error-msg">Wypełnij wszystkie pola</span>}
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
