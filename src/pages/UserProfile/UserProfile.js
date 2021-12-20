import React, {useState, useEffect} from "react";
import keycloak from "../../auth/keycloak";
import "../../styles/App.scss";
import "./UserProfile.css";
import UserProfileEdit from "./UserProfileEdit";

const UserProfile = () => {
    const [user, setUser] = useState({
        data: [],
    });

    const [edit, setEdit] = useState(false);

    const getResources = async () => {
        const response = await fetch("/resources.json");
        const resources = await response.json();

        return resources;
    };

    const getData = () => {
        getResources().then((res) => {
            //pobranie danych z wyciągniętego adresu url
            fetch(res.urls.user, {
                headers: {Authorization: " Bearer " + keycloak.token},
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setUser({data});
                })
                .catch((err) => {
                    console.log("Error Reading data " + err);
                });
        });
    };

    // useEffect(() => {
    //     getData();
    // }, []);

    useEffect(() => {
        getData();
    }, [edit]);

    return (
        <div className="content-container">
            <h1 className="content-title">Dane użytkownika</h1>
            {edit ? <UserProfileEdit
                data = {user.data}
                back = {() => setEdit(false)}
            /> : (
                <div className="details">
                    <ul>
                        <li>Imię: {user.data.firstName}</li>
                        <li>Nazwisko: {user.data.lastName}</li>
                        <li>Email: {user.data.email}</li>
                        <li>Numer tel: {user.data.phoneNumber}</li>
                        <li>NIP: {user.data.NIP}</li>
                        <li>
                            Rodzaj użytkownika:{" "}
                            {user.data.isNaturalPerson ? "osoba fizyczna" : "firma"}
                        </li>
                        <li>Fakturownia: {user.data.isFakturownia ? "tak" : "nie"}</li>
                    </ul>
                    <button onClick={() => setEdit(true)} className="edit-btn">Edytuj dane</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
