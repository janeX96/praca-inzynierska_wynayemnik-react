import { useState, useEffect } from "react";
import "./ProductsForRent.css";
import keycloak from "../../../auth/keycloak";

const ProductsForRent = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getProductsForType = (type) => {
    getResources().then((res) => {
      const url =
        res.urls.owner.products.prefix +
        props.locationId +
        "/products?productType=" +
        type;
      fetch(url, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setSelectedProducts(res);
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  const getAllProducts = () => {
    getResources().then((res) => {
      const url =
        res.urls.owner.products.prefix +
        props.locationId +
        "/products?productType=";
      fetch(url, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setAllProducts(res);
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  useEffect(() => {
    getAllProducts();
    getProductsForType(props.premisesType);
  }, []);

  useEffect(() => {
    selectProductsByDefault();
  }, []);

  const selectProductsByDefault = () => {
    let products = [];

    allProducts.map((product) => {
      let exists = false;
      selectedProducts.map((selected) => {
        if (selected.productId === product.productId) {
          console.log("prodid:", product.productId);
          console.log("selid:", selected.productId);
          exists = true;
        }
      });
      if (!exists) {
        products.push(product);
      }
    });
    console.log(products);
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
      <button>Dalej</button>
    </div>
  );
};

export default ProductsForRent;
