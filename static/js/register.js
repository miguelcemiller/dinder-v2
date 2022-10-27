const data = {};

/* Image upload */
document
  .querySelector("#image-upload-js")
  .addEventListener("change", function () {
    // hide placeholder
    let imageUploadPlaceholder = document.querySelector(
      ".image-upload-placeholder"
    );
    imageUploadPlaceholder.classList.add("hidden");
    // show image
    let imageUploadUser = document.querySelector(".image-upload-user");
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

    reader.onloadend = function () {
      imageUploadUser.src = reader.result;

      // Show loader
      let loaderContainer = document.querySelector(".loader-container");
      loaderContainer.classList.remove("hidden");

      let inputLoaderContainers = document.querySelectorAll(
        ".input-loader-container"
      );

      inputLoaderContainers.forEach((node) => {
        const textInput = node.children[0];
        const textLoader = node.children[1];

        const textInputPlaceholder = textInput.getAttribute("placeholder");

        // start breed prediction
        if (textInputPlaceholder == "Breed") {
          // show progress loader
          textLoader.classList.remove("hidden");
          // hide textInput
          textInput.classList.add("hidden");

          setTimeout(() => {
            console.log("the breed is Chow Chow");

            // hide progress loader
            textLoader.classList.add("hidden");
            // show textInput
            textInput.setAttribute("value", "Chow Chow");
            textInput.classList.remove("hidden");

            data.breed = "Chow Chow";
          }, 3000);
        }

        console.log(data);
      });
    };
  });
