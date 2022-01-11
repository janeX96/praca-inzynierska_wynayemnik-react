import React, { useState, useEffect } from "react";
import LoadData from "../LoadData";
import "../../styles/App.scss";
import PremisesDetails from "./PremisesDetails/PremisesDetails";
import { Link } from "react-router-dom";
import { BsPlusSquareFill } from "react-icons/bs";
import { owner, admin } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import { toast } from "react-toastify";
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator as Tabulator } from "react-tabulator";

const Premises = (props) => {
  const [state, setState] = useState({
    data: [],
  });

  const [chosenId, setChosenId] = useState(-1);

  const getData = async () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.premises
        : props.roles[0] === "admin"
        ? admin.premises
        : "";

    GET(urlByRole).then((res) => {
      res.map((prem) => {
        if (prem.state === "HIRED") {
          prem.state = "wynajęty";
        } else {
          prem.state = "wolny";
        }

        if (prem.furnished) {
          prem.furnished = "tak";
        } else {
          prem.furnished = "nie";
        }
      });
      setState({ ...state, data: res });
    });
  };

  //wybierając dany lokal zaamiętuję jego id, jeśi id jest >=0
  // to wyświetlam info, jeśli nie to pokazuje liste lokali
  const handleAction = (id) => {
    setChosenId(id);
  };

  useEffect(() => {
    getData();
  }, [chosenId]);

  const deleteShowMessage = (res) => {
    handleAction(-1);
    res
      ? toast.success("Lokal został usunięty")
      : toast.error("Nie udało się usunąć lokalu...");
    // console.log("Przeladowanie: ", chosenId);
    getData();
  };

  var actionButton = function (cell, formatterParams, onRendered) {
    //plain text value

    return `<button>Szczegóły</button>`;
  };

  const columns = [
    {
      title: "Id",
      field: "premisesId",
    },
    {
      title: "Adres",
      field: "location.locationName",
      headerFilter: "input",
    },
    {
      title: "Numer",
      field: "premisesNumber",
    },
    {
      title: "m2",
      field: "area",
    },
    {
      title: "Poziom",
      field: "premisesLevel",
    },
    {
      title: "Stan",
      field: "state",
      editor: "select",
      headerFilter: true,
      headerFilterParams: {
        values: { wynajęty: "wynajęty", wolny: "wolny", "": "" },
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
      formatter: actionButton,
      width: 150,
      align: "center",
      cellClick: function (e, cell) {
        handleAction(cell.getRow().getData().premisesId);
      },
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        columns={columns}
        data={state.data}
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

  // var table = new Tabulator("#example-table", {
  //   data: state.data, //load row data from array
  //   layout: "fitColumns", //fit columns to width of table
  //   responsiveLayout: "hide", //hide columns that dont fit on the table
  //   tooltips: true, //show tool tips on cells
  //   addRowPos: "top", //when adding a new row, add it to the top of the table
  //   history: true, //allow undo and redo actions on the table
  //   pagination: "local", //paginate the data
  //   paginationSize: 7, //allow 7 rows per page of data
  //   movableColumns: true, //allow column order to be changed
  //   resizableRows: true, //allow row order to be changed
  //   initialSort: [
  //     //set the initial sort order of the data
  //     { column: "name", dir: "asc" },
  //   ],
  //   columns: [
  //     {
  //       title: "Id",
  //       field: "premisesId",
  //     },
  //     {
  //       title: "Adres",
  //       field: "location.locationName",
  //     },
  //     {
  //       title: "Numer",
  //       field: "premisesNumber",
  //     },
  //     {
  //       title: "m2",
  //       field: "area",
  //     },
  //     {
  //       title: "Poziom",
  //       field: "premisesLevel",
  //     },
  //     {
  //       title: "Stan",
  //       field: "state",
  //     },
  //     {
  //       title: "Rodzaj",
  //       field: "premisesType.type",
  //     },
  //     {
  //       formatter: actionButton,
  //       width: 100,
  //       align: "center",
  //       cellClick: function (e, cell) {
  //         handleAction(cell.getRow().getData().premisesId);
  //       },
  //     },
  //   ],
  // });

  return (
    <>
      <div className="content-container">
        {chosenId >= 0 ? (
          <PremisesDetails
            key={chosenId}
            action={handleAction}
            deleteShowMessage={(res) => deleteShowMessage(res)}
            reloadData={() => getData()}
            premisesId={chosenId}
            roles={props.roles}
          />
        ) : (
          <>
            <h1 className="content-container__title">Moje lokale</h1>
            <div className="table-container">
              {props.roles[0] === "owner" && (
                <div>
                  <Link to="/owner-premises-new">
                    <div className="icon-container">
                      <BsPlusSquareFill className="icon-container__new-icon" />
                    </div>
                  </Link>
                </div>
              )}

              {state.data.length > 0
                ? // <LoadData
                  //   data={state.data}
                  //   columns={columns}
                  //   initialState={initialState}
                  // />
                  // <ReactTabulator
                  //   columns={columns}
                  //   data={state.data}
                  //   options={{ movableColumns: true, movableRows: true }}
                  // />

                  renderTable()
                : "brak"}
            </div>
          </>
        )}
      </div>
      {/* <ReactTabulator
        columns={columns}
        data={state.data}
        options={{ movableColumns: true, movableRows: true }}
      /> */}
    </>
  );
};

export default Premises;
