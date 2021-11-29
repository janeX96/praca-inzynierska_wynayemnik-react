import "../../styles/App.css";
import { useState } from "react";

const UserFormForRent = (props) => {
  const [userEmail, setUserEmail] = useState("");

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  //validation TODO

  //check email on database, if not found then form TODO

  const handleSubmit = (e) => {
    e.preventDefault();
    props.setUser(userEmail);
    props.stepDone(0);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const val = e.target.value;
    setUserEmail(val);
  };

  return (
    <>
      <div>
        <h2>Dane użytkownika</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email najemcy:
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
            />
          </label>
          <button type="submit">Dalej</button>
        </form>
      </div>
    </>
  );
};

export default UserFormForRent;
