
import i18n from "../../i18n/langs.js";

function Otri() {
	this.row = data => {
		return `<tr class="tb-data">
			<td>${data.ej}</td><td>${data.org}</td><td>${data.func}</td><td>${data.eco}</td>
			<td>${i18n.isoFloat(data.ing1)}</td><td>${i18n.isoFloat(data.ing2)}</td>
			<td>${i18n.isoFloat(data.ch1)}</td><td>${i18n.isoFloat(data.ch2)}</td>
			<td>${i18n.isoFloat(data.habilitado)}</td><td>${i18n.isoFloat(data.max)}</td>
			<td>${data.oDesc}</td><td>${data.eDesc}</td> 
		</tr>`;
	}
	this.tfoot = resume => `<tr><td colspan="99">Generaciones de Crédito: ${resume.size}</td></tr>`;
}

export default new Otri();
