import { useState, useEffect } from "react";
import { owner, admin, client } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";
import RentDetails from "./RentDetails";

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
      setRents(res);
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
          onClick={() => handleAction(cell.row.values.rentId)}
        >
          Szczegóły
        </button>
      ),
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "rentId" };

  const renderTable = () => {
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
            <h1 className="content-container__title">Wynajmy</h1>
            <LoadData
              data={rents}
              columns={columns}
              initialState={initialState}
            />
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
        <div className="content-container">{renderTable()}</div>
      ) : (
        <>{renderTable()}</>
      )}
    </>
  );
};

export default Rents;
