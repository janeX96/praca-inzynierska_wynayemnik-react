import React from "react";
import "../styles/App.css";
import Table from "../components/Table/Table";

const LoadData = (props) => {
  return (
    <div>
      {props.data && (
        <Table
          columns={props.columns}
          data={props.data}
          initialState={props.initialState}
        />
      )}
    </div>
  );
};

export default LoadData;
