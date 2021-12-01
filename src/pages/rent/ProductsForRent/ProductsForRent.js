import { useState, useEffect } from "react";
import "./ProductsForRent.css";
import keycloak from "../../../auth/keycloak";

const ProductsForRent = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

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
            // console.log("all:", r);
            // console.log("sel: ", selected);
            selectAvailableProducts(allProds, selected);
          });
      });
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

  return (
    <div className="attach-products">
      <div className="products-list">
        <h3>Wybrane</h3>
        <ul>
          {selectedProducts.map((product) => (
            <li
              key={product.productId}
              onClick={handleClick}
              data-id={product.productId}
              data-name="selected"
            >
              {product.productName}
            </li>
          ))}
        </ul>
      </div>
      <div className="products-list">
        <h3>Dostępne</h3>
        <ul>
          {availableProducts.map((product) => (
            <li
              key={product.productId}
              onClick={handleClick}
              data-id={product.productId}
              data-name="available"
            >
              {product.productName}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => {
          setLoaded(!loaded);
        }}
      >
        Dalej
      </button>
    </div>
  );
};

export default ProductsForRent;
