import { useState, useEffect } from "react";
import { BsPlusSquareFill } from "react-icons/bs";
import { admin, client, general, owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";
import PaymentForm from "./PaymentForm";
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator as Tabulator } from "react-tabulator";

const PaymentsForRent = (props) => {
  const [payments, setPayments] = useState(
    props.payments !== undefined && props.payments
  );
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleReturn = () => {
    setShowPaymentForm(false);
    props.reloadPayments();
  };
  var actionButton = function (cell, formatterParams, onRendered) {
    //plain text value

    return `<button>Szczegóły</button>`;
  };
  const columns = [
    {
      title: "Id",
      field: "paymentId",
    },
    {
      title: "numberPayment",
      field: "numberPayment",
    },
    {
      title: "status",
      field: "status",
    },
    {
      title: "paymentType",
      field: "paymentType.name",
    },
    {
      title: "startDate",
      field: "startDate",
    },
    {
      title: "paymentDate",
      field: "paymentDate",
    },
    {
      title: "paidDate",
      field: "paidDate",
    },
    {
      title: "income",
      field: "income",
    },
    {
      formatter: actionButton,
      width: 150,
      align: "center",
      cellClick: function (e, cell) {
        // handleAction(cell.getRow().getData().premisesId);
      },
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        columns={columns}
        data={payments}
        options={{
          movableColumns: true,
          movableRows: true,
          pagination: true,
          paginationSize: 7,
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
          { column: "location.locationName", dir: "asc" },
        ]}
      />
    );
  };

  return (
    <>
      {showPaymentForm ? (
        <PaymentForm
          handleReturn={handleReturn}
          rentId={props.rentId}
          roles={props.roles}
        />
      ) : (
        <>
          <h1 className="content-container__title">Płatności</h1>
          <div className="table-container">
            <div>
              {(props.roles[0] === "owner" || props.roles[0] === "admin") && (
                <div className="icon-container">
                  <BsPlusSquareFill
                    className="icon-container__new-icon"
                    onClick={() => setShowPaymentForm(true)}
                  />
                </div>
              )}
            </div>
            {props.payments !== null &&
            props.payments !== undefined &&
            props.payments.length > 0
              ? renderTable()
              : "brak"}
            <div>
              <button
                className="content-container__button"
                onClick={() => props.handleReturn()}
              >
                Powrót
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentsForRent;
