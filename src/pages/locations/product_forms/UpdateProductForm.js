import "../../../styles/App.scss";
import { useState, useEffect } from "react";
import { owner } from "../../../resources/urls";
import { GET } from "../../../utilities/Request";
import CalculatedProductForm from "./CalculatedProductForm";
import MediaStandardProductForm from "./MediaStandardProductForm";
import MediaQuantityProductForm from "./MediaQuantityProductForm";
import DisposableProductForm from "./DisposableProductForm";
import StateProductForm from "./StateProductForm";
const UpdateProductForm = (props) => {
  const [product, setProduct] = useState({
    netto: false,
    premisesTypes: [],
    price: props.price,
    productName: "",
    quantity: "",
    quantityUnit: "",
    vat: "",
  });
  const getData = () => {
    const url = `${owner.productsForLocation.prefix}${props.locationId}${owner.productsForLocation.productDetails}${props.updateProductId}`;

    GET(url).then((res) => {
      console.log(res);
      setProduct(res);
    });
  };

  useEffect(() => {
    getData();
  }, [props.updateProductId]);

  const renderForm = () => {
    switch (product.productType) {
      case "CALCULATEDFROMFIELD":
        return (
          <CalculatedProductForm
            data={product}
            premisesTypes={props.premisesTypes}
            locationId={props.locationId}
            mediaStandardProducts={props.mediaStandardProducts}
            updateProduct={updateRequest}
          />
        );
        break;
      case "MEDIA":
        if (product.subtypeMedia === "STANDARD") {
          return (
            <MediaStandardProductForm
              data={product}
              premisesTypes={props.premisesTypes}
              locationId={props.locationId}
              mediaStandardProducts={props.mediaStandardProducts}
              updateProduct={updateRequest}
            />
          );
        } else if (product.subtypeMedia === "QUANTITY") {
          return (
            <MediaQuantityProductForm
              data={product}
              premisesTypes={props.premisesTypes}
              locationId={props.locationId}
              mediaStandardProducts={props.mediaStandardProducts}
              updateProduct={updateRequest}
            />
          );
        }
        break;
      case "DISPOSABLE":
        return (
          <DisposableProductForm
            data={product}
            premisesTypes={props.premisesTypes}
            locationId={props.locationId}
            mediaStandardProducts={props.mediaStandardProducts}
            updateProduct={updateRequest}
          />
        );
        break;
      case "STATE":
        return (
          <StateProductForm
            data={product}
            premisesTypes={props.premisesTypes}
            locationId={props.locationId}
            mediaStandardProducts={props.mediaStandardProducts}
            updateProduct={updateRequest}
          />
        );
        break;

      default:
        return null;
    }
  };

  const updateRequest = (obj) => {
    props.updateProduct(obj);
  };

  return <>{renderForm()}</>;
};

export default UpdateProductForm;
