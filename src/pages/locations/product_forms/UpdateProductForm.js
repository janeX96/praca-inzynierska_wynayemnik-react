import "../../../styles/App.scss";
import { useState, useEffect } from "react";
import { general, owner } from "../../../resources/urls";
import { GET } from "../../../utilities/Request";
import CalculatedProductForm from "./CalculatedProductForm";
import MediaStandardProductForm from "./MediaStandardProductForm";
import MediaQuantityProductForm from "./MediaQuantityProductForm";
import DisposableProductForm from "./DisposableProductForm";
import StateProductForm from "./StateProductForm";
import { useCallback } from "react";

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
  const [premisesTypesForProduct, setpremisesTypesForProduct] = useState();

  const getData = useCallback(() => {
    const url = `${owner.productsForLocation.prefix}${props.locationId}${owner.productsForLocation.productDetails}${props.updateProductId}`;

    GET(url).then((res) => {
      setProduct(res);
    });
  }, [props.locationId, props.updateProductId]);

  const getPremisesTypesForProduct = async (id) => {
    let url = general.productsForLocation.premisesTypesForProductPrefix;

    return await GET(`${url}${id}`).then((res) => {
      let typesArr = [];
      res.map((type) => {
        typesArr.push(type.type);
        return type;
      });

      setpremisesTypesForProduct(typesArr);
    });
  };

  useEffect(() => {
    getData();
    getPremisesTypesForProduct(props.updateProductId);
  }, [props.updateProductId, getData]);

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
            premisesTypesForProduct={premisesTypesForProduct}
          />
        );

      case "MEDIA":
        if (product.subtypeMedia === "STANDARD") {
          return (
            <MediaStandardProductForm
              data={product}
              premisesTypes={props.premisesTypes}
              locationId={props.locationId}
              mediaStandardProducts={props.mediaStandardProducts}
              updateProduct={updateRequest}
              premisesTypesForProduct={premisesTypesForProduct}
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
              premisesTypesForProduct={premisesTypesForProduct}
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
            premisesTypesForProduct={premisesTypesForProduct}
          />
        );

      case "STATE":
        return (
          <StateProductForm
            data={product}
            premisesTypes={props.premisesTypes}
            locationId={props.locationId}
            mediaStandardProducts={props.mediaStandardProducts}
            updateProduct={updateRequest}
            premisesTypesForProduct={premisesTypesForProduct}
          />
        );

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
