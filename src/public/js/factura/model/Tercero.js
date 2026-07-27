
import Base from "../../core/model/Base.js";

class Tercero extends Base {
	isComunitario() { return (this.getMask() & 2); }
	isResidente() { return (this.getMask() & 128); }
	isEstablecimientoPermanente() { return (this.getMask() & 256); }
	isResidentePeninsula() {
		return (this.isResidente() || this.isEstablecimientoPermanente()) && (this.getMask() & 2048);
	}

	getKeyFiscal(data) {
		let key = "c" + data.imp; //caracter => persona fisica=1, persona juridica=2, est. publico=3
		key += (data.int & 256) ? "ep" : "no"; // Establecimiento permanente
		const ep_es = (data.int & 128) || (data.int & 256); //Establecimiento permanente o Residente
		// Residente en la peninsula=es, ceuta-melillacanarias=np, comunitario=ue, resto del mundo=zz
		key += ep_es ? ((data.int & 2048) ? "es" : "np") : ((data.int & 2) ? "ue" : "zz");
		return key;
	}
}

export default new Tercero();
