import { useEffect, useState } from "react";
import keycloak from "../../auth/keycloak";
import LoadData from "../LoadData";
import "../../styles/App.scss";
import LocationDetails from "./LocationDetails";
import { GET } from "../../utilities/Request";
import { owner, admin } from "../../resources/urls";
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator as Tabulator } from "react-tabulator";
import { toast } from "react-toastify";

const Owner_Locations = (props) => {
  const [locations, setLocations] = useState([]);
  const [chosenId, setChosenId] = useState("");

  const getData = async () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.locations
        : props.roles[0] === "admin"
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
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAction = (id) => {
    setChosenId(id);
    getData();
  };
  var actionButton = function (cell, formatterParams, onRendered) {
    //plain text value

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
        columns={columns}
        data={locations}
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

  // hiddenColumns: "address.addressId"
  const initialState = { pageSize: 5, hiddenColumns: "locationId" };

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
            <h1 className="content-container__title">Moje Lokacje</h1>
            <div className="table-container">
              {locations.length > 0 ? renderTable() : "brak"}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Owner_Locations;
