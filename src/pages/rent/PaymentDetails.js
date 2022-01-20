import { useState, useEffect } from "react";
import { admin, general, owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";

const PaymentDetails = (props) => {
  const [payment, setPayment] = useState();

  const getData = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.paymentDetails
        : props.roles[0] === "admin"
        ? admin.rent.paymentDetails
        : "";

    GET(
      `${urlByRole}${props.rentId}${general.rent.paymentDetailsSuffix}${props.paymentId}`
    ).then((res) => {
      setPayment(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Id",
      field: "positionOnPaymentId",
      visible: false,
    },
    {
      title: "Nazwa",
      field: "name",
    },
    {
      title: "Cena",
      field: "mediaRent.price",
    },
    {
      title: "Ilość",
      field: "mediaRent.quantity",
    },
    {
      title: "Vat",
      field: "mediaRent.vat",
    },
    {
      title: "Wart. brutto",
      field: "mediaRent.bruttoPrice",
    },
  ];

  const renderTable = (data) => {
    return (
      <Tabulator
        columns={columns}
        data={data}
        options={{
          movableColumns: true,
          movableRows: true,
          pagination: true,
          paginationSize: 5,
          setFilter: true,
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
          { column: "name", dir: "asc" },
        ]}
      />
    );
  };

  const renderData = () => {
    return (
      <>
        <ul>
          <li>
            Numer płatności:
            <b>{payment.numberPayment}</b>
          </li>
          <li>
            Status:
            <b>{payment.status}</b>
          </li>
          <li>
            Rodzaj:
            <b>{payment.paymentType.name}</b>
          </li>
          <li>
            Data wystawienia:
            <b>{payment.startDate}</b>
          </li>
          <li>
            Termin płatności:
            <b>{payment.paymentDate}</b>
          </li>
          <li>
            Zapłacono:
            <b>{payment.paidDate !== null ? payment.paidDate : "---"}</b>
          </li>
          <li>
            Przychodząca:
            <b>{payment.income ? "tak" : "nie"}</b>
          </li>
        </ul>
        <b>Pozycje:</b>
        {payment.positionOnPaymentSet.map((position) => (
          <ul>
            <li>{position.name}</li>

            {/* {renderTable(position)}*/}
          </ul>
        ))}
      </>
    );
  };

  return (
    <>
      <h1 className="content-container__title">Szczegóły płatności</h1>
      <div className="details-container">
        {payment !== undefined && renderData()}
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

export default PaymentDetails;
