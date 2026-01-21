
import i18n from "../../i18n/langs.js";
import Base from "../../xeco/model/Base.js";
import factura from "./Factura.js";

class Linea extends Base {
	beforeRender = resume => { resume.imp = 0; }
	rowCalc = (data, resume) => { resume.imp += data.imp; }

	row = (data, status, resume) => {
		this.rowCalc(data, resume);
		const remove = factura.isEditable() ? '<a href="#remove" class="fas fa-times action resize text-red" title="Desasociar partida"></a>' : "";
		return `<tr class="tb-data">
			<td class="text-center">${status.count}</td>
			<td>${data.desc}</td><td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center">${remove}</td>
		</tr>`;
	}

	getTable = () => ({
		msgEmptyTable: "No existen conceptos asociados a la solicitud", 
		beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row
	});

	validate = function(data) {
		const valid = i18n.getValidators();
		valid.gt0("imp", data.imp); // float required
		valid.size("desc", data.desc); // string required
		return valid.close("El concepto indicado no es válido!"); // Main form message
	}
}

export default new Linea();
