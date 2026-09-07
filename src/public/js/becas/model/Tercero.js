
import Base from "../../core/model/Base.js";

class Tercero extends Base {
	setData(data) {
		super.setData(data); // load new data
		const mask = data.mask & 65535; // bit16 = avoid bit17
		return this.setEstado(mask ? ((mask & 1) ? 1 : 2) : 0);
	}

	isNuevo() { return (this.getMask() == 0); }
	setNuevo() { return this.setMask(0) }
	isCancelado() { return (this.getMask() & 1); }
	isActivo() { return !this.isCancelado(); }

	buildName(data) { return (data.nombre + " " + (data.ap1 || "") + " " + (data.ap2 || "")).trim(); }
	buildNifName(data) { return data.nif + " - " + this.buildName(data); }
	getNombreCompleto() { return this.buildName(this.getData()); }
	getNifNombreCompleto() { return this.buildNifName(this.getData()); }

	getDireccion() { return this.get("dir"); }
	getDomicilio() { return (this.get("via") + " " + this.getDireccion()).trim(); }

	getImporte() { return this.get("imp"); }
	setImporte(imp) { this.set("imp", imp); }

	getIban() { return this.get("iban"); } // cuenta bancaria
	setIban(iban) { return this.set("iban", iban); } // cuenta bancaria
	setIbanNuevo() { return this.setMask(this.getMask() | 131072); } // bit17 = iban nuevo (no en uxxiec)
	setIbanActivo() { return this.setMask(this.getMask() & ~131072); } // bit17 = iban activo en uxxiec
	isIbanNuevo(mask) {
		mask = mask ?? this.getMask(); // default to current mask
		return mask & 131072; // bit17 = nuevo iban
	}

	getBanco() { return this.get("banco"); } // nombre de la entidad (ES ó resto del mundo)
	getEntidad() { return this.get("entidad"); } // nombre de la entidad (ES)
	setEntidad(value) { return this.set("entidad", value); }
	getPaisEntidad() { return this.get("paisEntidad"); }
	isEntidadEs() { return ("ES" == this.getPaisEntidad()); }
	isEntidadExtranjera() { return !this.isEntidadEs(); }
}

export default new Tercero();
