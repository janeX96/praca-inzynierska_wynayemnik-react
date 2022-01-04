import { useState, useEffect } from "react";
import { owner, admin, client } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";

const Rents = (props) => {
  const [rents, setRents] = useState(props.data);

  // const createColumns = () => {};

  const getData = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.rents
        : props.roles[0] === "admin"
        ? owner.rent.rents
        : "";
    GET(urlByRole).then((res) => {
      setRents(res);
    });
  };

  useEffect(() => {
    if (props.data === undefined) {
      getData();
    }
  }, []);

  const columns = [
    {
      Header: "Id",
      accessor: "rentId",
    },
    {
      Header: "Adres",
      accessor: "premises.location.locationName",
    },
    {
      Header: "Numer",
      accessor: "premises.premisesNumber",
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
      Header: "Początek",
      accessor: "startDate",
    },
    {
      Header: "Koniec",
      accessor: "endDate",
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
  const initialState = { pageSize: 5, hiddenColumns: "rentId" };

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
