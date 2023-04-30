// Gets a playerid from localstorage if they exist
function getPlayer () {
  if (JSON.parse(localStorage.getItem('playerId'))) return JSON.parse(localStorage.getItem('playerId'));
  return null;
}

export default getPlayer;
