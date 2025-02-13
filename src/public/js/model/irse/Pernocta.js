
function Pernocta() {
	this.row = (data, status, resume) => {
		console.log('pernocta: ', data); 
		return `<tr class="tb-data tb-data-tc">
		</tr>`;
	}
}

export default new Pernocta();
