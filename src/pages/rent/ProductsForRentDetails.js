import { useState, useEffect } from "react";
import { owner, admin, general } from "../../resources/urls";
import { GET } from "../../utilities/Request";
const ProductsForRentDetails = (props) => {
  const [products, setProducts] = useState();

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
      }
    );
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <ul>
        {products !== undefined
          ? products.map((prod) => (
              <li key={prod.productId}>{prod.productName}???</li>
            ))
          : ""}
      </ul>
      <button
        className="content-container__button"
        onClick={() => props.handleReturn()}
      >
        Powrót
      </button>
    </>
  );
};

export default ProductsForRentDetails;
