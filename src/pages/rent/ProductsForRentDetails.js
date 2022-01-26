import { useState, useEffect } from "react";
import { BsPlusSquareFill, BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { owner, admin, general, client } from "../../resources/urls";
import { DELETE, GET, POST } from "../../utilities/Request";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";

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
  const [showMediaRentsByDate, setShowMediaRentsByDate] = useState({});
  const [countersFilled, setCountersFilled] = useState(false);

  const getProductsForLocation = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.productsForLocation.prefix
        : props.roles[0] === "administrator"
        ? admin.productsForLocation.prefix
        : "";

    GET(
      `${urlByRole}${props.locationId}${general.productsForLocation.allProductsSuffix}`
    )
      .then((data) => {
        if (data !== null) {
          setProductsForLocation(data);
        } else {
          toast.error("Błąd połączenia z serwerem...");
        }
      })
      .catch((err) => {});
  };

  const getMediaStandardProducts = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.products
        : props.roles[0] === "administrator"
        ? admin.rent.products
        : props.roles[0] === "client"
        ? client.rent.products
        : "";
    let suffix =
      props.roles[0] === "client"
        ? general.rent.getAllMediaRentSuffix
        : general.rent.productsSuffix;

    GET(`${urlByRole}${props.rentId}${suffix}`).then((res) => {
      if (res !== null) {
        if (props.roles[0] === "client") {
          res.map((date) => {
            setShowMediaRentsByDate({
              ...showMediaRentsByDate,
              [date.startDate]: false,
            });
            return date;
          });
        } else {
          let valuesObj = {};
          res.map((prod) => {
            const obj = {};
            obj[prod.product.productId] = {
              counter: "",
              quantity: false,
            };
            Object.assign(valuesObj, obj);

            return prod;
          });
          setValues(valuesObj);
        }
        setProducts(res);
      }
    });
  };

  const getAllProducts = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.allProducts
        : props.roles[0] === "administrator"
        ? admin.rent.allProducts
        : "";

    GET(`${urlByRole}${props.rentId}${general.rent.productsAllSuffix}`).then(
      (res) => {
        if (res !== null) {
          setAllProducts(res);
        }
      }
    );
  };

  const getDateToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd + "T00:00:00";
    return today;
  };

  const checkIssuedAllMediaRentStandard = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.checkIssuedAllMediaRentStandardPrefix
        : props.roles[0] === "administrator"
        ? admin.rent.checkIssuedAllMediaRentStandardPrefix
        : "";
    GET(
      `${urlByRole}${props.rentId}${general.rent.checkIssuedAllMediaRentStandardSuffix}`
    ).then((res) => {
      if (res !== null) {
        setCountersFilled(res);
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      var today = new Date();

      let lessThanMonthAgo = "";
      if (props.payments !== undefined && props.payments !== null) {
        lessThanMonthAgo = props.payments.find((payment) => {
          const paymentDate = new Date(payment.paymentDate);
          var Difference_In_Time = paymentDate.getTime() - today.getTime();
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

          return Difference_In_Days < 30;
        });

        if (lessThanMonthAgo !== undefined) {
          setCountersAvailable(false);
          setLastPaymentDate(lessThanMonthAgo.startDate);
        } else {
          setCountersAvailable(true);
          checkIssuedAllMediaRentStandard();
        }
      } else {
        setCountersAvailable(true);
        checkIssuedAllMediaRentStandard();
      }

      getMediaStandardProducts();
      if (props.roles[0] !== "client") {
        getAllProducts();
        getProductsForLocation();
      }
    }
    return () => {
      mounted = false;
    };
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
        : props.roles[0] === "administrator"
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
        toast.info(
          "Stany liczników zostały już wprowadzone, możesz wystawić płatność za bieżący miesiąc."
        );
      }
      return res;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = formValidation();

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
            : props.roles[0] === "administrator"
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
          : props.roles[0] === "administrator"
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
              defaultValue={""}
            >
              <option value=""></option>
              {productsForLocation.map((prod) => (
                <option key={prod.productId} value={prod.productId}>
                  {prod.productName}
                </option>
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
          {allProducts !== undefined && allProducts.length > 0 ? (
            <>
              {allProducts.map((prod) => (
                <li key={prod.product.productName}>
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
            <h3>Brak</h3>
          )}
        </ul>
      </div>
    );
  };

  var cellDateFormatter = function (cell, formatterParams) {
    return cell.getValue().split("T")[0];
  };

  const columns = [
    {
      title: "Data",
      field: "startDate",
      formatter: cellDateFormatter,
    },
    {
      title: "Produkt",
      field: "product.productName",
    },
    {
      title: "Jm",
      field: "product.quantityUnit",
    },
    {
      title: "Stan licznika",
      field: "counter",
    },
  ];

  const renderTable = (data) => {
    return (
      <Tabulator
        className="custom-tabulator"
        columns={columns}
        data={data}
        options={{
          debugInvalidOptions: false,
          movableColumns: true,
          movableRows: true,
          pagination: "local",
          paginationSizeSelector: [5, 10, 20, 50],
          paginationSize: 5,
          setFilter: true,
          langs: {
            default: {
              pagination: {
                page_size: "Wyniki na stronie",
                first: "Pierwsza",
                first_title: "Pierwsza",
                last: "Ostatnia",
                last_title: "Ostatnia",
                prev: "Poprzednia",
                prev_title: "Poprzednia",
                next: "Następna",
                next_title: "Następna",
              },
            },
          },
        }}
        layout="fitColumns"
        responsiveLayout="hide"
        tooltips="true"
        addRowPos="top"
        history="true"
        movableColumns="true"
        resizableRows="true"
        initialSort={[
          //set the initial sort order of the data
          { column: "startDate", dir: "asc" },
        ]}
      />
    );
  };

  return (
    <>
      <h1 className="content-container__title">Produkty wynajmu</h1>

      <div className="form-container">
        {props.roles[0] === "client" ? (
          props.counterMediaRent ? (
            <ul>
              <h1>Media</h1>
              {products !== undefined &&
              products !== null &&
              products.length > 0 ? (
                <>
                  {products.map((data) => (
                    <li key={data.startDate}>
                      <h3
                        className="details-container__history"
                        onClick={() => {
                          const newVal = !showMediaRentsByDate[data.startDate];
                          setShowMediaRentsByDate({
                            ...showMediaRentsByDate,
                            [data.startDate]: newVal,
                          });
                        }}
                      >
                        {data.startDate}
                      </h3>

                      {showMediaRentsByDate[data.startDate] && (
                        <div
                          className="table-container"
                          style={{ marginLeft: "0" }}
                        >
                          {renderTable(data.mediaRents)}
                        </div>
                      )}
                    </li>
                  ))}
                </>
              ) : (
                <h3>Brak mediów</h3>
              )}
            </ul>
          ) : (
            <h3 className="form-container__error-msg">
              Nie można wyświetlić liczników, skontaktuj się z właścicielem
              lokalu aby otrzymać uprawniena do tych informacji.
            </h3>
          )
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              className="form-container"
              style={{ borderStyle: "groove", padding: "20px" }}
            >
              <h1>Media</h1>
              {products !== undefined &&
              values !== undefined &&
              products.length > 0 ? (
                products.map((prod) => (
                  <div
                    key={prod.product.productId}
                    className="form-container__row"
                  >
                    <div
                      className="row__col-25"
                      style={{
                        whiteSpace: "nowrap",
                        marginRight: "15px",
                        width: "300px",
                      }}
                    >
                      <label
                        htmlFor={prod.product.productId}
                        style={{
                          display: "inline-block",
                          width: "200px",
                        }}
                      >
                        <div
                          className="icon-container"
                          style={{
                            fontSize: "25px",
                            display: "inline-block",
                            width: "50px",
                            marginTop: "0px",
                          }}
                        >
                          <BsTrashFill
                            className="icon-container__delete-icon"
                            onClick={() =>
                              handleDeleteProduct(prod.product.productId)
                            }
                          />
                          <p>Usuń</p>
                        </div>
                        {prod.product.productName}
                      </label>
                    </div>
                    <div className="row__col-75">
                      <input
                        style={{ width: "200px" }}
                        disabled={!countersAvailable || countersFilled}
                        placeholder={
                          !countersAvailable
                            ? `ostatnia płatność: ${lastPaymentDate}`
                            : countersFilled
                            ? "Wprowadzono"
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
                        disabled={!countersAvailable || countersFilled}
                        type="checkbox"
                        name={prod.product.productId}
                        id={prod.product.productId}
                        value={values[prod.product.quantity]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <h3>Brak produktów typu media standard</h3>
              )}

              <div className="form-container__row">
                {error && (
                  <span className="form-container__error-msg">{errorMsg}</span>
                )}
                {countersFilled && (
                  <span>
                    Wprowadzono stany liczników, można wystawić płatność
                  </span>
                )}

                {props.roles[0] !== "client" && (
                  <div className="form-container__buttons">
                    <button
                      disabled={
                        !countersAvailable ||
                        products === undefined ||
                        products === null ||
                        products.length === 0 ||
                        countersFilled
                      }
                      type="submit"
                      style={{ marginLeft: "55%" }}
                    >
                      Zapisz
                    </button>
                  </div>
                )}
              </div>
            </div>

            {props.roles[0] !== "client" && (
              <h3
                className="details-container__history"
                onClick={() => setShowAllProducts(!showAllProducts)}
                style={{ marginLeft: "15%" }}
              >
                Pokaż pozostałe produkty
              </h3>
            )}

            {showAllProducts ? renderAllProducts() : ""}
          </form>
        )}

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
