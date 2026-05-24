
import irse from "../model/Irse.js";
import interesado from "../model/Interesado.js";

const DEFAULT_ES = 15;
const DEFAULT_UE = 19;
const DEFAULT_ZZ = 24;

// % IRPF
const IRPF_IDS = [ "ATR",      "IAE+ATR",  "ACS",      "ZZ"       ];
const IRPF_ES =  [ 2,          2,          35,         DEFAULT_ES ];
const IRPF_UE =  [ DEFAULT_UE, DEFAULT_UE, DEFAULT_UE, DEFAULT_UE ];
const IRPF_ZZ =  [ DEFAULT_ZZ, DEFAULT_ZZ, DEFAULT_ZZ, DEFAULT_ZZ ];

 // claves fiscales
const EXENTO_ES =    [ "-",         "190 L 01",  "-",         "190 L 01"  ];
const NO_EXENTO_ES = [ "190 A 01",  "190 A 01",  "190 E 02",  "190 F 02"  ];
const EXENTO_UE =    [ "296 20 01", "296 20 01", "296 20 01", "296 20 01" ];
const NO_EXENTO_UE = [ "296 20 03", "296 20 03", "296 20 03", "296 20 03" ];
const EXENTO_ZZ =    [ "296 20 01", "296 20 01", "296 20 01", "296 20 01" ];
const NO_EXENTO_ZZ = [ "296 20 03", "296 20 03", "296 20 03", "296 20 03" ];

class Irpf {
	isIrpf = () => (interesado.isAlumno() || interesado.isExterno());
	getIrpf() {
		if (!this.isIrpf()) return 0;
		const i = IRPF_IDS.indexOf(irse.getActividad()); // tipo de actividad
		if (interesado.isResidente()) return (i < 0) ? DEFAULT_ES : IRPF_ES[i]; // residente en españa
		if (interesado.isResidenteUE()) return (i < 0) ? DEFAULT_UE : IRPF_UE[i]; // union europea
		return (i < 0) ? DEFAULT_ZZ : IRPF_ZZ[i]; // resto del mundo
	}
	getImpIrpf(imp) {
		return (imp * this.getIrpf()) / POR_100;
	}

	#getIndexCF() {
		const i = IRPF_IDS.indexOf(irse.getActividad());
		return (i < 0) ? 3 : i; //por defecto ID=ZZ
	}
	getClaveFiscalExenta() {
		const i = this.#getIndexCF();
		if (interesado.isResidente()) return EXENTO_ES[i];
		return interesado.isResidenteUE() ? EXENTO_UE[i] : EXENTO_ZZ[i];
	}
	getClaveFiscalNoExenta() {
		const i = this.#getIndexCF();
		if (interesado.isResidente()) return NO_EXENTO_ES[i];
		return interesado.isResidenteUE() ? NO_EXENTO_UE[i] : NO_EXENTO_ZZ[i];
	}
}

export default new Irpf();
