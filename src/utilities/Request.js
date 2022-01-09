import keycloak from "../auth/keycloak";

//chose if we pass some body
const requestOptions = (method, obj = null) => {
  return {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: " Bearer " + keycloak.token,
    },
    body: obj,
  };
};

const GET = async (url) => {
  return await fetch(url, {
    headers: { Authorization: " Bearer " + keycloak.token },
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error("Request error: ", err);
      return null;
    });
};

//add noAuth=true if user has no account (for example register method)
const POST = async (url, obj, noAuth = false) => {
  let requestOpt = {};
  if (noAuth) {
    requestOpt = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: obj,
    };
  } else {
    requestOpt = requestOptions("POST", obj);
  }

  return await fetch(url, requestOpt)
    .then((res) => {
      // console.log("Przekazuję: ", res);
      return res;
    })
    .catch((err) => {
      console.error("Request error: ", err);
    });
};

const PUT = async (url, obj) => {
  const requestOpt = requestOptions("PUT", obj);
  return await fetch(url, requestOpt)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error("Request error: ", err);
    });
};

const PATCH = async (url) => {
  console.log("Usuwam");
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

const DELETE = async (url) => {
  let response = {};
  await fetch(url, requestOptions("DELETE"))
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

export { GET, POST, PUT, PATCH, DELETE };
