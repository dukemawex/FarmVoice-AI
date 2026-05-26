function startOfDayISOString(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function todayDateString(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

module.exports = { startOfDayISOString, todayDateString };