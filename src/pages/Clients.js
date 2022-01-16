import { useState, useEffect } from "react";
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator as Tabulator } from "react-tabulator";
import { GET } from "../utilities/Request";
import { owner } from "../resources/urls";

const Clients = () => {
  const [clients, setClients] = useState();

  const getData = () => {
    GET(owner.clientsAll).then((res) => {
      setClients(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Id",
      field: "userAccountId",
      visible: false,
    },

    {
      title: "Nazwisko",
      field: "lastName",
      headerFilter: "input",
    },
    {
      title: "Imię",
      field: "firstName",
      headerFilter: "input",
    },
    {
      title: "Email",
      field: "email",
      headerFilter: "input",
    },
    {
      title: "Nr telefonu",
      field: "phoneNumber",
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        columns={columns}
        data={clients}
        options={{
          movableColumns: true,
          movableRows: true,
          pagination: true,
          paginationSize: 7,
          setFilter: true,
        }}
        layout="fitColumns"
        responsiveLayout="hide"
        tooltips="true"
        addRowPos="top"
        history="true"
        movableColumns="true"
        resizableRows="true"
        initialSort={[
          //set the initial sort order of the data
          { column: "lastName", dir: "asc" },
        ]}
      />
    );
  };

  return (
    <div className="content-container">
      <h1 className="content-container__title">Moi najemcy</h1>
      <div className="table-container">{renderTable()}</div>
    </div>
  );
};

export default Clients;