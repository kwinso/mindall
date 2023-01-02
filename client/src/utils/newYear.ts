export function checkNewYearTime() {
  const date = new Date();
  const month = date.getMonth()
  const day = date.getDate();

  // New year time is between Dec 15 and Jan 10
  return (month == 11 && day > 15) || (month == 0 && day < 10)
}
