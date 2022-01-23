import React, { useState, useEffect } from "react";
import "../../styles/App.scss";
import PremisesDetails from "./PremisesDetails/PremisesDetails";
import { Link } from "react-router-dom";
import { BsPlusSquareFill } from "react-icons/bs";
import { owner, admin } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import { toast } from "react-toastify";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";

const Premises = (props) => {
  const [state, setState] = useState({
    data: [],
  });

  const [chosenId, setChosenId] = useState(-1);

  const getData = () => {
    const urlByRole = (() => {
      const firstRole = props.roles[0];

      switch (firstRole) {
        case "owner":
          return owner.premises;
        case "admin":
          return admin.premises;
        default:
          return "";
      }
    })();

    GET(urlByRole).then((res) => {
      if (res !== null) {
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
          return prem;
        });
        setState({ ...state, data: res });
      } else {
        toast.error("Błąd połączenia z serwerem...");
      }
    });
  };

  //wybierając dany lokal zaamiętuję jego id, jeśi id jest >=0
  // to wyświetlam info, jeśli nie to pokazuje liste lokali
  const handleAction = (id) => {
    setChosenId(id);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getData();
    }
    return () => {
      mounted = false;
    };
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
      visible: false,
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
        className="custom-tabulator"
        columns={columns}
        data={state.data}
        options={{
          debugInvalidOptions: false,
          movableColumns: true,
          movableRows: true,
          pagination: "local",
          paginationSizeSelector: [5, 10, 20, 50],
          paginationSize: 5,
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
            {props.roles[0] === "owner" && (
              <h1 className="content-container__title">Moje lokale</h1>
            )}
            {props.roles[0] === "admin" && (
              <h1 className="content-container__title">Lokale</h1>
            )}

            <div className="table-container">
              <Link to="/owner-locations">
                <h2
                  className="details-container__history"
                  style={{ fontSize: "24px" }}
                >
                  Pokaż wszystkie lokacje
                </h2>
              </Link>
              {props.roles[0] === "owner" && (
                <div>
                  <Link to="/owner-premises-new">
                    <div className="icon-container">
                      <BsPlusSquareFill className="icon-container__new-icon" />
                    </div>
                  </Link>
                </div>
              )}

              {state.data.length > 0 ? renderTable() : "brak"}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Premises;
