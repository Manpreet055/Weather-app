import displayError from "../utils/errorHandler.js";
import api from "./api.js";
import renderDebounceSuggestions from "../utils/renderDebounceSuggestions.js";

async function getCityName(event) {
  try {
    let response = await api.get(`/search.json?q=${event}`);
    if (!(response.status === 200)) throw new Error("Something went wrong.."); // Check for successful response
    return renderDebounceSuggestions(response.data);
  } catch (error) {
    console.error(error.message);
    if (
      (!error) instanceof TypeError &&
      error.message.toLowerCase() === "failed to fetch"
    )
      displayError(
        "Unable to connect, please check your internet connection..",
      );
  }
}

export default getCityName;
