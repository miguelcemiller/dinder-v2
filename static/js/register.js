const data = {};
const imageUploadPlaceholder = document.querySelector(".image-upload-placeholder");
const imageUploadUser = document.querySelector(".image-upload-user");

const loaderContainer = document.querySelector(".loader-container");

const inputBreedLoader = document.querySelector("#input-breed > .text-loader");
const inputCoatColorLoader = document.querySelector("#input-coat-color > .text-loader");
const inputTypeLoader = document.querySelector("#input-type > .text-loader");

const inputBreed = document.querySelector("#input-breed-js");
const inputCoatColor = document.querySelector("#input-coat-color-js");
const inputType = document.querySelector("#input-type-js");

const inputName = document.querySelector("#input-name-js");
const selectGender = document.querySelector("#select-gender-js");
const selectLocation = document.querySelector("#select-location-js");
const selectYear = document.querySelector("#select-year-js");
const selectMonth = document.querySelector("#select-month-js");
const inputUsername = document.querySelector("#input-username-js");
const inputPassword = document.querySelector("#input-password-js");

const registerInputContainerA = document.querySelector(".register-input-container-a");
const registerInputContainerB = document.querySelector(".register-input-container-b");
const registerInputContainerC = document.querySelector(".register-input-container-c");

const registerInputContainerAButton = document.querySelector("#register-input-container-a-button");
const registerInputContainerBButton = document.querySelector("#register-input-container-b-button");
const registerInputContainerCButton = document.querySelector("#register-input-container-c-button");

/* Image upload */
document.querySelector("#image-upload-js").addEventListener("change", function () {
  // hide placeholder
  imageUploadPlaceholder.classList.add("hidden");
  // show image
  imageUploadUser.classList.remove("hidden");

  const file = this.files[0];
  data.image = file;

  const reader = new FileReader();

  if (file.type.match("image.*")) {
    reader.readAsDataURL(file);
  } else {
    // show placeholder
    imageUploadPlaceholder.classList.remove("hidden");
    // hide image
    imageUploadUser.classList.add("hidden");
  }

  reader.onloadend = async function () {
    imageUploadUser.src = reader.result;

    // Show image loader
    loaderContainer.classList.remove("hidden");

    // Breed
    inputBreed.classList.add("hidden");
    inputBreedLoader.classList.remove("hidden");

    let formData = new FormData();
    formData.append("classifier", "breed");
    formData.append("image", data.image);
    formData.append("imageFilename", "");

    // Predict Breed
    let imageFilename = "";
    await fetch("/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        inputBreedLoader.classList.add("hidden");
        inputBreed.setAttribute("value", data.prediction);
        inputBreed.classList.remove("hidden");
        imageFilename = data.imageFilename;
      })
      .catch((error) => {
        console.log(error);
      });

    // Coat Color
    inputCoatColor.classList.add("hidden");
    inputCoatColorLoader.classList.remove("hidden");

    let formData2 = new FormData();
    formData2.append("classifier", "coat_color");
    formData2.append("image", data.image);
    data.imageFilename = imageFilename;
    formData2.append("imageFilename", data.imageFilename);

    // Predict Coat Color
    await fetch("/submit", {
      method: "POST",
      body: formData2,
    })
      .then((response) => response.json())
      .then((data) => {
        inputCoatColorLoader.classList.add("hidden");
        inputCoatColor.setAttribute("value", data.prediction);
        inputCoatColor.classList.remove("hidden");

        textInputValidationA();
      })
      .catch((error) => {
        console.log(error);
      });

    // Type
    inputType.classList.add("hidden");
    inputTypeLoader.classList.remove("hidden");

    let formData3 = new FormData();
    formData3.append("classifier", "type");
    formData3.append("image", data.image);
    data.imageFilename = imageFilename;
    formData3.append("imageFilename", data.imageFilename);

    // Predict Type
    await fetch("/submit", {
      method: "POST",
      body: formData3,
    })
      .then((response) => response.json())
      .then((data) => {
        inputTypeLoader.classList.add("hidden");
        inputType.setAttribute("value", data.prediction);
        inputType.classList.remove("hidden");

        textInputValidationA();
      })
      .catch((error) => {
        console.log(error);
      });
  };
});

// Text Input Validations
const textInputValidationA = () => {
  if (inputBreed.value != "" && inputCoatColor.value != "" && inputType.value != "") {
    registerInputContainerAButton.classList.remove("disabled");
    // stop image loader
    document.querySelector(".loader-container").classList.add("hidden");
  } else {
    registerInputContainerAButton.classList.add("disabled");
  }
};

const textInputValidationB = () => {
  if (inputName.value != "" && selectGender.value != "" && selectLocation.value != "" && selectYear.value != "" && selectMonth.value != "") {
    registerInputContainerBButton.classList.remove("disabled");
  } else {
    registerInputContainerBButton.classList.add("disabled");
  }
};

const textInputValidationC = () => {
  if (inputUsername.value != "" && inputPassword.value != "") {
    registerInputContainerCButton.classList.remove("disabled");
  } else {
    registerInputContainerCButton.classList.add("disabled");
  }
};

// Input Change
function inputChangeB() {
  textInputValidationB();
}
function inputChangeC() {
  textInputValidationC();
}

// Select Change
function selectChange() {
  textInputValidationB();
}

// Next clicks
registerInputContainerAButton.addEventListener("click", () => {
  // store input values
  data.breed = inputBreed.value;
  data.coatColor = inputCoatColor.value;
  data.type = inputType.value;

  // hide register input container a
  registerInputContainerA.classList.add("hidden");
  // show register input container b
  registerInputContainerB.classList.remove("hidden");

  // stop image loader
  document.querySelector(".loader-container").classList.add("hidden");

  console.log("After A:", data);
});

registerInputContainerBButton.addEventListener("click", () => {
  // store input values
  data.name = inputName.value;
  data.gender = selectGender.value;
  data.location = selectLocation.value;
  data.year = selectYear.value;
  data.month = selectMonth.value;

  // hide register input container b
  registerInputContainerB.classList.add("hidden");
  // show register input container c
  registerInputContainerC.classList.remove("hidden");

  console.log("After B:", data);
});

registerInputContainerCButton.addEventListener("click", async () => {
  // store input values
  data.username = inputUsername.value;
  data.password = inputPassword.value;

  // send data to /save
  let formDataSave = new FormData();
  formDataSave.append("username", data.username);
  formDataSave.append("password", data.password);
  formDataSave.append("name", data.name);
  formDataSave.append("breed", data.breed);
  formDataSave.append("coatColor", data.coatColor);
  formDataSave.append("type", data.type);
  formDataSave.append("gender", data.gender);
  formDataSave.append("location", data.location);
  formDataSave.append("year", data.year);
  formDataSave.append("month", data.month);
  formDataSave.append("imageFilename", data.imageFilename);

  await fetch("/save", {
    method: "POST",
    body: formDataSave,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
    });
});

// Trigger click button on Enter
const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("keypress", function (e) {
    const isRegisterInputContainerAButtonDisabled = registerInputContainerAButton.classList.contains("disabled");
    const isRegisterInputContainerBButtonDisabled = registerInputContainerBButton.classList.contains("disabled");
    const isRegisterInputContainerCButtonDisabled = registerInputContainerCButton.classList.contains("disabled");

    const isRegisterInputContainerAHidden = registerInputContainerA.classList.contains("hidden");
    const isRegisterInputContainerBHidden = registerInputContainerB.classList.contains("hidden");
    const isRegisterInputContainerCHidden = registerInputContainerC.classList.contains("hidden");

    if (e.key === "Enter" && !isRegisterInputContainerAButtonDisabled && !isRegisterInputContainerAHidden) {
      registerInputContainerAButton.click();
    } else if (e.key === "Enter" && !isRegisterInputContainerBButtonDisabled && !isRegisterInputContainerBHidden) {
      registerInputContainerBButton.click();
    } else if (e.key === "Enter" && !isRegisterInputContainerCButtonDisabled && !isRegisterInputContainerCHidden) {
      registerInputContainerCButton.click();
    }
  });
});
