// Input Validation
const inputUsername = document.querySelector("#input-username-js");
const inputPassword = document.querySelector("#input-password-js");

const loginInputContainerButton = document.querySelector("#login-input-container-button");

const textInputValidation = () => {
  if (inputUsername.value != "" && inputPassword.value != "") {
    loginInputContainerButton.classList.remove("disabled");
  } else {
    loginInputContainerButton.classList.add("disabled");
  }
};

function inputChange() {
  textInputValidation();
}

const errorContainer = document.querySelector(".error-container");

// Login click
loginInputContainerButton.addEventListener("click", async () => {
  const username = inputUsername.value;
  const password = inputPassword.value;

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  await fetch("/login", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isValid == false) {
        errorContainer.classList.remove("hidden");
      } else {
        window.location.href = `/home/${data.username}`;
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// Trigger 'Login' button on Enter
const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("keypress", function (e) {
    let isButtonDisabled = loginInputContainerButton.classList.contains("disabled");
    if (e.key === "Enter" && !isButtonDisabled) {
      loginInputContainerButton.click();
    }
  });
});
