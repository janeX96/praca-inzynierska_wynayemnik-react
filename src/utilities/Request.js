import keycloak from "../auth/keycloak";

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

export { GET, POST, PUT };
