const lookupDetails = document.querySelector("#lookup-details");
const lookupTerm = document.querySelector("#lookup-term");
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
  event.preventDefault();
  let regexPattern = /^[0-9A-F]+$/;

  if (macAddress.length < 12 || !regexPattern.test(macAddress)) {
    alert("Invalid MAC address. Check your term and try again");
  } else {
    const fetchOptions = {
      url: modalForm.action + `?query=${macAddress}`,
      method: modalForm.method,
      headers: {
        "X-RapidAPI-Key": "911aaa2ab6msh0130883ff84ee8dp163772jsn45d7f2d88fe1",
        "X-RapidAPI-Host": "mac-address-lookup1.p.rapidapi.com",
      },
    };

    fetch(fetchOptions.url, fetchOptions)
      .then(async (response) => {
        let content = await response.json();
        return { response, content };
      })
      .then((response) => {
        response["macAddress"] = macAddress;
        return response;
      })
      .then(render)
      .catch(onError);

    closeModal(event);
  }
}

function render(resp) {
  clearLookup();
  renderLookupTerm(resp);

  let status = resp.response.status;
  let result = resp.content.result ?? [];
  let errors = resp.content.errors ?? [];

  if (status >= 400 || errors.length > 0) {
    throw resp;
  }

  delete result[0].b16;

  let containerDetails = document.createElement("section");
  containerDetails.classList.add("container-details");

  renderTable(resp);

  containerDetails.append(tableDetails);
  lookupDetails.appendChild(containerDetails);
}

function renderTable(resp) {
  let result = resp.content.result ?? [];

  Object.entries(result[0]).forEach((element, index) => {
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

function renderLookupTerm(resp) {
  let macAddress = resp.macAddress;

  let formattedMacAddress = "";
  for (let i = 0; i <= 10; i = i + 2) {
    formattedMacAddress += macAddress.slice(i, i + 2) + ":";
  }

  formattedMacAddress = formattedMacAddress.slice(
    ":",
    formattedMacAddress.lastIndexOf(":")
  );

  let newLookupTerm = document.createElement("h2");
  newLookupTerm.innerHTML = formattedMacAddress;

  lookupTerm.lastElementChild.remove();
  lookupTerm.appendChild(newLookupTerm);
}

function clearLookup() {
  lookupDetails.firstElementChild.remove();
  tableDetails.replaceChildren("");
}

function onError(resp) {
  let errorElement = document.createElement("p");

  let errors = resp.content.errors ?? [];
  let status = resp.response.status;

  console.log(resp);

  if (errors) {
    switch (errors[0]) {
      case "Record Not Found.":
        errorElement.innerHTML =
          "We could not found a MAC Address within this range. Check the typed term and try again";
        break;
      default:
        errorElement.innerHTML =
          "Unfortunately, an error has ocurred. Please try again later.";
    }
  } else {
    status == 429
      ? (errorElement.innerHTML =
          "The maximum quota for this service has exceeded. Please try again tomorrow.")
      : (errorElement.innerHTML =
          "Unfortunately, an error has ocurred. Please try again later.");
  }

  lookupDetails.appendChild(errorElement);
}

modalButtonSubmit.onclick = (e) => getMacDetails(e, modalInput.value);
