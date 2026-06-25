
import api from "../../core/components/Api.js";
import tabs from "../../core/components/helpers/Tabs.js";
import observer from "../../core/util/Observer.js";

import pedido from "../model/Pedido.js";
import aplicacion from "../model/Aplicacion.js";

import FormHTML from "../../core/components/forms/Form.js";
import ButtonSave from "../components/buttons/Save.js";
import ButtonFirmar from "../components/buttons/Firmar.js"
import ButtonRechazar from "../components/buttons/Rechazar.js"
import ButtonCancelar from "../components/buttons/Cancelar.js"
import ButtonReport from "../components/buttons/Report.js"
import ButtonRemove from "../components/buttons/Remove.js"
import Firmas from "../../core/components/layouts/Firmas.js";

export default class PedidoForm extends FormHTML {
	#setImportes() {
		return this.setValue("impIva", pedido.getImpIva()).setValue("impTotal", pedido.getImpTotal())
					.setValue("prorrata", pedido.getProrrata()).setValue("impPpto", pedido.getImpPpto());
	}

	connectedCallback() {
		super.connectedCallback(); // initialize form
		pedido.setUser(this.dataset); // load user info
		tabs.setAction("create", () => this.create()); // set handlers

		this.addChange("imp", ev => { pedido.setImporte(ev.target.getValue()); this.#setImportes(); });
		this.addChange("iva", ev => { pedido.setIva(+ev.target.value); this.#setImportes(); });
		this.getElementsByClassName(this.dataset.loadedClass).forEach(el => {
			const template = el.innerHTML; // save template
			const fnUpdate = () => { el.innerHTML = pedido.render(template); };
			observer.subscribe(this.dataset.loadedClass, fnUpdate);
		});
	}

	#load(firmas) {
		Firmas.notify(firmas);
		tabs.showForm(); // show form tab
	}
	create() {
		aplicacion.clear(); // vacio la aplicacion
		const data = { imp: 0, iva: 21, prorrata: +this.dataset.prorrata };
		super.create(pedido.setData(data).getData()).#setImportes().#load(); // load form with default data
	}
	load = row => {
		if (!row) // row required
			return this.create();
		const fnLoad = (data, firmas) => {
			const editable = pedido.setData(data).isEditable(); // check if data is editable
			super.load(data, editable).#setImportes().#load(firmas); // load form with data
		}

		if (this.isCached(row.id)) // check if data is cached
			return fnLoad(row, true); // go form tab directly
		const url = `/uae/pedidos/view?id=${row.id}&a=${row.apli}`; // resource
		api.init().json(url).then(data => { // server response
			aplicacion.setData(data.apli); // load related aplication
			fnLoad(row, data.firmas); // show firmas list
		});
	}

	close = firmas => {
		this.isCached(pedido.getId()) && Firmas.notify(firmas);
		this.getTable().showList(); // show list tab
	}
	reject = row => {
		super.update(row, pedido.setData(row).isEditable()); // load form with data
		Firmas.notify(this.isCached(row.id));
		tabs.show("reject");
	}
}

customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-firmar", ButtonFirmar, { extends: "button" });
customElements.define("btn-rechazar", ButtonRechazar, { extends: "button" });
customElements.define("btn-cancelar", ButtonCancelar, { extends: "button" });
customElements.define("btn-report", ButtonReport, { extends: "button" });
customElements.define("btn-remove", ButtonRemove, { extends: "button" });
customElements.define("firmas-block", Firmas, { extends: "div" });
