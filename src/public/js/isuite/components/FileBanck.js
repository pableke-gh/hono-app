
import api from "../../components/Api.js";
import FileInput from "../../components/inputs/FileInput.js";
import form from "../modules/isuite.js";

import rb from "../lib/RecibosBancarios.js";
import TB_CONFIG from "../lib/Tables.js";

export default class FileBanck extends FileInput {
	connectedCallback() {
		super.connectedCallback(); // init. component
		this.addChange(async ev => {
			const file = this.files[0];
			if (!file) // no file selected
				return form.reset(); // clear form and table
			rb.reset().parse(await file.text()); // parse file contents

			const n19 = rb.n19();
			if (n19.files) {
				Object.assign(TB_CONFIG.tables.n19, n19);
				return form.setNorma(n19, TB_CONFIG.tables.n19);
			}

			const n43 = rb.n43();
			if (window.location.search.endsWith("tpv=1")) {
				return api.init().json("/uae/ttpp/tpv").then(tpvs => {
					TB_CONFIG.tables.tpvs.data = n43.data.map(fila => {
						const tpv = tpvs.find(item => item.value.startsWith(rb.getTpv(fila)));
						fila.forma = tpv ? (tpv.value + " - " + tpv.label) : fila.forma; // actualizo el texto de agrupacion
						return rb.normalize(fila);
					});
					form.setNorma(n43, TB_CONFIG.tables.tpvs);
				});
			}
			if (n43.files) {
				n43.referencias = rb.references().join(); // referencias leidas del fichero bancario
				const temp1 = n43.data.filter(rb.isConciliable); // filas conciliables
				const aux = Object.copy({}, n43, [ "tipo", "ccc", "fInicio", "fFin", "referencias" ]);
				return api.setJSON(aux).json("/uae/ttpp/load").then(data => { // llamada post
					const temp2 = data.recibos.filter(recibo => {
						const fila = temp1.find(f => (recibo.refreb == f.ref1));
						fila && rb.acLoad(fila, recibo); //añado los datos de academico
						if (!recibo.fCobro || ([18, 31].indexOf(recibo.pago) < 0))
							return false; //recibo no de TPV
						//primero ajusto el offset time zone (-1 o -2 horas) y luego sumo 1 dia
						//recibo.fCobro.addHours(fCobro.getTimezoneOffset() / 60).addDate(1); //ajusto la hora de AC
						recibo.fCobro = new Date(recibo.fCobro); // build date object
						if (recibo.fCobro.trunc().getDay() == 5) recibo.fCobro.addDate(3); //si es viernes paso a lunes
						else if (recibo.fCobro.getDay() == 6) recibo.fCobro.addDate(2); //si es sabado paso a lunes
						else recibo.fCobro.addDate(1); //de domingo a jueves sumo 1 dia
						if (!recibo.fCobro.between(n43.fInicio, n43.fFin))
							return false; //recibo fuera del rango de fechas del fichero
						recibo.codigo = "22"; //codigo por defecto
						recibo.ref1 = recibo.refreb; // rename referencia
						recibo.forma = "TPV Virtual"; // forma cobro
						recibo.fOperacion = recibo.fCobro; //guardo la fecha de operacion en el recibo
						n43.incorporado += recibo.importe; //importe incorporado de AC
						return rb.normalize(recibo); //incorporo el recibo
					});
					n43.importe = n43.total + n43.incorporado; // importe recibos cancarios + incorporados
					TB_CONFIG.tables.n43.data = temp1.concat(temp2); // muestro todos los recibos
					form.setNorma(n43, TB_CONFIG.tables.n43);
				});
			}

			const n57 = rb.n57();
			if (n57.files) {
				n57.referencias = rb.references().join(); // referencias leidas del fichero bancario
				const temp1 = n57.data.filter(rb.isConciliable); // filas conciliables
				const aux = Object.copy({}, n57, [ "tipo", "ccc", "fInicio", "fFin", "referencias" ]);
				return api.setJSON(aux).json("/uae/ttpp/load").then(data => { // llamada post
					data.recibos.forEach(recibo => { //no incorporo nada
						const fila = temp1.find(f => (recibo.refreb == f.ref1));
						fila && rb.acLoad(fila, recibo); // añado los datos de academico
					});
					TB_CONFIG.tables.n57.data = temp1;
					form.setNorma(n57, TB_CONFIG.tables.n57);
				});
			}
		});
	}
}
