import React, {useState, useEffect} from "react";
import keycloak from "../../auth/keycloak";
import "../../styles/App.scss";
import "./UserProfile.css";
import UserProfileEdit from "./UserProfileEdit";

import {GET} from "../../utilities/Request"
import {user as userReq} from "../../resources/urls"

const UserProfile = () => {
    const [user, setUser] = useState({
        data: [],
    });

    const [edit, setEdit] = useState(false);

    const getData = () => {
        GET(userReq.info)
            .then((data) => {
                console.log("blablabla", data)
                setUser({data});
            }).catch((err) => {
            console.log("Error Reading data " + err);
        })
    };

    useEffect(() => {
        getData();
    }, [edit]);

    return (
        <div className="content-container">
            <h1 className="content-container__title">Dane użytkownika</h1>
            {edit ? <UserProfileEdit
                data = {user.data}
                back = {() => setEdit(false)}
            /> : (
                <div className="details-container">
                    <ul>
                        <li>Imię: {user.data.firstName}</li>
                        <li>Nazwisko: {user.data.lastName}</li>
                        <li>Email: {user.data.email}</li>
                        <li>Numer tel: {user.data.phoneNumber}</li>
                        <li>
                            Rodzaj użytkownika:{" "}
                            {user.data.isNaturalPerson ? "osoba fizyczna" : "firma"}
                        </li>
                        <li>Fakturownia: {user.data.isFakturownia ? "tak" : "nie"}</li>
                    </ul>
                    <button onClick={() => setEdit(true)} className="details-container__button">Edytuj dane</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
