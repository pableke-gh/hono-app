
import i18n from "../../i18n/langs.js";
import factura from "./Factura.js";

function Linea() {
	const self = this; //self instance
	const msgEmptyTable = "No existen conceptos asociados a la solicitud";

	this.beforeRender = resume => {
		resume.iva = factura.getIva();
		resume.imp = 0;
	}

	this.row = (data, status, resume) => {
		resume.imp += data.imp; // sum
		const remove = factura.isEditable() ? '<a href="#remove" class="fas fa-times action resize text-red row-action" title="Desasociar partida"></a>' : "";
		return `<tr class="tb-data">
			<td class="text-center">${status.count}</td>
			<td>${data.desc}</td><td class="text-right">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center">${remove}</td>
		</tr>`;
	}

	this.tfoot = resume => {
		const iva = factura.getIva();
		const show = factura.isFacturable() ? "" : "hide";
		const readonly = factura.isEditableUae() ? 'tabindex="30"' : "disabled";
		return `<tr>
			<td colspan="2">Conceptos: ${resume.size}</td>
			<td class="text-right">${i18n.isoFloat(resume.imp)} €</td>
			<td></td>
		</tr>
		<tr class="${show}">
			<td colspan="2">
				<label class="ui-blocks" style="justify-content: flex-end; align-items: center;">
				<div class="ui-block-main text-right">IVA:</div>
				<div class="ui-block">
					<select id="iva" name="iva" class="ui-input ui-select ui-number ui-fiscal" ${readonly}></select>
				</div>
				</label>
			</td>
			<td id="imp-iva" class="text-right">${i18n.isoFloat(iva)} €</td>
			<td></td>
		</tr>
		<tr class="${show}">
			<td class="text-right" colspan="2">Importe Total:</td>
			<td id="imp-total" class="text-right">${i18n.isoFloat(resume.imp * (iva / 100))} €</td>
			<td></td>
		</tr>`;
	}

	this.getTable = () => ({ msgEmptyTable, beforeRender: self.beforeRender, onRender: self.row, onFooter: self.tfoot });

	this.validate = function(data) {
		const valid = i18n.getValidators();
		valid.gt0("imp", data.imp); // float required
		valid.size("desc", data.desc); // string required
		return valid.close("El concepto indicado no es válido!"); // Main form message
	}
}

export default new Linea();
