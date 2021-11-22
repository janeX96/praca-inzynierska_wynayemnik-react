import { useState } from "react";

const NewLocation = () => {
  const [location, setLocation] = useState({
    address: {
      city: "",
      postCode: "",
      street: "",
      streetNumber: "",
    },
    locationName: "",
  });

  return <div>...</div>;
};

export default NewLocation;
