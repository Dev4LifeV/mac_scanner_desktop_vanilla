const modalInput = document.querySelector("#modal-input");
const modalForm = document.querySelector("#modal-form");
const lookupDetails = document.querySelector("#lookup-details");
const tableDetails = document.querySelector("#table-details");
const formattedTableLabels = [
  "MAC Address Prefix",
  "Vendor",
  "Company Address",
];

modalInput.oninput = (e) => (e.target.value = e.target.value.toUpperCase());

initialPageState();

function initialPageState() {
  if (!tableDetails.hasChildNodes()) {
    clearLookup();
    let initialState = document.createElement("b");
    initialState.innerHTML =
      "Start your first query by pressing the search button in the corner";

    lookupDetails.appendChild(initialState);
  }
}

function getMacDetails(event, macAddress) {
  const fetchOptions = {
    url: modalForm.action + `?query=${macAddress}`,
    method: modalForm.method,
    headers: {
      "X-RapidAPI-Key": "816afd6ae1msh23a4b2de5529b26p1c58e4jsn2708b2358c88",
      "X-RapidAPI-Host": "mac-address-lookup1.p.rapidapi.com",
    },
  };

  event.preventDefault();
  fetch(fetchOptions.url, fetchOptions)
    .then((resp) => resp.json())
    .then(render)
    .catch(onError);

  closeModal(event);
}

function render(resp) {
  clearLookup();

  if (resp.errors.length > 0) {
    throw resp;
  }

  delete resp.result[0].b16;

  let containerDetails = document.createElement("section");
  containerDetails.classList.add("container-details");

  renderTable(resp);

  containerDetails.append(tableDetails);
  lookupDetails.appendChild(containerDetails);
}

function renderTable(resp) {
  Object.entries(resp.result[0]).forEach((element, index) => {
    let tr = document.createElement("tr");
    let key = document.createElement("td");
    let value = document.createElement("td");

    key.innerHTML = formattedTableLabels[index];
    value.innerHTML = element[1];

    tr.appendChild(key);
    tr.appendChild(value);

    tableDetails.appendChild(tr);
  });
}

function clearLookup() {
  lookupDetails.firstElementChild.remove();
  tableDetails.replaceChildren("");
}

function onError(resp) {
  let errorElement = document.createElement("p");

  resp.errors[0] == "Record Not Found."
    ? (errorElement.innerHTML =
        "We could not found a MAC Address within this range. Check the typed term and try again")
    : (errorElement.innerHTML =
        "Unfortunately, an error has ocurred. Please try again later.");
  lookupDetails.appendChild(errorElement);
}

buttonSubmit.onclick = (e) => getMacDetails(e, modalInput.value);
