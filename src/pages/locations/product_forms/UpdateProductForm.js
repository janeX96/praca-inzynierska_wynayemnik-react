import "../../../styles/App.scss";
import { useState, useEffect } from "react";
import { owner } from "../../../resources/urls";
import { GET } from "../../../utilities/Request";
const UpdateProductForm = (props) => {
  const [product, setProduct] = useState();
  const getData = () => {
    const url = `${owner.productsForLocation.prefix}${props.id}${owner.productsForLocation.productDetails}${props.updateProductId}`;

    GET(url).then((res) => {
      setProduct(res);
    });
  };

  return (
    <>
      <div>...</div>
    </>
  );
};

export default UpdateProductForm;
