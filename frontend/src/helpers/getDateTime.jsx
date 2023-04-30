export default getDateTime;

// Gets the time or date that the quiz was created
// displays under a quiz in dashboard
function getDateTime (createdAt) {
  const date1 = new Date(Date.parse(createdAt));
  const timediff = (Date.now() - Date.parse(createdAt)) / (1000 * 60)
  const hours = ~~(timediff / 60)
  const minutes = ~~(timediff % 60)
  const date = String(date1.getUTCDate()) + '/' + String(date1.getUTCMonth() + 1) + '/' + String(date1.getUTCFullYear())
  return (timediff <= 24 * 60) ? (String(hours) + ' hours ' + String(minutes) + ' minutes ago') : (date)
}
