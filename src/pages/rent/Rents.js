import { useState, useEffect } from "react";
import { owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";

const Rents = (props) => {
  const [rents, setRents] = useState(props.data);

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
          // onClick={() => handleAction(cell.row.values.premisesId)}
        >
          Szczegóły
        </button>
      ),
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "premisesId" };

  return (
    <>
      <h1 className="content-container__title">Wynajęcia</h1>
      {rents.length > 0 ? (
        <LoadData data={rents} columns={columns} initialState={initialState} />
      ) : (
        "brak"
      )}
      <div className="contant-btns">
        <button
          className="content-container__button"
          onClick={props.handleReturn}
        >
          Powrót
        </button>
      </div>
    </>
  );
};

export default Rents;
