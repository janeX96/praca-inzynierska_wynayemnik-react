import keycloak from "../auth/keycloak";

const requestOptions = (method, obj = null) => {
  if (obj != null) {
    return {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
