import { useState, useEffect } from "react";
import { owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";

const Rents = () => {
  const [rents, setRents] = useState();

  const getData = () => {
    GET(owner.rents).then((res) => {
      setRents(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      Header: "Id",
      accessor: "premisesId",
    },
    {
      Header: "Adres",
      accessor: "location.locationName",
    },
    {
      Header: "Numer",
      accessor: "premisesNumber",
    },
    {
      Header: "m2",
      accessor: "area",
    },
    {
      Header: "Poziom",
      accessor: "premisesLevel",
    },
    {
      Header: "Stan",
      accessor: "state",
    },
    {
      Header: "Rodzaj",
      accessor: "premisesType.type",
    },
    {
      Header: "Akcja",
      accessor: "action",
      Cell: ({ cell }) => (
        <button
          className="content-container__button"
          value={cell.row.values.actions}
          onClick={() => handleAction(cell.row.values.premisesId)}
        >
          Szczegóły
        </button>
      ),
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "premisesId" };

  return (
    <div className="content-container">
      <h1 className="content-container__title">Moje lokale</h1>
      {rents.length > 0 ? (
        <LoadData data={rents} columns={columns} initialState={initialState} />
      ) : (
        "brak"
      )}
    </div>
  );
};

export default Rents;
