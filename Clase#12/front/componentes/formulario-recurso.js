class FormularioRecurso extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this.dialog = this.shadowRoot.querySelector("dialog");
    this.form = this.shadowRoot.querySelector("form");
    this.formTitle = this.shadowRoot.querySelector("#form-title");
    this.errorMessage = this.shadowRoot.querySelector(".error-message");
    this.submitButton = this.shadowRoot.querySelector("button[type='submit']");
    this.nameInput = this.shadowRoot.querySelector("#record-name");
    this.clientFields = this.shadowRoot.querySelector("#client-fields");
    this.citySelect = this.shadowRoot.querySelector("#client-city");

    this.shadowRoot.querySelector(".cancel-button").addEventListener("click", () => {
      this.dialog.close();
    });
    this.form.addEventListener("submit", (event) => this.saveRecord(event));
  }

  async open(resource, record = null) {
    this.resource = resource;
    this.recordId = record?.id ?? null;
    this.form.reset();
    this.errorMessage.textContent = "";
    this.nameInput.value = record?.nombre ?? "";

    const isClient = resource === "clientes";
    this.clientFields.hidden = !isClient;
    for (const control of this.clientFields.querySelectorAll("input, select")) {
      control.disabled = !isClient;
    }
    this.formTitle.textContent = this.recordId === null
      ? `Adicionar ${isClient ? "cliente" : "oficina"}`
      : `Modificar ${isClient ? "cliente" : "oficina"}`;

    if (isClient) {
      try {
        await this.loadCities(record?.ciudadId);
      } catch (error) {
        this.errorMessage.textContent = error.message;
      }

      this.shadowRoot.querySelector("#client-phone").value = record?.telefono ?? "";
      this.shadowRoot.querySelector("#client-segment").value = record?.segmento ?? "persona";
    }

    this.dialog.showModal();
    this.nameInput.focus();
  }

  async loadCities(selectedCityId) {
    this.citySelect.replaceChildren();
    const query = new URLSearchParams({ page: "1", limit: "100", sort: "ciudad", order: "asc" });
    const response = await fetch(`/api/v1/ciudades?${query}`);
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.error?.message || "No fue posible cargar las ciudades.");
    }

    this.citySelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecciona una ciudad";
    placeholder.disabled = true;
    placeholder.selected = true;
    this.citySelect.append(placeholder);

    for (const city of payload.data) {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent = `${city.ciudad} (${city.pais})`;
      this.citySelect.append(option);
    }

    this.citySelect.value = selectedCityId === undefined
      ? ""
      : String(selectedCityId);
  }

  async saveRecord(event) {
    event.preventDefault();
    this.errorMessage.textContent = "";
    this.submitButton.disabled = true;

    const payload = { nombre: this.nameInput.value.trim() };
    if (this.resource === "clientes") {
      payload.ciudadId = Number(this.citySelect.value);
      payload.telefono = this.shadowRoot.querySelector("#client-phone").value.trim();
      payload.segmento = this.shadowRoot.querySelector("#client-segment").value;
    }

    const isEditing = this.recordId !== null;
    const endpoint = isEditing
      ? `/api/v1/${this.resource}/${this.recordId}`
      : `/api/v1/${this.resource}`;

    try {
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "No fue posible guardar el registro.");
      }

      this.dispatchEvent(new CustomEvent("resource-saved", {
        bubbles: true,
        detail: { resource: this.resource, record: result.data },
      }));
      this.dialog.close();
    } catch (error) {
      this.errorMessage.textContent = error.message;
    } finally {
      this.submitButton.disabled = false;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        dialog {
          width: min(440px, calc(100vw - 32px));
          padding: 0;
          color: #111820;
          background: #fff;
          border: 0;
          border-radius: 7px;
          box-shadow: 0 18px 55px #11182740;
          font-family: "Segoe UI", Arial, sans-serif;
        }
        dialog::backdrop { background: #11182770; }
        h2 {
          margin: 0;
          padding: 16px 20px;
          background: #f7f7f7;
          border-bottom: 1px solid #d6d6d6;
          font-size: 18px;
        }
        form { padding: 20px; }
        label {
          display: grid;
          gap: 6px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        input, select {
          width: 100%;
          min-height: 38px;
          padding: 7px 10px;
          color: #111820;
          background: #fff;
          border: 1px solid #cbd3df;
          border-radius: 4px;
          font: inherit;
        }
        input:focus, select:focus { outline: 2px solid #3673b9; outline-offset: 1px; }
        .error-message {
          min-height: 20px;
          margin: 0 0 12px;
          color: #b42318;
          font-size: 14px;
        }
        .actions { display: flex; justify-content: flex-end; gap: 10px; }
        button {
          min-height: 36px;
          padding: 7px 16px;
          border-radius: 4px;
          font: inherit;
          font-weight: 600;
          cursor: pointer;
        }
        .cancel-button { color: #243347; background: #fff; border: 1px solid #cbd3df; }
        button[type="submit"] { color: #fff; background: #2869ad; border: 1px solid #20598f; }
        button:disabled { opacity: .65; cursor: wait; }
      </style>
      <dialog aria-labelledby="form-title">
        <h2 id="form-title">Adicionar registro</h2>
        <form>
          <label for="record-name">
            Nombre
            <input id="record-name" name="nombre" type="text" maxlength="80" required>
          </label>
          <div id="client-fields" hidden>
            <label for="client-city">
              Ciudad
              <select id="client-city" name="ciudadId" required></select>
            </label>
            <label for="client-phone">
              Teléfono
              <input id="client-phone" name="telefono" type="text" maxlength="20">
            </label>
            <label for="client-segment">
              Segmento
              <select id="client-segment" name="segmento" required>
                <option value="persona">Persona</option>
                <option value="empresa">Empresa</option>
              </select>
            </label>
          </div>
          <p class="error-message" role="alert" aria-live="polite"></p>
          <div class="actions">
            <button class="cancel-button" type="button">Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </dialog>
    `;
  }
}

customElements.define("formulario-recurso", FormularioRecurso);
