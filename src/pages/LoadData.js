import React from "react";
import { useState, useEffect } from "react";
import "../styles/App.css";
import Table from "../components/Table";

const LoadData = (props) => {
  const [premises, setPremises] = useState(props.data);

  //   const getData = async () => {
  //       console.log("Premises: ", this.props.data)
  //       setPremises(this.props.data)
  //     };

  const columns = React.useMemo(
    () => [
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
          <button value={cell.row.values.action} onClick={props.action}>
            Szczegóły
          </button>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    console.log("props.data: ", props.data);
    setPremises(props.data);
    console.log("premises: ", premises);
  }, []);

  const data = React.useMemo(() => premises, []);

  return <div>{premises && <Table columns={columns} data={data} />}</div>;
};

export default LoadData;
