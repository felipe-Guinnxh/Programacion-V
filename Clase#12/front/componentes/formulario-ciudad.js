class FormularioCiudad extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this.dialog = this.shadowRoot.querySelector("dialog");
    this.form = this.shadowRoot.querySelector("form");
    this.formTitle = this.shadowRoot.querySelector("#city-form-title");
    this.errorMessage = this.shadowRoot.querySelector(".error-message");
    this.submitButton = this.shadowRoot.querySelector("button[type='submit']");

    this.shadowRoot.querySelector(".cancel-button").addEventListener("click", () => {
      this.close();
    });
    this.form.addEventListener("submit", (event) => this.saveCity(event));
  }

  open(city = null) {
    this.cityId = city?.id ?? null;
    this.form.reset();
    this.errorMessage.textContent = "";
    this.formTitle.textContent = this.cityId === null ? "Adicionar ciudad" : "Modificar ciudad";

    if (city) {
      this.form.elements.ciudad.value = city.ciudad;
      this.form.elements.pais.value = city.pais;
    }

    this.dialog.showModal();
    this.shadowRoot.querySelector("#city").focus();
  }

  close() {
    this.dialog.close();
  }

  async saveCity(event) {
    event.preventDefault();
    this.errorMessage.textContent = "";
    this.submitButton.disabled = true;

    const formData = new FormData(this.form);
    const city = {
      ciudad: String(formData.get("ciudad")).trim(),
      pais: String(formData.get("pais")).trim(),
    };
    const isEditing = this.cityId !== null;
    const endpoint = isEditing
      ? `/api/v1/ciudades/${this.cityId}`
      : "/api/v1/ciudades";

    try {
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(city),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || "No fue posible guardar la ciudad.");
      }

      this.dispatchEvent(new CustomEvent("city-saved", {
        bubbles: true,
        detail: payload.data,
      }));
      this.close();
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
        input {
          width: 100%;
          min-height: 38px;
          padding: 7px 10px;
          color: #111820;
          background: #fff;
          border: 1px solid #cbd3df;
          border-radius: 4px;
          font: inherit;
        }
        input:focus {
          outline: 2px solid #3673b9;
          outline-offset: 1px;
        }
        .error-message {
          min-height: 20px;
          margin: 0 0 12px;
          color: #b42318;
          font-size: 14px;
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        button {
          min-height: 36px;
          padding: 7px 16px;
          border-radius: 4px;
          font: inherit;
          font-weight: 600;
          cursor: pointer;
        }
        .cancel-button {
          color: #243347;
          background: #fff;
          border: 1px solid #cbd3df;
        }
        button[type="submit"] {
          color: #fff;
          background: #2869ad;
          border: 1px solid #20598f;
        }
        button:disabled { opacity: .65; cursor: wait; }
      </style>
      <dialog aria-labelledby="city-form-title">
        <h2 id="city-form-title">Adicionar ciudad</h2>
        <form>
          <label for="city">
            Ciudad
            <input id="city" name="ciudad" type="text" maxlength="80" required>
          </label>
          <label for="country">
            País
            <input id="country" name="pais" type="text" maxlength="80" required>
          </label>
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

customElements.define("formulario-ciudad", FormularioCiudad);
