const modalButtonSubmit = document.querySelector("#modal-submit");
const modal = document.querySelector("#modal");
const modalIconClose = document.querySelector("#modal-icon-close");
const modalInput = document.querySelector("#modal-input");
const modalForm = document.querySelector("#modal-form");

const button = document.querySelector("[fab]");
const background = document.querySelector("#modal-background");

let closeModal = function (e) {
  e.preventDefault();
  background.classList.add("background-hide");
  background.classList.remove("background-show");

  modal.classList.add("modal-hide");
  modal.classList.remove("modal-show");
  modal.style.visibility = "hidden";
};

let openModal = function () {
  background.classList.remove("background-hide");
  background.classList.add("background-show");

  modal.classList.remove("modal-hide");
  modal.classList.add("modal-show");
  modal.style.visibility = "visible";
};

button.onclick = openModal;

background.onclick = closeModal;
modalIconClose.onclick = closeModal;
