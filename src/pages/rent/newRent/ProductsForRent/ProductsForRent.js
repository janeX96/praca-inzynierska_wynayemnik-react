import { useState, useEffect } from "react";
import "./ProductsForRent.css";
import { GET } from "../../../../utilities/Request";
import { owner, admin } from "../../../../resources/urls";
const ProductsForRent = (props) => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(props.selectedSave);
  const [description, setDescription] = useState(props.default.description);
  const [countersError, setCountersError] = useState(false);
  //defaut selected
  const getProductsForType = async (type) => {
    let prefix =
      props.roles[0] === "owner"
        ? owner.productsForLocation.prefix
        : props.roles[0] === "administrator"
        ? admin.productsForLocation.prefix
        : "";

    let productsForTypeUrl =
      props.roles[0] === "owner"
        ? owner.productsForLocation.productsForType
        : props.roles[0] === "administrator"
        ? admin.productsForLocation.productsForType
        : "";

    return await GET(`${prefix}${props.locationId}${productsForTypeUrl}${type}`)
      .then((res) => {
        setSelectedProducts(res);
        return res;
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  const getAllProducts = async () => {
    let prefix =
      props.roles[0] === "owner"
        ? owner.productsForLocation.prefix
        : props.roles[0] === "administrator"
        ? admin.productsForLocation.prefix
        : "";
    let suffix =
      props.roles[0] === "owner"
        ? owner.productsForLocation.allProductsSuffix
        : props.roles[0] === "administrator"
        ? admin.productsForLocation.allProductsSuffix
        : "";
    return await GET(`${prefix}${props.locationId}${suffix}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (selectedProducts.length > 0) {
        //jeśli produkty były juz wcześniej wybrane
        const selected = selectedProducts;
        getAllProducts()
          .then((r) => {
            return r;
          })
          .then((r) => {
            const allProds = r;

            selectAvailableProducts(allProds, selected);
          });
      } else {
        //jeśli nie były jeszcze wybierane produkty to ustawiane są domyślne
        getProductsForType(props.premisesType)
          .then((res) => {
            return res;
          })
          .then((res) => {
            const selected = res;
            getAllProducts()
              .then((r) => {
                return r;
              })
              .then((r) => {
                const allProds = r;

                selectAvailableProducts(allProds, selected);
              });
          });
      }
    }
    return () => {
      mounted = false;
    };
  }, []);

  const selectAvailableProducts = (allProds, selectedProds) => {
    let products = [];

    allProds.map((product) => {
      let exists = false;
      selectedProds.map((selected) => {
        if (selected.productId === product.productId) {
          exists = true;
        }

        return selected;
      });
      if (!exists) {
        products.push(product);
      }
      return product;
    });

    setAvailableProducts(products);
  };

  const handleClick = (e) => {
    const id = "" + e.currentTarget.dataset.id;
    const table = e.currentTarget.dataset.name;

    let avSet = new Set([...availableProducts]);
    let selSet = new Set([...selectedProducts]);
    var found = "";
    if (table === "available") {
      for (let item of avSet) {
        if ("" + item.productId === id) {
          found = item;
          selSet.add(item);
        }
      }
      avSet.delete(found);
    } else if (table === "selected") {
      for (let item of selSet) {
        if ("" + item.productId === id) {
          found = item;
          avSet.add(item);
        }
      }
      selSet.delete(found);
    }

    setAvailableProducts([...avSet]);
    setSelectedProducts([...selSet]);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const action = e.currentTarget.dataset.name;

    let products = selectedProducts.map((product) => {
      const mediaStandard =
        product.productType === "MEDIA" && product.subtypeMedia === "STANDARD";

      const counterValue = mediaStandard ? product.counter : null;

      if (mediaStandard) {
        return { productId: product.productId, counter: counterValue };
      } else {
        return { productId: product.productId, counter: "" };
      }
    });

    props.addProductsAndDescritpion(products, description);
    props.saveSelectedProducts(selectedProducts);

    if (action === "next") {
      // let countersOk = true;
      // selectedProducts.map((p) => {
      //   if (
      //     p.productType === "MEDIA" &&
      //     p.subtypeMedia === "STANDARD" &&
      //     p.counter === undefined
      //   ) {
      //     countersOk = false;
      //   }

      //   return p;
      // });

      // if (countersOk) {
      //   setCountersError(false);
      //   props.stepDone(3);
      // } else {
      //   setCountersError(true);
      // }
      props.stepDone(3);
    } else {
      props.stepBack();
    }
  };

  const handleCounterChange = (e) => {
    const productId = e.target.name;
    const counterVal = e.target.value;

    const updatedProducts = selectedProducts.map((product) => {
      if ("" + product.productId === "" + productId) {
        product.counter = counterVal;
      }

      return product;
    });

    setSelectedProducts(updatedProducts);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="rent-summary">
      <div className="attach-products">
        <div className="products-list">
          <h3>Wybrane</h3>
          <ul>
            {selectedProducts.map((product) => (
              <li key={product.productId}>
                <div className="row">
                  <div className="col-25" style={{ marginLeft: "0px" }}>
                    <b>{product.productName}</b>
                    {product.productType === "MEDIA" &&
                    product.subtypeMedia === "STANDARD"
                      ? ", stan: " +
                        (product.counter !== undefined
                          ? product.counter
                          : "---")
                      : ""}
                  </div>
                  <div
                    className="col-75"
                    style={{ marginLeft: "0px", marginTop: "0px" }}
                  >
                    {product.productType === "MEDIA" &&
                    product.subtypeMedia === "STANDARD" ? (
                      <input
                        type="number"
                        min={0}
                        id={product.productId}
                        name={product.productId}
                        onChange={handleCounterChange}
                        placeholder="podaj stan licznika"
                      />
                    ) : (
                      ""
                    )}

                    <button
                      className="select-product-button"
                      onClick={handleClick}
                      data-id={product.productId}
                      data-name="selected"
                    >
                      {">"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="products-list">
          <h3>Dostępne</h3>
          <ul>
            {availableProducts.map((product) => (
              <li key={product.productId}>
                <button
                  className="select-product-button"
                  onClick={handleClick}
                  data-id={product.productId}
                  data-name="available"
                >
                  {"<"}
                </button>
                {product.productName}
                {product.productType === "MEDIA" &&
                product.subtypeMedia === "STANDARD"
                  ? ", stan: " +
                    (product.counter !== undefined ? product.counter : "---")
                  : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="form-container"
        style={{ maxWidth: "600px", marginTop: "0px", padding: "30px" }}
      >
        <div className="form-container__row">
          <div className="row__col-25 ">
            <label htmlFor="description">Uwagi:</label>
          </div>
          <div className="row__col-75">
            <textarea
              id="description"
              name="description"
              rows="4"
              cols="10"
              style={{ height: "150px", width: "250px" }}
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
        </div>
      </div>
      {countersError && (
        <span className="form-container__error-msg">
          Musisz wpisać stan początkowy wybranych liczników
        </span>
      )}
      <div className="form-container__buttons" style={{ marginTop: "50px" }}>
        <button
          onClick={handleConfirm}
          data-name="back"
          style={{ marginRight: "15px" }}
        >
          Powrót
        </button>
        <button onClick={handleConfirm} data-name="next">
          Dalej
        </button>
      </div>
    </div>
  );
};

export default ProductsForRent;
