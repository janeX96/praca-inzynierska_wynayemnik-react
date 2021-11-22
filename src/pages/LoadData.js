import React from "react";
import { useState, useEffect } from "react";
import "../styles/App.css";
import Table from "../components/Table/Table";

const LoadData = (props) => {
  const [premises, setPremises] = useState(props.data);

  //   const getData = async () => {
  //       console.log("Premises: ", this.props.data)
  //       setPremises(this.props.data)
  //     };

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "premisesId", // accessor is the "key" in the data
      },
      {
        Header: "Adres",
        accessor: "location.locationName", // accessor is the "key" in the data
      },
      {
        Header: "Numer",
        accessor: "premisesNumber", // accessor is the "key" in the data
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
            className="action-button"
            value={cell.row.values.actions}
            onClick={
              () => props.action(cell.row.values.premisesId) //parseInt(cell.row.values.premisesNumber, 10)
            }
          >
            Szczegóły
          </button>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    // console.log("props.data: ", props.data);
    setPremises(props.data);
  }, []);

  const data = React.useMemo(() => premises, []);

  const initialState = { pageSize: 5, hiddenColumns: "premisesId" };

  return (
    <div>
      {premises && (
        <Table columns={columns} data={data} initialState={initialState} />
      )}
    </div>
  );
};

export default LoadData;
