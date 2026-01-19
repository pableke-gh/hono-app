
import i18n from "../../i18n/langs.js";
import Base from "../../xeco/model/Base.js";
import factura from "./Factura.js";

const base = new Base(); // model instance

base.beforeRender = resume => { resume.imp = 0; }
base.row = (data, status, resume) => {
	resume.imp += data.imp; // sum
	const remove = factura.isEditable() ? '<a href="#remove" class="fas fa-times action resize text-red" title="Desasociar partida"></a>' : "";
	return `<tr class="tb-data">
		<td class="text-center">${status.count}</td>
		<td>${data.desc}</td><td class="currency">${i18n.isoFloat(data.imp)} €</td>
		<td class="text-center">${remove}</td>
	</tr>`;
}

const msgEmptyTable = "No existen conceptos asociados a la solicitud";
base.getTable = () => ({ msgEmptyTable, beforeRender: base.beforeRender, onRender: base.row });

base.validate = function(data) {
	const valid = i18n.getValidators();
	valid.gt0("imp", data.imp); // float required
	valid.size("desc", data.desc); // string required
	return valid.close("El concepto indicado no es válido!"); // Main form message
}

export default base;
