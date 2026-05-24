
import Base from "../../core/model/Base.js";
import ue from "../data/ue.js";

class Interesado extends Base {
	getColectivo() { return this.get("ci"); }
	isAlumno = () => (this.getColectivo() == "ALU");
	isExterno = () => (this.getColectivo() == "EXT");

	getResidencia() { return this.get("residencia"); }
	isResidente = () => (this.getResidencia() == "ES");
	isResidenteUE = () => ue.includes(this.getResidencia());

	getCargos() { return this.get("cargos"); } // mascara de cargos
	isEquipoGob = () => ((this.getCargos() & 64) == 64); // el interesado forma parte del equipo de gobierno
}

export default new Interesado();
