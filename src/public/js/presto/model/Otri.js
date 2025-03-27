
function Otri() {
	this.row = data => {
		return `<tr class="tb-data">
		</tr>`;
	}
	this.tfoot = resume => `<tr><td colspan="99">Generaciones de Crédito: ${resume.size}</td></tr>`;
}

export default new Otri();
