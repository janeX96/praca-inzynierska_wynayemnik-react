import { useCallback, useEffect, useState } from "react";
import "../../styles/App.scss";
import LocationDetails from "./LocationDetails";
import { GET } from "../../utilities/Request";
import { owner, admin } from "../../resources/urls";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";
import { toast } from "react-toastify";

const Locations = (props) => {
  const [locations, setLocations] = useState([]);
  const [chosenId, setChosenId] = useState("");

  const getData = useCallback(async () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.locations
        : props.roles[0] === "administrator"
        ? admin.locations
        : "";
    GET(urlByRole)
      .then((data) => {
        if (data !== null) {
          setLocations(data);
        } else {
          toast.error("Błąd połączenia z serwerem...");
        }
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  }, [props.roles]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getData();
    }
    return () => {
      mounted = false;
    };
  }, [getData]);

  const handleAction = (id) => {
    setChosenId(id);
    getData();
  };

  var actionButton = function (cell, formatterParams, onRendered) {
    return `<button>Szczegóły</button>`;
  };

  const columns = [
    {
      title: "Id",
      field: "locationId",
      visible: false,
    },
    {
      title: "Nazwa",
      field: "locationName",
      headerFilter: "input",
    },
    {
      title: "Miasto",
      field: "address.city",
      headerFilter: "input",
    },
    {
      title: "Kod Pocztowy",
      field: "address.postCode",
    },
    {
      title: "Ulica",
      field: "address.street",
    },
    {
      Hetitleader: "Numer",
      field: "address.streetNumber",
    },
    {
      formatter: actionButton,
      width: 150,
      align: "center",
      cellClick: function (e, cell) {
        handleAction(cell.getRow().getData().locationId);
      },
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        className="custom-tabulator"
        columns={columns}
        data={locations}
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
        initialSort={[{ column: "locationName", dir: "asc" }]}
      />
    );
  };

  return (
    <>
      <div className="content-container">
        {chosenId > 0 ? (
          <LocationDetails
            key={chosenId}
            id={chosenId}
            handleAction={handleAction}
            roles={props.roles}
          />
        ) : (
          <>
            {props.roles[0] === "owner" && (
              <h1 className="content-container__title">Moje Lokacje</h1>
            )}
            {props.roles[0] === "administrator" && (
              <h1 className="content-container__title">Lokacje</h1>
            )}
            <div className="table-container">
              {locations.length > 0 ? renderTable() : <h1>Brak</h1>}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Locations;
