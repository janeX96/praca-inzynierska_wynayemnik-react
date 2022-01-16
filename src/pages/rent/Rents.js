import { useState, useEffect } from "react";
import { owner, admin, client } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import RentDetails from "./RentDetails";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Rents = (props) => {
  const [rents, setRents] = useState(props.data);
  const [chosenId, setChosenId] = useState(-1);
  const getData = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.all
        : props.roles[0] === "admin"
        ? admin.rent.all
        : props.roles[0] === "client"
        ? client.rent.all
        : "";
    GET(urlByRole).then((res) => {
      if (res !== null) {
        res.map((rent) => {
          //format dates
          const startDate = rent.startDate;
          const endDate = rent.endDate;
          rent.startDate = startDate.split("T")[0];
          rent.endDate = endDate.split("T")[0];
        });
        setRents(res);
      } else {
        toast.error("Błąd połączenia z serwerem...");
      }
    });
  };

  useEffect(() => {
    if (props.data === undefined) {
      getData();
    }
  }, []);

  const handleAction = (id) => {
    setChosenId(id);
  };

  const handleReturn = () => {
    setChosenId(-1);
    getData();
  };
  var actionButton = function (cell, formatterParams, onRendered) {
    //plain text value

    return `<button>Szczegóły</button>`;
  };

  // var styleMutator = function (value, data, type, params, component) {
  //   //value - original value of the cell
  //   //data - the data for the row
  //   //type - the type of mutation occurring  (data|edit)
  //   //params - the mutatorParams object from the column definition
  //   //component - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is the column component for the column

  //   return value
  //     ? "details-container__field-avb"
  //     : "details-container__field-hired"; //return the new value for the cell data.
  // };

  // var customMutator = function (value, data, type, params, component) {
  //   //value - original value of the cell
  //   //data - the data for the row
  //   //type - the type of mutation occurring  (data|edit)
  //   //params - the mutatorParams object from the column definition
  //   //component - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is the column component for the column

  //   return value ? "wystawiona" : "niewystawiona"; //return the new value for the cell data.
  // };

  var cellClassFormatter = function (cell, formatterParams) {
    //cell - the cell component
    //formatterParams - parameters set for the column
    cell.getElement().style.fontWeight = "bold";
    if (cell.getValue()) {
      cell.getElement().classList.add("details-container__field-avb");
    } else {
      cell.getElement().classList.add("details-container__field-hired");
    }

    return cell.getValue() ? "wystawiona" : "niewystawiona"; //return the contents of the cell;
  };

  const columns = [
    {
      title: "Id",
      field: "rentId",
      visible: false,
    },
    {
      title: "Adres",
      field: "premises.location.locationName",
      headerFilter: "input",
    },
    {
      title: "Stan",
      field: "state",
      editor: "select",
      headerFilter: true,
      headerFilterParams: {
        values: {
          CANCELLED: "anulowane",
          IN_PROGRESS: "trwające",
          PLANNED: "zaplanowane",
        },
      },
    },
    {
      title: "Rodzaj",
      field: "premisesType.type",
      editor: "select",
      headerFilter: true,
      headerFilterParams: {
        values: { mieszkaniowy: "Mieszkaniowy", usługowy: "Usługowy", "": "" },
      },
    },
    {
      title: "Początek",
      field: "startDate",
    },
    {
      title: "Koniec",
      field: "endDate",
    },
    {
      title: "Miesięczna płatność",
      field: "paymentThisMonth",
      formatter: cellClassFormatter,
      // formatter: function (cell, formatterParams, onRendered) {
      //   //cell - the cell component
      //   //formatterParams - parameters set for the column
      //   //onRendered - function to call when the formatter has been rendered

      //   return cell.getValue() ? "wystawiona" : "niewystawiona"; //return the contents of the cell;
      // },
    },
    {
      formatter: actionButton,
      width: 150,
      align: "center",
      cellClick: function (e, cell) {
        handleAction(cell.getRow().getData().rentId);
      },
    },
  ];
  const renderTable = () => {
    return (
      <Tabulator
        columns={columns}
        data={rents}
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

  const renderData = () => {
    return (
      <>
        {chosenId > 0 ? (
          <RentDetails
            rentId={chosenId}
            roles={props.roles}
            handleReturn={handleReturn}
          />
        ) : (
          <>
            {(props.roles[0] === "owner" || props.roles[0] === "client") && (
              <h1 className="content-container__title">Moje wynajmy</h1>
            )}
            {props.roles[0] === "admin" && (
              <h1 className="content-container__title">Wynajmy</h1>
            )}

            <div className="table-container">
              <Link to="/owner-clients">
                <h2
                  className="details-container__history"
                  style={{ fontSize: "24px" }}
                >
                  Pokaż moich najemców
                </h2>
              </Link>
              {renderTable()}
            </div>
            <div className="contant-btns">
              {props.data !== undefined ? (
                <button
                  className="content-container__button"
                  onClick={props.handleReturn}
                >
                  Powrót
                </button>
              ) : (
                ""
              )}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {props.data === undefined ? (
        <div className="content-container">{renderData()}</div>
      ) : (
        <>{renderData()}</>
      )}
    </>
  );
};

export default Rents;
