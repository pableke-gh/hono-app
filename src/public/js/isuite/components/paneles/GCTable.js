
import dt from "../../../components/types/DateBox.js";
import TableHTML from "../../../core/components/Table.js";
import i18n from "../../i18n/langs.js";

export default class GCTable extends TableHTML {
	connectedCallback() {
		document.forms.isuite.setTable(this);
		this.setMsgEmpty("No se han encontrado orgánicas asociadas a la búsqueda seleccionada");
		this.view(); // show empty message
	}

	getHeaders = () => this.tHead.querySelectorAll("th").map(th => th.textContent);
	getExcel = () => this.getData().map(row => { // map data to excel
		const { ejercicio, organica, descripcion, porGg, drnAcum, rnAcum, maxHabilitar, orAcum, ctHabilitado, txtHabilitar, aipOrg, fMaxCobro } = row;
		return {
			ejercicio, organica, descripcion, porGg, 
			drnAcum, rnAcum, maxHabilitar, orAcum, ctHabilitado, txtHabilitar, 
			aipOrg, fMaxCobro: dt.toDate(fMaxCobro)
		};
	});

	beforeRender(resume) {
		resume.drnAcum = resume.rnAcum = resume.maxHabilitar = resume.orAcum = 0;
	}

	beforeRow(row) {
		const resume = this.getResume();
		resume.drnAcum += row.drnAcum;
		resume.rnAcum += row.rnAcum;
		resume.maxHabilitar += row.maxHabilitar;
		resume.orAcum += row.orAcum;
	}

	row(row) {
		row.txtHabilitar = (!row.modalidad || (row.modalidad == "I")) ? "Sin Ingreso"
								: (row.modalidad == "N") ? "No Vigente"
								: (row.modalidad == "E") ? "A Eliminar"
								: (!globalThis.isset(row.impHabilitar) || (row.modalidad == "S")) ? "A Solicitud"
								: i18n.isoFloat(row.impHabilitar);

		return `<tr class="tb-data">
			<td>${row.ejercicio}</td><td>${row.organica}</td><td>${row.descripcion}</td>
			<td class="currency">${i18n.isoFloat(row.porGg) ?? ""}</td>
			<td class="currency">${i18n.isoFloat(row.drnAcum)}</td>
			<td class="currency">${i18n.isoFloat(row.rnAcum)}</td>
			<td class="currency">${i18n.isoFloat(row.maxHabilitar)}</td>
			<td class="currency">${i18n.isoFloat(row.orAcum)}</td>
			<td class="currency">${i18n.isoFloat(row.ctHabilitado)}</td>
			<td class="currency">${row.txtHabilitar}</td>
			<td>${row.aipOrg || ""}</td>
			<td>${i18n.isoDate(row.fMaxCobro) || ""}</td>
		</tr>`;
	}

	afterRender() {
		this.tFoot.classList.remove("hide");
	}

	render(data) {
		const fnAsc = (a, b) => {
			const cmp = a.ejercicio.localeCompare(b.ejercicio);
			return (cmp == 0) ? a.organica.localeCompare(b.organica) : cmp;
		}
		super.render(data.sort(fnAsc));
	}
}
