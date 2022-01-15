import React, { useEffect, useState } from "react";
import { GET } from "../../utilities/Request";
import { owner } from "../../resources/urls";
import { ReactTabulator as Tabulator } from "react-tabulator";
import { Link } from "react-router-dom";
import { BsPlusSquareFill } from "react-icons/bs";
import AdministratorLogs from "./AdministratorLogs";
import AdministratorAdd from "./AdministratorAdd";
import { toast } from "react-toastify";

const Administrators = (props) => {
  const [administrators, setAdministrators] = useState([]);
  const [chosenId, setChosenId] = useState(-1);
  const [chosenEmail, setChosenEmail] = useState("");
  const [showNewAdministrator, setShowNewAdministrator] = useState(false);

  const getData = async () => {
    GET(owner.administrators.all)
      .then((data) => {
        if (data !== null) {
          setAdministrators(data);
        } else {
          toast.error("Błąd połączenia z serwerem...");
        }
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAction = (id, email) => {
    setChosenId(id);
    setChosenEmail(email);
    getData();
  };

  const handleReturn = () => {
    setChosenId(-1);
    setChosenEmail("");
    setShowNewAdministrator(false);
    getData();
  };

  var actionButton = function (cell, formatterParams, onRendered) {
    //plain text value
    return `<button>Szczegóły</button>`;
  };

  const columns = [
    {
      title: "Id",
      field: "userAccountId",
    },
    {
      title: "Imie",
      field: "lastName",
    },
    {
      title: "Nazwisko",
      field: "firstName",
    },
    {
      title: "Email",
      field: "email",
      headerFilter: "input",
    },
    {
      formatter: actionButton,
      width: 150,
      align: "center",
      cellClick: function (e, cell) {
        handleAction(
          cell.getRow().getData().userAccountId,
          cell.getRow().getData().email
        );
      },
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        columns={columns}
        data={administrators}
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
    <>
      <div className="content-container">
        {chosenId > 0 ? (
          <AdministratorLogs
            key={chosenId}
            action={handleAction}
            administratorId={chosenId}
            administratorEmail={chosenEmail}
            roles={props.roles}
          />
        ) : showNewAdministrator ? (
          <AdministratorAdd return={handleReturn} />
        ) : (
          <>
            <h1 className="content-container__title">Moi administratorzy</h1>
            <div className="table-container">
              <div>
                <div className="icon-container">
                  <BsPlusSquareFill
                    className="icon-container__new-icon"
                    onClick={() => setShowNewAdministrator(true)}
                  />
                </div>
              </div>
              {administrators.length > 0 ? renderTable() : "brak"}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Administrators;
