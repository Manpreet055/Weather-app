import displayError from "../utils/errorHandler.js";
import api from "../utils/api.js";
let suggestions = document.querySelector(".dropdown-suggestions");

async function getCityName(event) {
  try {
    let response = await api.get(`/search.json?q=${event}`);
    if (!(response.status === 200)) throw new Error("Something went wrong..");
    let data = response.data;

    // If no data found, show error message
    if (0 === data.length)
      throw (
        (suggestions.textContent = "City not found"),
        new Error("City not found..")
      );

    localStorage.setItem("latitude", data[0].lat);
    localStorage.setItem("longitude", data[0].lon);
    suggestions.innerHTML = "";

    // Create document fragment to hold suggestions
    let fragment = document.createDocumentFragment();
    return (
      data.forEach((e) => {
        let t = document.createElement("span");
        ((t.className = "suggestions"),
          (t.textContent = e.name + ", " + e.region + ", " + e.country),
          fragment.appendChild(t));
      }),
      suggestions.appendChild(fragment),
      data
    );
  } catch (error) {
    if (
      (console.error(error.message),
      !(
        error instanceof TypeError &&
        "failed to fetch" === error.message.toLowerCase()
      ))
    )
      return (console.error(error.message), null);
    displayError("Unable to connect, please check your internet connection..");
  }
}

export default getCityName;
