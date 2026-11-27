const body = document.querySelector("#table-body");
const tableHead = document.querySelector("#table-head");
const title = document.querySelector("#table-title");
const addRecordButton = document.querySelector("#add-record-button");
const cityForm = document.querySelector("#city-form");
const resourceForm = document.querySelector("#resource-form");
const tabs = document.querySelector(".resource-tabs");

const resources = {
  ciudades: {
    title: "Ciudades",
    endpoint: "/api/v1/ciudades",
    sort: "ciudad",
    columns: [
      { label: "Id", value: (record) => record.id },
      { label: "Ciudad", value: (record) => record.ciudad },
      { label: "País", value: (record) => record.pais },
    ],
    name: (record) => record.ciudad,
  },
  clientes: {
    title: "Clientes",
    endpoint: "/api/v1/clientes",
    sort: "nombre",
    columns: [
      { label: "Id", value: (record) => record.id },
      { label: "Nombre", value: (record) => record.nombre },
      { label: "Teléfono", value: (record) => record.telefono || "—" },
      { label: "Segmento", value: (record) => record.segmento },
      { label: "Ciudad", value: (record) => record.ciudad?.ciudad || "—" },
    ],
    name: (record) => record.nombre,
  },
  oficinas: {
    title: "Oficinas",
    endpoint: "/api/v1/oficinas",
    sort: "nombre",
    columns: [
      { label: "Id", value: (record) => record.id },
      { label: "Nombre", value: (record) => record.nombre },
    ],
    name: (record) => record.nombre,
  },
};

let activeResource = "ciudades";
let currentRecords = [];

function getErrorMessage(payload, fallback) {
  return payload?.error?.message || fallback;
}

async function loadRecords() {
  const resource = resources[activeResource];
  const query = new URLSearchParams({
    page: "1",
    limit: "10",
    sort: resource.sort,
    order: "asc",
  });

  try {
    const response = await fetch(`${resource.endpoint}?${query}`);
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(getErrorMessage(payload, "No fue posible cargar los registros."));
    }

    renderRecords(payload.data);
  } catch (error) {
    currentRecords = [];
    body.replaceChildren();
    window.alert(error.message);
  }
}

function renderRecords(records) {
  currentRecords = records;
  tableHead.replaceChildren();

  const resource = resources[activeResource];
  title.textContent = `Información de ${resource.title}`;

  for (const column of resource.columns) {
    const heading = document.createElement("th");
    heading.scope = "col";
    heading.textContent = column.label;
    tableHead.append(heading);
  }

  const actionsHeading = document.createElement("th");
  actionsHeading.scope = "col";
  actionsHeading.textContent = "Operaciones";
  tableHead.append(actionsHeading);

  body.replaceChildren();

  for (const record of records) {
    const row = document.createElement("tr");

    for (const column of resource.columns) {
      const cell = document.createElement("td");
      cell.textContent = column.value(record) ?? "";
      row.append(cell);
    }

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";
    actionsCell.append(
      createActionButton("Modificar", "edit", record.id),
      createActionButton("Borrar", "delete", record.id),
    );
    row.append(actionsCell);
    body.append(row);
  }
}

function createActionButton(label, action, recordId) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `action-button ${action}-button`;
  button.dataset.action = action;
  button.dataset.recordId = recordId;
  button.textContent = label;
  button.setAttribute("aria-label", `${label} registro ${recordId}`);
  return button;
}

function openForm(record = null) {
  if (activeResource === "ciudades") {
    cityForm.open(record);
    return;
  }

  resourceForm.open(activeResource, record);
}

async function deleteRecord(record, button) {
  const resource = resources[activeResource];
  const confirmed = window.confirm(
    `¿Desea borrar "${resource.name(record)}"?`,
  );

  if (!confirmed) return;

  button.disabled = true;

  try {
    const response = await fetch(`${resource.endpoint}/${record.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const payload = await response.json();
      throw new Error(getErrorMessage(payload, "No fue posible borrar el registro."));
    }

    await loadRecords();
  } catch (error) {
    window.alert(error.message);
    button.disabled = false;
  }
}

tabs.addEventListener("click", (event) => {
  const tab = event.target.closest("button[data-resource]");
  if (!tab || !resources[tab.dataset.resource]) return;

  activeResource = tab.dataset.resource;
  for (const button of tabs.querySelectorAll("button[data-resource]")) {
    button.setAttribute("aria-pressed", String(button === tab));
  }
  loadRecords();
});

addRecordButton.addEventListener("click", () => openForm());

body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const recordId = Number(button.dataset.recordId);
  const record = currentRecords.find((item) => Number(item.id) === recordId);
  if (!record) return;

  if (button.dataset.action === "edit") {
    openForm(record);
  } else if (button.dataset.action === "delete") {
    deleteRecord(record, button);
  }
});

cityForm.addEventListener("city-saved", loadRecords);
resourceForm.addEventListener("resource-saved", (event) => {
  if (event.detail.resource === activeResource) loadRecords();
});

loadRecords();
