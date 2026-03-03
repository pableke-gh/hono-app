
import Base from "../../core/model/Base.js";

const ROL = [ "Responsable", "UXXIEC", "Comprador", "Habilidato", "Habilidato en Mis Orgánicas" ];

export default class Usuario extends Base {
	#rol = () => this.get("rol");
	getAcciones = () => this.get("acc");

	getRol = () => ROL[this.#rol() - 1];
	isResponsable = () => (this.#rol() == 1);
	isUxxiec = () => (this.#rol() == 2);
	isComprador = () => (this.#rol() == 3);
	isHabilidato = () => (this.#rol() == 4);
	isMisOrganicas = () => (this.#rol() == 5);

	isRemovable = () => (this.isHabilidato() && (this.getAcciones() & 1));
	isFacturable = () => (this.getAcciones() & 2);
	toggleFactura = () => this.set("acc", this.getAcciones()^2); // The bitwise XOR operator (^)
	isReportProv = () => (this.getAcciones() & 4);
	toggleReportProv = () => this.set("acc", this.getAcciones()^4);
	isIngresos = () => (this.getAcciones() & 8);
	toggleIngresos = () => this.set("acc", this.getAcciones()^8);
	isGastos = () => (this.getAcciones() & 16);
	toggleGastos = () => this.set("acc", this.getAcciones()^16);
	isPermisoUser = () => (this.getAcciones() & 32);
	togglePermisoUser = () => this.set("acc", this.getAcciones()^32);
}
