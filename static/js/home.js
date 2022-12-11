const user = document.querySelector(".container").getAttribute("user");

let currIndex = 0;
let maxIndex = 0;
let dogsData = null;

let breedFilter = "Any Breed";
let locationFilter = "Any Location";

let dogsClickedList = [];

let userData = [];

const carouselContainer = document.querySelector(".carousel-container");

// Document loaded
document.addEventListener("DOMContentLoaded", async () => {
  // GET userData ['username', 'breed', etc...]
  await fetch(`/user-data/${user}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      userData = data;
      console.log("userData: ", userData);
    });

  // GET dogsClickedList ['chamcham', 'jemjem']
  await fetch(`/dog-clicked/${user}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      dogsClickedList = data;
      console.log("dogsClickedList: ", dogsClickedList);
    });

  // GET dogsData -> filtered dogs
  await fetch(`/home/${user}/${breedFilter}/${locationFilter}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      dogsData = data;
      console.log("dogsData: ", dogsData);
      // set maxIndex to length-1
      maxIndex = dogsData.length - 1;
      currIndex = 0;

      if (dogsData.length == 0) {
        showDogNotFound();
      } else {
        while (dogsClickedList.includes(dogsData[currIndex].username)) {
          // only add if less than maxIndex
          if (currIndex < maxIndex) {
            currIndex += 1;
          } else {
            showDogNotFound();
            return;
          }
        }

        // while loop is false
        hideDogNotFound();
        setDogCardContainer(currIndex, dogsData);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
// End document loaded

const setDogCardContainer = (index, data) => {
  document.querySelector("#dog-image-js").src = "/static/images/dog-images/" + data[index].image_filename;
  document.querySelector("#dog-location-js").innerHTML = data[index].location;
  document.querySelector("#dog-name-js").innerHTML = data[index].name;
  document.querySelector("#dog-age-js").innerHTML = `${data[index].year} years, ${data[index].month} months`;
  document.querySelector("#dog-details-js").innerHTML = `${data[index].breed} | ${data[index].coat_color}`;
};

// Filters
const selectBreed = document.querySelector("#select-breed-js");
const selectLocation = document.querySelector("#select-location-js");

selectBreed.addEventListener("change", async () => {
  breedFilter = selectBreed.value;

  await fetch(`/home/${user}/${breedFilter}/${locationFilter}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      dogsData = data;
      console.log("dogsData: ", dogsData);
      // set maxIndex to length-1
      maxIndex = dogsData.length - 1;
      currIndex = 0;

      if (dogsData.length == 0) {
        showDogNotFound();
      } else {
        while (dogsClickedList.includes(dogsData[currIndex].username)) {
          // only add if less than maxIndex
          if (currIndex < maxIndex) {
            currIndex += 1;
          } else {
            showDogNotFound();
            return;
          }
        }

        // while loop is false
        hideDogNotFound();
        setDogCardContainer(currIndex, dogsData);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

selectLocation.addEventListener("change", async () => {
  locationFilter = selectLocation.value;

  await fetch(`/home/${user}/${breedFilter}/${locationFilter}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      dogsData = data;
      console.log("dogList: ", dogsData);
      // set maxIndex to length-1
      maxIndex = dogsData.length - 1;
      currIndex = 0;

      if (dogsData.length == 0) {
        showDogNotFound();
      } else {
        while (dogsClickedList.includes(dogsData[currIndex].username)) {
          // only add if less than maxIndex
          if (currIndex < maxIndex) {
            currIndex += 1;
          } else {
            showDogNotFound();
            return;
          }
        }

        // while loop is false
        hideDogNotFound();
        setDogCardContainer(currIndex, dogsData);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function showDogNotFound() {
  document.querySelector(".dog-card-container").classList.add("hidden");
  document.querySelector(".dog-card-behind").classList.add("hidden");
  document.querySelector(".dog-not-found-container").classList.remove("hidden");

  // Disable options buttons
  const rejectContainer = document.querySelector(".reject-container");
  const likeContainer = document.querySelector(".like-container");

  rejectContainer.classList.add("disabled");
  likeContainer.classList.add("disabled");
}

function hideDogNotFound() {
  document.querySelector(".dog-card-container").classList.remove("hidden");
  document.querySelector(".dog-card-behind").classList.remove("hidden");
  document.querySelector(".dog-not-found-container").classList.add("hidden");

  // Enable options buttons
  const rejectContainer = document.querySelector(".reject-container");
  const likeContainer = document.querySelector(".like-container");

  rejectContainer.classList.remove("disabled");
  likeContainer.classList.remove("disabled");
}

// Reject is clicked
// const rejectContainer = document.querySelector(".reject-container");
const rejectClicked = async function () {
  // reset
  /* Hide Options Container */
  optionsContainer.classList.remove("hidden");
  /* Show Offsprings Message Container */
  offspringsMessageContainer.classList.add("hidden");

  // get dogs_clicked
  await fetch(`/dog-clicked/${user}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      dogsClickedList = data;
      console.log(dogsClickedList);
    });

  // move next dog
  if (currIndex < maxIndex) {
    currIndex += 1;
    if (!dogsClickedList.includes(dogsData[currIndex].username)) {
      hideDogNotFound();
      setDogCardContainer(currIndex, dogsData);
    } else {
      currIndex += 1;
    }
  } else {
    currIndex += 1;
    // reached maxIndex
    showDogNotFound();
  }

  console.log(currIndex);
  // add dog to dogs_clicked
  await fetch(`/dog-clicked/${user}/${dogsData[currIndex - 1].username}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.log(error);
    });

  // I added this - to assign dogsClickedList value
  await fetch(`/dog-clicked/${user}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      dogsClickedList = data;
      console.log("dogsClickedList: ", dogsClickedList);
    });
};

/* LIKE clicked */
const likeContainer = document.querySelector(".like-container");
const optionsContainer = document.querySelector(".options-container");
const offspringsMessageContainer = document.querySelector(".offsprings-message-container");

likeContainer.addEventListener("click", () => {
  /* Hide Options Container */
  optionsContainer.classList.add("hidden");
  /* Show Offsprings Message Container */
  offspringsMessageContainer.classList.remove("hidden");
});

// 'Offsprings' clicked
const offspringsButton = document.querySelector("#offsprings-js");
offspringsButton.addEventListener("click", async () => {
  // show carousel
  carouselContainer.classList.remove("hidden");

  const userBreed = userData.breed;
  const userCoatColor = userData.coat_color;

  const dogBreed = dogsData[currIndex].breed;
  const dogCoatColor = dogsData[currIndex].coat_color;

  console.log(userBreed, userCoatColor);
  console.log(dogBreed, dogCoatColor);

  // GET offsprings-images-paths
  let offspringsImagesPaths = [];
  await fetch(`/offsprings-images-paths/${userBreed}/${userCoatColor}/${dogBreed}/${dogCoatColor}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      offspringsImagesPaths = data.offsprings_images_paths;
      console.log(offspringsImagesPaths);
    });

  // Add images to carousel
  let carouselImagesContainer = document.querySelector(".carousel-images-container");

  //clear carousel images
  carouselImagesContainer.innerHTML = "";

  offspringsImagesPaths.forEach((path) => {
    // console.log(path);
    carouselImagesContainer.innerHTML += `
      <div class="slide">
        <img src="${path}" draggable="false">
      </div>`;
  });

  // set first image to data-active
  let carouselImagesContainerFirstChild = document.querySelector(".carousel-images-container > div");
  carouselImagesContainerFirstChild.setAttribute("data-active", "");

  // Show Carousel
  const buttons = document.querySelectorAll("[data-carousel-button]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const offset = button.dataset.carouselButton === "next" ? 1 : -1;
      const slides = button.closest("[data-carousel]").querySelector("[data-slides]");

      const activeSlide = slides.querySelector("[data-active]");
      let newIndex = [...slides.children].indexOf(activeSlide) + offset;
      if (newIndex < 0) newIndex = slides.children.length - 1;
      if (newIndex >= slides.children.length) newIndex = 0;

      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    });
  });
});

// Carousel Container Modal clicked
window.onclick = function (event) {
  if (event.target == carouselContainer) {
    carouselContainer.classList.add("hidden");
  }
};

// Profile Image Container clicked
const profileImageContainer = document.querySelector(".profile-image-container");
const logoutContainer = document.querySelector(".logout-container");
profileImageContainer.addEventListener("click", () => {
  if (logoutContainer.classList.contains("hidden")) {
    logoutContainer.classList.remove("hidden");
  } else {
    logoutContainer.classList.add("hidden");
  }
});

// Logout Contaienr clicked
logoutContainer.addEventListener("click", () => {
  window.location.href = "/";
});
