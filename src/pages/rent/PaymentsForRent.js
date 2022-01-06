import { useState, useEffect } from "react";
import { BsPlusSquareFill } from "react-icons/bs";
import { admin, client, owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";
import PaymentForm from "./PaymentForm";

const PaymentsForRent = (props) => {
  const [payments, setPayments] = useState(props.payments);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleReturn = () => {
    setShowPaymentForm(false);
  };

  const columns = [
    {
      Header: "Id",
      accessor: "paymentId",
    },
    {
      Header: "numberPayment",
      accessor: "numberPayment",
    },
    {
      Header: "status",
      accessor: "ISSUED",
    },
    {
      Header: "paymentType",
      accessor: "paymentType.name",
    },
    {
      Header: "startDate",
      accessor: "startDate",
    },
    {
      Header: "paymentDate",
      accessor: "paymentDate",
    },
    {
      Header: "paidDate",
      accessor: "paidDate",
    },
    {
      Header: "income",
      accessor: "income",
    },
    {
      Header: "Akcja",
      accessor: "action",
      //   Cell: ({ cell }) => (
      //     <button
      //       className="content-container__button"
      //       value={cell.row.values.actions}
      //       onClick={() => handleAction(cell.row.values.premisesId)}
      //     >
      //       Szczegóły
      //     </button>
      //   ),
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "paymentId" };

  return (
    <>
      {showPaymentForm ? (
        <PaymentForm handleReturn={handleReturn} rentId={props.rentId} />
      ) : (
        <>
          <h1 className="content-container__title">Płatności</h1>
          <div>
            <div className="icon-container">
              <BsPlusSquareFill
                className="icon-container__new-icon"
                onClick={() => setShowPaymentForm(true)}
              />
            </div>
          </div>
          {props.payments.length > 0 ? (
            <LoadData
              data={payments}
              columns={columns}
              initialState={initialState}
            />
          ) : (
            "brak"
          )}
          <div>
            <button
              className="content-container__button"
              onClick={() => props.handleReturn()}
            >
              Powrót
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentsForRent;
