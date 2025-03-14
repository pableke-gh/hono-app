
import Form from "../../components/forms/Form.js";
import Solicitud from "../model/Solicitud.js";

function List() {
	const self = this; //self instance
	const model = Solicitud.self(); // obtengo el modelo de solicitud
	const form = new Form("#xeco-filter"); // filter form element
	const msgEmptyTable = "No se han encontrado solicitudes para a la búsqueda seleccionada";
	const opts = { msgEmptyTable, onRender: model.row, onFooter: model.tfoot };
	const tblSolicitudes = form.setTable("#solicitudes", opts);

	this.getForm = () => form;
	this.getTable = () => tblSolicitudes;
	this.setSolicitudes = data => {
		tblSolicitudes.render(data);
		return self;
	}
	this.load = () => {
		const divSolicitudes = form.querySelector("#solicitudes-json");
		return self.setSolicitudes(JSON.read(divSolicitudes?.innerHTML)); // preload data
	}

    window.onList = () => form.setData({ fMiFirma: "5" }, ":not([type=hidden])").loading();
    window.loadFiltro = (xhr, status, args) => {
        window.showTab(xhr, status, args, 2) && self.setSolicitudes(JSON.read(args.data));
    }
    window.updateList = (xhr, status, args) => {
        if (window.showTab(xhr, status, args, 2)) {
            tblSolicitudes.querySelectorAll(".firma-" + args.id).hide();
            tblSolicitudes.querySelectorAll(".estado-" + args.id).text("Procesando...");
        }
    }
}

export default new List();
