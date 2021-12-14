import { useState, useEffect } from "react";
import "./ProductsForRent.css";
import keycloak from "../../../auth/keycloak";

const ProductsForRent = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(props.selectedSave);
  const [description, setDescription] = useState(props.default.description);
  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  //defaut selected
  const getProductsForType = async (type) => {
    // let selectedProds = [];
    const response = await getResources()
      .then((res) => {
        const url =
          res.urls.owner.products.prefix +
          props.locationId +
          "/products?productType=" +
          type;
        const prods = fetch(url, {
          headers: { Authorization: " Bearer " + keycloak.token },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setSelectedProducts(res);
            // selectedProds = res;
            return res;
          })
          .catch((err) => {
            console.log("Error Reading data " + err);
          });
        return prods;
      })
      .then((res) => {
        return res;
      });

    return response;
  };

  const getAllProducts = async () => {
    const response = await getResources().then((res) => {
      const url =
        res.urls.owner.products.prefix + props.locationId + "/productGroupType";
      const allProds = fetch(url, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setAllProducts(res);
          return res;
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
      return allProds;
    });

    return response;
  };

  useEffect(() => {
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
  }, []);

  const selectAvailableProducts = (allProds, selectedProds) => {
    let products = [];

    allProds.map((product) => {
      let exists = false;
      selectedProds.map((selected) => {
        if (selected.productId === product.productId) {
          exists = true;
        }
      });
      if (!exists) {
        products.push(product);
      }
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
                {product.productName}
                {product.productType === "MEDIA" &&
                product.subtypeMedia === "STANDARD"
                  ? ", stan: " + product.counter
                  : ""}
                {product.productType === "MEDIA" &&
                product.subtypeMedia === "STANDARD" ? (
                  <input
                    type="number"
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
                  ? ", stan: " + product.counter
                  : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <label htmlFor="description">Uwagi:</label>
      <textarea
        id="description"
        name="description"
        rows="4"
        cols="10"
        style={{ height: "150px", width: "250px" }}
        value={description}
        onChange={handleDescriptionChange}
      ></textarea>
      <div style={{ marginTop: "50px" }}>
        <button
          onClick={handleConfirm}
          data-name="back"
          className="action-button"
          style={{ marginRight: "15px" }}
        >
          Powrót
        </button>
        <button
          onClick={handleConfirm}
          data-name="next"
          className="action-button"
        >
          Dalej
        </button>
      </div>
    </div>
  );
};

export default ProductsForRent;
