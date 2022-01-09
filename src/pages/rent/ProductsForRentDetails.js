import { useState, useEffect } from "react";
import { BsPlusSquareFill, BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { owner, admin, general } from "../../resources/urls";
import { DELETE, GET, POST } from "../../utilities/Request";
const ProductsForRentDetails = (props) => {
  const [products, setProducts] = useState();
  const [values, setValues] = useState();
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  const [countersAvailable, setCountersAvailable] = useState(false);
  const [lastPaymentDate, setLastPaymentDate] = useState();
  const [errorMsg, setErrorMsg] = useState("Wypełnij wszystkie pola");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [allProducts, setAllProducts] = useState();
  const [addProduct, setAddProduct] = useState(false);
  const [productsForLocation, setProductsForLocation] = useState();

  const getProductsForLocation = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.productsForLocation.prefix
        : props.roles[0] === "admin"
        ? admin.productsForLocation.prefix
        : "";

    GET(
      `${urlByRole}${props.locationId}${general.productsForLocation.allProductsSuffix}`
    )
      .then((data) => {
        setProductsForLocation(data);
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  const getMediaStandardProducts = () => {
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

  const getAllProducts = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.allProducts
        : props.roles[0] === "admin"
        ? admin.rent.allProducts
        : "";

    GET(`${urlByRole}${props.rentId}${general.rent.productsAllSuffix}`).then(
      (res) => {
        setAllProducts(res);
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

    getMediaStandardProducts();
    getAllProducts();
    getProductsForLocation();
  }, [sending]);

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

  const handleDeleteProduct = (id) => {
    if (!sending) {
      if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
        setSending(true);
        let urlByRole =
          props.roles[0] === "owner"
            ? owner.rent.deleteProductPrefix
            : props.roles[0] === "admin"
            ? admin.rent.deleteProductPrefix
            : "";

        DELETE(
          `${urlByRole}${props.rentId}${general.rent.deleteProductPrefix}${id}`
        ).then((res) => {
          if (res) {
            toast.success("Produkt został usunięty");
            setSending(false);
          } else {
            toast.success(`Nie udało się usunąć produktu: ${res.error}`);
            setSending(false);
          }
        });
      }
    }
  };

  const handleAddProduct = (e) => {
    const value = e.target.value;
    if (!sending) {
      setSending(true);
      let urlByRole =
        props.roles[0] === "owner"
          ? owner.rent.addProduct
          : props.roles[0] === "admin"
          ? admin.rent.addProduct
          : "";

      POST(
        `${urlByRole}${props.rentId}${general.rent.addProductPrefix}${value}`
      ).then((res) => {
        if (res.ok) {
          toast.success("Produkt został dodany");
          setSending(false);
          setAddProduct(false);
        } else {
          res.json().then((res) => {
            toast.success(`Nie udało się dodać produktu: ${res.error}`);
            setSending(false);
            setAddProduct(false);
          });
        }
      });
    }
  };

  const renderAllProducts = () => {
    return (
      <div className="details-container">
        {addProduct && productsForLocation !== undefined ? (
          <>
            <select
              style={{ maxWidth: "200px", width: "50%" }}
              name="newProductnewProduct"
              className="form-container__input"
              onChange={handleAddProduct}
            >
              <option value="" selected="true"></option>
              {productsForLocation.map((prod) => (
                <option value={prod.productId}>{prod.productName}</option>
              ))}
            </select>
          </>
        ) : (
          <div className="icon-container" style={{ fontSize: "24px" }}>
            <BsPlusSquareFill
              className="icon-container__new-icon"
              onClick={() => setAddProduct(true)}
            />
          </div>
        )}

        <ul>
          {allProducts !== undefined ? (
            <>
              {allProducts.map((prod) => (
                <li key={prod.product.productId}>
                  {prod.product.productName}
                  <div className="icon-container" style={{ fontSize: "15px" }}>
                    <BsTrashFill
                      className="icon-container__delete-icon"
                      onClick={() =>
                        handleDeleteProduct(prod.product.productId)
                      }
                    />
                    <p>Usuń</p>
                  </div>
                </li>
              ))}
            </>
          ) : (
            ""
          )}
        </ul>
      </div>
    );
  };

  return (
    <>
      <h1 className="content-container__title">Produkty wynajmu</h1>
      <div className="form-container">
        <h1>Media</h1>
        <form onSubmit={handleSubmit}>
          {products !== undefined && values !== undefined
            ? products.map((prod) => (
                <>
                  <div className="form-container__row">
                    <div className="row__col-25">
                      <div
                        className="icon-container"
                        style={{ fontSize: "25px" }}
                      >
                        <BsTrashFill
                          className="icon-container__delete-icon"
                          onClick={() =>
                            handleDeleteProduct(prod.product.productId)
                          }
                        />
                        <p>Usuń</p>
                      </div>
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
            <button type="submit" style={{ marginLeft: "55%" }}>
              Zapisz
            </button>
          </div>
          <h3
            className="details-container__history"
            onClick={() => setShowAllProducts(!showAllProducts)}
            style={{ marginLeft: "15%" }}
          >
            Pokaż pozostałe produkty
          </h3>
          {showAllProducts ? renderAllProducts() : ""}
        </form>

        <div className="details-container__buttons">
          <button
            className="details-container__button--return"
            onClick={() => props.handleReturn()}
            style={{ marginTop: "10%" }}
          >
            Powrót
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductsForRentDetails;
