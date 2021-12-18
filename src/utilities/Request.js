import keycloak from "../auth/keycloak";

const token = keycloak.token;

const requestOptions = (method, obj = null) => {
  if (obj != null) {
    console.log("Token: ", token);
    return {
      method: method,
      headers: {
        // Accept: "application/json",
        // "Content-Type": "application/json",
        Authorization: " Bearer " + keycloak.token,
      },
      body: obj,
    };
  } else {
    return {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: " Bearer " + keycloak.token,
      },
    };
  }
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

const POST = async (url, obj) => {
  // console.log("Token: ", token);
  let response = {};
  const opt = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Authorization: " Bearer " + keycloak.token,
    },
    body: obj,
  };
  console.log("optionsssssss: ", opt);
  await fetch(url, opt)
    .then((res) => {
      console.log(res);

      res.json().then((res) => {
        response = res;
        return response;
      });
    })
    .catch((err) => {
      console.error("Request error: ", err);
    });

  return response;
};

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
