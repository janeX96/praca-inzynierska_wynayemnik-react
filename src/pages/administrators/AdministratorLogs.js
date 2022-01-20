import React, { useEffect, useState } from "react";
import { GET, PATCH } from "../../utilities/Request";
import { owner } from "../../resources/urls";
import { ReactTabulator as Tabulator } from "react-tabulator";

const AdministratorLogs = (props) => {
  const [administrator, setAdministrator] = useState([]);
  const [premises, setPremises] = useState([]);

  const [fromDate, setFromDate] = useState([]);
  const [toDate, setToDate] = useState([]);

  const [errors, setErrors] = useState({
    endDateError: false,
    startDateError: false,
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    GET(`${owner.administrators.logs}${props.administratorId}`)
      .then((data) => {
        data.map((e) => {
          e.actionType =
            e.actionType === "INSERT"
              ? "Dodanie"
              : e.actionType === "DELETE"
              ? "Usunięcie"
              : "Modyfikacja";
          const startDate = e.createdDate;
          e.createdDate = `${startDate.split("T")[0]} ${
            startDate.split("T")[1].split(".")[0]
          }`;
          return data;
        });

        setAdministrator(data);
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });

    GET(`${owner.administrators.ownAndNot}${props.administratorId}`)
      .then((data) => {
        console.log(`${owner.administrators.logs}${props.administratorId}`);
        console.log(data);
        data.map(
          (e) =>
            (e.administratorActive = e.administratorActive
              ? "Aktywny"
              : "Nieaktywny")
        );
        setPremises(data);
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  const columns = [
    {
      title: "Miejsce zmian",
      field: "entityName",
    },
    {
      title: "Opis",
      field: "changeDescription",
    },
    {
      title: "Rodzaj",
      field: "actionType",
      headerFilter: "input",
    },
    {
      title: "Data utworzenia",
      field: "createdDate",
    },
  ];

  const handleAction = (id) => {
    PATCH(`${owner.administrators.set}${props.administratorEmail}/${id}`)
      .then(() => {
        console.log(
          `${owner.administrators.set}${props.administratorEmail}/${id}`
        );
        getData();
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };

  const columnsPremises = [
    {
      title: "Id",
      field: "premises.premisesId",
    },
    {
      title: "Adres",
      field: "premises.location.locationName",
      headerFilter: "input",
    },
    {
      title: "Numer",
      field: "premises.premisesNumber",
    },
    {
      title: "m2",
      field: "premises.area",
    },
    {
      title: "Poziom",
      field: "premises.premisesLevel",
    },
    {
      title: "Ustaw uprawnienie",
      field: "administratorActive",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value === "Aktywny") {
          return (
            "<span style='color:green; font-weight:bold;'>" + value + "</span>"
          );
        } else
          return (
            "<span style='color:red; font-weight:bold;'>" + value + "</span>"
          );
      },
      cellClick: function (e, cell) {
        handleAction(cell.getRow().getData().premises.premisesId);
      },
    },
  ];

  const renderTable = () => {
    return (
      <Tabulator
        columns={columns}
        data={administrator}
        options={{
          movableColumns: true,
          movableRows: true,
          pagination: "local",
          paginationSizeSelector: [5, 10, 20, 50],
          paginationSize: 5,
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
          { column: "createdDate", dir: "asc" },
        ]}
      />
    );
  };

  const renderTableSet = () => {
    return (
      <Tabulator
        columns={columnsPremises}
        data={premises}
        options={{
          movableColumns: true,
          movableRows: true,
          pagination: "local",
          paginationSizeSelector: [5, 10, 20, 50],
          paginationSize: 5,
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
          { column: "premises.location.locationName", dir: "asc" },
        ]}
      />
    );
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "startDate") setFromDate(value);
    else setToDate(value);
  };

  const formValidation = () => {
    let endDate = false;
    let startDate = false;

    if (fromDate.length > 0 && fromDate < toDate) {
      startDate = true;
    }

    if (toDate.length > 0 && fromDate < toDate) {
      endDate = true;
    }

    const correct = endDate && startDate;

    return {
      correct,
      endDate,
      startDate,
    };
  };

  const handleCancel = (e) => {
    setToDate("");
    setFromDate("null");
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";

    setErrors({
      endDateError: false,
      startDateError: false,
    });

    GET(`${owner.administrators.logs}${props.administratorId}`)
      .then((data) => {
        data.map((e) => {
          e.actionType =
            e.actionType === "INSERT"
              ? "Dodanie"
              : e.actionType === "DELETE"
              ? "Usunięcie"
              : "Modyfikacja";
          const startDate = e.createdDate;
          e.createdDate = `${startDate.split("T")[0]} ${
            startDate.split("T")[1].split(".")[0]
          }`;
          return data;
        });

        setAdministrator(data);
      })
      .catch((err) => {
        console.log("Error Reading data " + err);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = formValidation();

    if (validation.correct) {
      setErrors({
        endDateError: false,
        startDateError: false,
      });
      GET(
        `${owner.administrators.logs}${props.administratorId}?fromDate=${fromDate}&toDate=${toDate}`
      )
        .then((data) => {
          data.map((e) => {
            e.actionType =
              e.actionType === "INSERT"
                ? "Dodanie"
                : e.actionType === "DELETE"
                ? "Usunięcie"
                : "Modyfikacja";
            const startDate = e.createdDate;
            e.createdDate = `${startDate.split("T")[0]} ${
              startDate.split("T")[1].split(".")[0]
            }`;
            return data;
          });

          setAdministrator(data);
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    } else {
      setErrors({
        endDateError: !validation.endDate,
        startDateError: !validation.startDate,
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h1 className="content-container__title">Moi administratorzy</h1>

      <div className="table-container">
        <h1>
          Administrator:{" "}
          <b className="details-container__field-special">
            {props.administartorFirstName} {props.administartorLastName}
          </b>
        </h1>
        <h3>Historia zmian</h3>
        <div className="form-container" style={{ display: "contents" }}>
          <form>
            <div
              className="form-container__row"
              style={{ marginBottom: "10px" }}
            >
              <div className="row__col-25">
                <label htmlFor="startDate">Od: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  style={{ resize: "none" }}
                  value={fromDate}
                  onChange={handleChange}
                />
                {errors.startDateError && (
                  <span className="form-container__error-msg">
                    {
                      "Wybierz właściwą datę (data rozpoczęcia musi poprzedzać datę zakończenia)"
                    }
                  </span>
                )}
              </div>
            </div>
            <div
              className="form-container__row"
              style={{ marginBottom: "10px" }}
            >
              <div className="row__col-25">
                <label htmlFor="endDate">Do: </label>
              </div>
              <div className="row__col-75">
                <input
                  className="form-container__input"
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  style={{ resize: "none" }}
                  value={toDate}
                  onChange={handleChange}
                />
                {errors.endDateError && (
                  <span className="form-container__error-msg">
                    {
                      "Wybierz właściwą datę (data zakończenia musi być późniejsza niż data rozpoczęcia)"
                    }
                  </span>
                )}
              </div>
            </div>
          </form>
          <div
            className="form-container__buttons"
            style={{ marginBottom: "18px", marginTop: "-10px" }}
          >
            <button onClick={handleSubmit}>Wyszukaj</button>
            <button onClick={handleCancel}>Resetuj daty</button>
          </div>
        </div>
        {renderTable()}
      </div>

      <div className="table-container" style={{ marginTop: "50px" }}>
        <h3>Uprawnienia</h3>
        {renderTableSet()}

        <div className="details-container__buttons">
          <button
            className="details-container__button--return"
            onClick={() => props.action(-1)}
          >
            Powrót
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdministratorLogs;
