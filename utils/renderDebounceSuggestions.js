let suggestions = document.querySelector(".dropdown-suggestions");

const renderDebounceSuggestions = (data) => {
  // If no data found, show error message
  if (data.length === 0) {
    suggestions.textContent = "City not found";
    throw new Error("City not found..");
  }

  // Store latitude and longitude in localStorage
  localStorage.setItem("latitude", data[0].lat);
  localStorage.setItem("longitude", data[0].lon);
  suggestions.innerHTML = "";

  // Create document fragment to hold suggestions
  let fragment = document.createDocumentFragment();
  return (
    data.forEach((location) => {
      let suggestion = document.createElement("span");
      ((suggestion.className = "suggestions"),
        (suggestion.textContent =
          location.name + ", " + location.region + ", " + location.country),
        fragment.appendChild(suggestion));
    }),
    suggestions.appendChild(fragment)
  );
};

export default renderDebounceSuggestions;
