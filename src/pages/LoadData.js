import React from "react";
import "../styles/App.scss";
import Table from "../components/Table/Table";

const LoadData = (props) => {
  return (
    <>
      {props.data && (
        <Table
          columns={props.columns}
          data={props.data}
          initialState={props.initialState}
        />
      )}
    </>
  );
};

export default LoadData;
