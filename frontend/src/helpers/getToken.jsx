// Gets a token from localstorage if it exists
function getToken () {
  if (JSON.parse(localStorage.getItem('token'))) return JSON.parse(localStorage.getItem('token')).token;
  return null;
}

export default getToken;
