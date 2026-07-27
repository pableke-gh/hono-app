
import Base from "../../core/model/Base.js";

class Tercero extends Base {
	isNuevo() { return (this.getEstado() == 2); }
	setNuevo() { return this.setEstado(2) }
	isCancelado() { return (this.getEstado() == 1); }
	isActivo() { return (this.getEstado() == 0); }

	buildName(data) { return (data.nombre + " " + (data.ap1 || "") + " " + (data.ap2 || "")).trim(); }
	buildNifName(data) { return data.nif + " - " + this.buildName(data); }
	getNombreCompleto() { return this.buildName(this.getData()); }
	getNifNombreCompleto() { return this.buildNifName(this.getData()); }

	getDireccion() { return this.get("dir"); }
	getDomicilio() { return /*this.get("via") + " " +*/ this.getDireccion(); }
	setImporte(imp) { this.set("imp", imp); }

	getBanco() { return this.get("banco"); } // nombre de la entidad
	getEntidad() { return this.get("entidad"); } // nombre de la entidad
	setEntidad(value) { return this.set("entidad", value); }
	getPaisEntidad() { return this.get("paisEntidad"); }
	isEntidadEs() { return ("ES" == this.getPaisEntidad()); }
	isEntidadExtranjera() { return !this.isEntidadEs(); }

	create() { // update data for new tercero
		return this.setNuevo().setEntidad(this.getBanco()).setImporte(this.get("impNuevo"));
	}
}

export default new Tercero();
