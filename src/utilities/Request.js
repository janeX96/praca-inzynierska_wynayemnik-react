import keycloak from "../auth/keycloak";

const requestOptions = (method) => {
  return {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: " Bearer " + keycloak.token,
    },
  };
};

const GET = async (url) => {
  let response = {};
  await fetch(url, {
    headers: { Authorization: " Bearer " + keycloak.token },
  })
    .then((res) => {
      if (res.ok) {
        response = res.json();
      }
    })
    .catch((err) => {
      console.error("Request error: ", err);
    });

  return response;
};

const POST = () => {};

const PUT = () => {};

const PATCH = async (url) => {
  let response = {};
  await fetch(url, requestOptions("PATCH"))
    .then((res) => {
      if (res.ok) {
        response = true;
      }
    })
    .catch((err) => {
      console.error("Request error: ", err);
    });

  return response;
};

export { GET, POST, PUT, PATCH };
