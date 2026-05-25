
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js"
import DataList from "../../../components/inputs/DataList.js";
import observer from "../../../core/util/Observer.js";
import getActividad from "../../data/perfiles/actividades.js";

export default class Actividad extends DataList {
	setEditable() {
		this.setValue(irse.getActividad());
		this.setReadonly(!irse.isEditableP0());
	}

	isColaboracion = () => (this.value == "OCE") || (this.value == "IAE+OCE");
	isTribunal = () => (this.value == "ATR") || (this.value == "IAE+ATR");
	isFormacion = () => (this.value == "AFO") || (this.value == "IAE+AFO");
	isCom = () => (this.value == "COM");
	isMun = () => (this.value == "MUN");
	isMes = () => (this.value == "MES");
	isIae = () => (this.value == "IAE");
	isAtr = () => (this.value == "ATR");
	isAfo = () => (this.value == "AFO");
	isAcs = () => (this.value == "ACS");
	isCtp = () => (this.value == "CTP");
	isOce = () => (this.value == "OCE");
	isA7j = () => (this.value == "A7J");
	isMov = () => (this.value == "MOV");
	is1Dia = () => (this.isMun() || this.isMes() || this.isAcs() || this.isAfo() || this.isAtr() || this.isCtp() || this.isOce());

	connectedCallback() { // init component
		// actualizo el perfil al cambiar la actividad y notifico
		this.addChange(() => observer.emit("perfil", irse.setActividad(this.value)));
		observer.subscribe("perfil", () => { // notify changes in perfil
			this.select(getActividad(irse.getRol(), irse.getColectivo(), irse.getFinanciacion()));
			form.select("tramite", this.isCom() ? 7 : 1); // default = AyL
		});
	}
}
