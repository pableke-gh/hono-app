
import Form from "../../components/forms/Form.js";
import model from "../model/Solicitud.js";

function List() {
	const self = this; //self instance
	const form = new Form("#xeco-filter"); // filter form element

	const msgEmptyTable = "No se han encontrado solicitudes para a la búsqueda seleccionada";
	const opts = { msgEmptyTable, onRender: model.row, onFooter: model.tfoot };
	const tblSolicitudes = form.setTable("#solicitudes", opts);

	this.getForm = () => form;
	this.getTable = () => tblSolicitudes;
	this.getCurrentItem = tblSolicitudes.getCurrentItem;
	this.setSolicitudes = data => {
		tblSolicitudes.render(data);
		return self;
	}
	this.update = id => {
		tblSolicitudes.querySelectorAll(".firma-" + id).hide();
		tblSolicitudes.querySelectorAll(".estado-" + id).text("Procesando...");
		return self;
	}
	this.load = () => {
		const divSolicitudes = form.querySelector("#solicitudes-json");
		return self.setSolicitudes(JSON.read(divSolicitudes?.innerHTML)); // preload data
	}

	window.onList = () => form.setData({ fMiFirma: "5" }, ":not([type=hidden])").loading();
	window.loadFiltro = (xhr, status, args) => {
		window.showTab(xhr, status, args, "list") && self.setSolicitudes(JSON.read(args.data));
	}
	window.updateList = (xhr, status, args) => {
		if (window.showTab(xhr, status, args, "list"))
			self.update(args.id); // update list
	}
}

export default new List();
