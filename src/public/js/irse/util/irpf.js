
import ue from "../data/ue.js";

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
	#isResidente = interesado => (interesado.residencia == "ES")
	#isResidenteUE = interesado => (ue.includes(interesado.residencia))

	isIrpf = interesado => (interesado && ["EXT", "ALU"].includes(interesado.ci));
	getIrpf(interesado, actividad) {
		if (!this.isIrpf(interesado)) return 0;
		const i = IRPF_IDS.indexOf(actividad); // tipo de actividad
		if (this.#isResidente(interesado)) return (i < 0) ? DEFAULT_ES : IRPF_ES[i]; // residente en españa
		if (this.#isResidenteUE(interesado)) return (i < 0) ? DEFAULT_UE : IRPF_UE[i]; // union europea
		return (i < 0) ? DEFAULT_ZZ : IRPF_ZZ[i]; // resto del mundo
	}
	getImpIrpf(interesado, actividad, imp) {
		return (imp * this.getIrpf(interesado, actividad)) / POR_100;
	}

	#getIndexCF(actividad) {
		const i = IRPF_IDS.indexOf(actividad);
		return (i < 0) ? 3 : i; //por defecto ID=ZZ
	}
	getClaveFiscalExenta(interesado, actividad) {
		const i = this.#getIndexCF(actividad);
		if (this.#isResidente(interesado)) return EXENTO_ES[i];
		return this.#isResidenteUE(interesado) ? EXENTO_UE[i] : EXENTO_ZZ[i];
	}
	getClaveFiscalNoExenta(interesado, actividad) {
		const i = this.#getIndexCF(actividad);
		if (this.#isResidente(interesado)) return NO_EXENTO_ES[i];
		return this.#isResidenteUE(interesado) ? NO_EXENTO_UE[i] : NO_EXENTO_ZZ[i];
	}
}

export default new Irpf();
