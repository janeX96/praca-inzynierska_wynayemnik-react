import React from "react";
import { useState } from "react";
import "../styles/App.css";
import Table from "../components/Table/Table";

const LoadData = (props) => {
  const [data, setData] = useState(props.data);

  const columns = React.useMemo(() => props.columns, []);
  const fetchedData = React.useMemo(() => data, []);

  return (
    <>
      {data && (
        <Table
          columns={columns}
          data={fetchedData}
          initialState={props.initialState}
        />
      )}
    </>
  );
};

export default LoadData;
