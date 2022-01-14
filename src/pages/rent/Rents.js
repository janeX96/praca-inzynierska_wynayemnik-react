import { useState, useEffect } from "react";
import { owner, admin, client } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import RentDetails from "./RentDetails";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";
import { MdPayment } from "react-icons/md";
import { toast } from "react-toastify";

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
            <div className="table-container">{renderTable()}</div>
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
