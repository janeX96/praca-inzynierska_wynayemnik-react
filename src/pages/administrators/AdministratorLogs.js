import React, {useEffect, useState} from 'react';
import {GET, PATCH} from "../../utilities/Request";
import {owner} from "../../resources/urls";
import {ReactTabulator as Tabulator} from "react-tabulator";
import {Link} from "react-router-dom";
import {BsPlusSquareFill} from "react-icons/bs";

const AdministratorLogs = (props) => {

    const [administrator, setAdministrator] = useState([]);
    const [premises, setPremises] = useState([]);


    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        GET(`${owner.administrators.logs}${props.administratorId}`)
            .then((data) => {
                data.map(e => {
                    e.actionType = e.actionType === "INSERT" ? "Dodanie" : e.actionType === "DELETE" ? "Usunięcie" : "Modyfikacja"
                    const startDate = e.createdDate;
                    e.createdDate = `${startDate.split("T")[0]} ${startDate.split("T")[1].split(".")[0]}`;
                })

                setAdministrator(data);
            })
            .catch((err) => {
                console.log("Error Reading data " + err);
            });

        GET(`${owner.administrators.ownAndNot}${props.administratorId}`)
            .then((data) => {
                console.log(`${owner.administrators.logs}${props.administratorId}`);
                console.log(data);
                data.map(e => e.administratorActive = e.administratorActive ? "Aktywny" : "Nieaktywny")
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
            field: "createdDate"
        }
    ];

    const handleAction = (id) => {
        PATCH(`${owner.administrators.set}${props.administratorEmail}/${id}`)
            .then(() => {
                console.log(`${owner.administrators.set}${props.administratorEmail}/${id}`)
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
            formatter:function(cell, formatterParams) {
                var value = cell.getValue();
                if (value === "Aktywny") {
                    return "<span style='color:green; font-weight:bold;'>" + value + "</span>";
                }else return "<span style='color:red; font-weight:bold;'>" + value + "</span>";

            },
            cellClick: function (e, cell) {
                handleAction(cell.getRow().getData().premises.premisesId);
            }
        }
    ];

    const renderTable = () => {
        return (
            <Tabulator
                columns={columns}
                data={administrator}
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
                    {column: "createdDate", dir: "asc"},
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
                    {column: "premises.location.locationName", dir: "asc"},
                ]}
            />
        );
    };

    return (
        <div>
            <h1 className="content-container__title">Moi administratorzy</h1>
            <div className="table-container">
                {renderTable()}
            </div>

            <div className="table-container" style={{marginTop: "50px"}}>
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
