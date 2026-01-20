let errorCardWrapper = document.querySelector(".error-card-wrapper");
let errorCard = document.querySelector(".error-card");

function displayError(error) {
  ((errorCardWrapper.style.display = "flex"),
    (errorCard.textContent = error),
    setTimeout(() => {
      errorCardWrapper.style.display = "none";
    }, 3000));
}
export default displayError;
