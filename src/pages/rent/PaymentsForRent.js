import { useState } from "react";
import { BsPlusSquareFill } from "react-icons/bs";
import PaymentForm from "./PaymentForm";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";
import PaymentDetails from "./PaymentDetails";

const PaymentsForRent = (props) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [chosenId, setChosenId] = useState(-1);
  const handleReturn = () => {
    setShowPaymentForm(false);
    setChosenId(-1);
    props.reloadPayments();
  };

  const payments = props.payments !== undefined && props.payments;

  var cellStateValueFormatter = function (cell, formatterParams) {
    switch (cell.getValue()) {
      case "ISSUED":
        return "Wystawiona";

      case "CANCELLED":
        return "Anulowana";

      case "PAID":
        return "Zapłacona";

      default:
        return "???";
    }
  };

  var actionButton = function (cell, formatterParams, onRendered) {
    return `<button>Szczegóły</button>`;
  };
  const columns = [
    {
      title: "Id",
      field: "paymentId",
      visible: false,
    },
    {
      title: "Numer płatności",
      field: "numberPayment",
    },
    {
      title: "Status",
      field: "status",
      formatter: cellStateValueFormatter,
      editor: "select",
      headerFilter: true,
      headerFilterParams: {
        values: {
          Wystawiona: "Wystawiona",
          Anulowana: "Anulowana",
          Zapłacona: "Zapłacona",
        },
      },
    },
    {
      title: "Rodzaj",
      field: "paymentType.name",
    },
    {
      title: "Początek",
      field: "startDate",
    },
    {
      title: "Termin płatności",
      field: "paymentDate",
    },
    {
      title: "Data wpłaty",
      field: "paidDate",
    },
    {
      title: "Przychodowa",
      field: "income",
    },
    {
      formatter: actionButton,
      width: 150,
      align: "center",
      cellClick: function (e, cell) {
        setChosenId(cell.getRow().getData().paymentId);
      },
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        className="custom-tabulator"
        columns={columns}
        data={payments}
        options={{
          debugInvalidOptions: false,
          movableColumns: true,
          movableRows: true,
          pagination: "local",
          paginationSizeSelector: [5, 10, 20, 50],
          paginationSize: 5,
          setFilter: true,
          langs: {
            default: {
              pagination: {
                page_size: "Wyniki na stronie",
                first: "Pierwsza",
                first_title: "Pierwsza",
                last: "Ostatnia",
                last_title: "Ostatnia",
                prev: "Poprzednia",
                prev_title: "Poprzednia",
                next: "Następna",
                next_title: "Następna",
              },
            },
          },
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
          { column: "startDate", dir: "asc" },
        ]}
      />
    );
  };

  return (
    <>
      {chosenId > 0 ? (
        <PaymentDetails
          roles={props.roles}
          rentId={props.rentId}
          paymentId={chosenId}
          handleReturn={handleReturn}
        />
      ) : showPaymentForm ? (
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
              {(props.roles[0] === "owner" ||
                props.roles[0] === "administrator") && (
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
            props.payments.length > 0 ? (
              renderTable()
            ) : (
              <h1>Brak</h1>
            )}
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
