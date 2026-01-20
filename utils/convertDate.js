// Function to convert date string to day of the week
function convertDateToDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}
export { convertDateToDay };
