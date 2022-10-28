/* Like is clicked */
const likeContainer = document.querySelector(".like-container");
const optionsContainer = document.querySelector(".options-container");
const offspringsMessageContainer = document.querySelector(
  ".offsprings-message-container"
);

likeContainer.addEventListener("click", () => {
  /* Hide Options Container */
  optionsContainer.classList.add("hidden");
  /* Show Offsprings Message */
  offspringsMessageContainer.classList.remove("hidden");
});
