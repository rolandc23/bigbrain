// Gets an email from localstorage if it exists
function getEmail () {
  if (localStorage.getItem('email')) return localStorage.getItem('email');
  return null;
}

export default getEmail;
