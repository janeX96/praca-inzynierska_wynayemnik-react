import { useEffect, useState } from "react";
import keycloak from "../../auth/keycloak";
import LoadData from "../LoadData";
import "../../styles/App.scss";
import LocationDetails from "./LocationDetails";
import { GET } from "../../utilities/Request";
import { owner } from "../../resources/urls";

const Owner_Locations = () => {
  const [locations, setLocations] = useState([]);
  const [chosenId, setChosenId] = useState("");

  const getData = async () => {
    GET(owner.locations)
      .then((data) => {
        setLocations(data);
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
  };

  const columns = [
    {
      Header: "Id",
      accessor: "locationId",
    },
    {
      Header: "Nazwa",
      accessor: "locationName",
    },
    {
      Header: "Miasto",
      accessor: "address.city",
    },
    {
      Header: "Kod Pocztowy",
      accessor: "address.postCode",
    },
    {
      Header: "Ulica",
      accessor: "address.street",
    },
    {
      Header: "Numer",
      accessor: "address.streetNumber",
    },
    {
      Header: "Akcja",
      accessor: "action",
      Cell: ({ cell }) => (
        <button
          className="content-container__button"
          value={cell.row.values.actions}
          onClick={() => handleAction(cell.row.values.locationId)}
        >
          Szczegóły
        </button>
      ),
    },
  ];
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
          />
        ) : (
          <>
            <h1 className="content-container__title">Moje Lokacje</h1>
            {locations.length > 0 ? (
              <LoadData
                data={locations}
                columns={columns}
                initialState={initialState}
              />
            ) : (
              "brak"
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Owner_Locations;
