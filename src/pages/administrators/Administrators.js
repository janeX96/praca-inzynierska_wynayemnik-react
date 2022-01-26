import React, { useEffect, useState } from "react";
import { GET } from "../../utilities/Request";
import { owner } from "../../resources/urls";
import { ReactTabulator as Tabulator } from "react-tabulator";
import { BsPlusSquareFill } from "react-icons/bs";
import AdministratorLogs from "./AdministratorLogs";
import AdministratorAdd from "./AdministratorAdd";
import { toast } from "react-toastify";

const Administrators = (props) => {
  const [administrators, setAdministrators] = useState([]);
  const [chosenId, setChosenId] = useState(-1);
  const [chosenEmail, setChosenEmail] = useState("");
  const [chosenFirstName, setChosenFirstName] = useState();
  const [chosenLastName, setChosenLastName] = useState();
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
    let mounted = true;
    if (mounted) {
      getData();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handleAction = (id, email, firstName, lastName) => {
    setChosenId(id);
    setChosenEmail(email);
    setChosenFirstName(firstName);
    setChosenLastName(lastName);
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
      visible: false,
    },
    {
      title: "Nazwisko",
      field: "lastName",
    },
    {
      title: "Imie",
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
          cell.getRow().getData().email,
          cell.getRow().getData().firstName,
          cell.getRow().getData().lastName
        );
      },
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        className="custom-tabulator"
        columns={columns}
        data={administrators}
        options={{
          debugInvalidOptions: false,
          movableColumns: true,
          movableRows: true,
          pagination: "local",
          paginationSizeSelector: [5, 10, 20, 50],
          paginationSize: 5,
          setFilter: true,
          langs: {
            default: {
              pagination: {
                page_size: "Wyniki na stronie",
                first: "Pierwsza",
                first_title: "Pierwsza",
                last: "Ostatnia",
                last_title: "Ostatnia",
                prev: "Poprzednia",
                prev_title: "Poprzednia",
                next: "Następna",
                next_title: "Następna",
              },
            },
          },
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
            className="custom-tabulator"
            key={chosenId}
            action={handleAction}
            administratorId={chosenId}
            administratorEmail={chosenEmail}
            administartorFirstName={chosenFirstName}
            administartorLastName={chosenLastName}
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
              {administrators.length > 0 ? renderTable() : <h1>Brak</h1>}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Administrators;
