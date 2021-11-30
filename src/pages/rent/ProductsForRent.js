import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";

const ProductsForRent = (props) => {
  const [productsForType, setProductsForType] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

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
          setProductsForType({
            res,
          });
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
          setAllProducts({
            res,
          });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  useEffect(() => {
    getAllProducts();
    getProductsForType(props.premisesType);
    console.log(props.premisesType);
  }, []);

  return <div>produkty dla {props.locationId}</div>;
};

export default ProductsForRent;
