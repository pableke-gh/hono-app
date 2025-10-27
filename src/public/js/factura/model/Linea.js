
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

base.tfoot = resume => {
	return `<tr>
		<td colspan="2">Conceptos: ${resume.size}</td>
		<td class="currency">${i18n.isoFloat(resume.imp)} €</td>
		<td></td>
	</tr>
	<tr class="table-refresh" data-refresh="isFacturable">
		<td colspan="2">
			<label class="ui-blocks" style="justify-content: flex-end; align-items: center;">
			<div class="ui-block-main currency">IVA:</div>
			<div class="ui-block">
				<select id="iva" name="iva" class="ui-input ui-select ui-number ui-fiscal" data-editable="isEditableUae"></select>
			</div>
			</label>
		</td>
		<td class="currency table-refresh" data-refresh="text-render">$impIva; €</td> 
		<td></td>
	</tr>
	<tr class="table-refresh" data-refresh="isFacturable">
		<td class="currency" colspan="2">Importe Total:</td>
		<td class="currency table-refresh" data-refresh="text-render">$impTotal; €</td>
		<td></td>
	</tr>`;
}

const msgEmptyTable = "No existen conceptos asociados a la solicitud";
base.getTable = () => ({ msgEmptyTable, beforeRender: base.beforeRender, onRender: base.row, onFooter: base.tfoot });

base.validate = function(data) {
	const valid = i18n.getValidators();
	valid.gt0("imp", data.imp); // float required
	valid.size("desc", data.desc); // string required
	return valid.close("El concepto indicado no es válido!"); // Main form message
}

export default base;
