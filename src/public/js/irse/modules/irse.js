
import coll from "../../components/Collection.js";
import tabs from "../../components/Tabs.js";
import valid from "../i18n/validators.js";

import irse from "../model/Irse.js";
import Perfil from "./tabs/perfil.js";
import Paso1 from "./tabs/paso1.js";
import Rutas from "./tabs/rutas.js";
import Paso3 from "./tabs/paso3.js";
import Paso5 from "./tabs/paso5.js";
import Resumen from "./tabs/resumen.js";
import Paso9 from "./tabs/paso9.js";
import InformeISU from "./tabs/otri.js";
import solicitudes from "./solicitudes.js";
import Solicitud from "../../core/modules/solicitud.js";

class IrseSolicitud extends Solicitud {
	#perfil = new Perfil(this);
	#paso1 = new Paso1(this);
	#rutas = new Rutas(this);
	#paso3 = new Paso3(this);
	#paso5 = new Paso5(this);
	#resumen = new Resumen(this);
	#paso9 = new Paso9(this);
	#isu = new InformeISU(this);

	constructor() {
		super(solicitudes, solicitudes.getSolicitud());

		// PF hack for old version compatibility => remove when possible
		const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; } // set param structure
		window.createIrse = (xhr, status, args) => { solicitudes.clear(); window.viewIrse(xhr, status, args, 0); } // perfil tab
		solicitudes.set("#view", data => (this.isCached(data.id) ? tabs.showTab(irse.setData(data).getInitTab()) : window.rcView(fnIdParam(data))));

		window.saveTab = () => this.setOk().setChanged().refresh(irse).working();
		window.showTab = (xhr, status, args, tab) => {
			if (!window.showAlerts(xhr, status, args)) return;
			irse.setData(coll.parse(args.data)); // update irse data
			this.setval("#idses", irse.getId()).setCache(irse.getId())
				.setFirmas(coll.parse(args.firmas)).refresh(irse); // update state
			tabs.load(this.getForm()).goTab(tab); // go selected/next tab
		}
		window.closeForm = (xhr, status, args) => {
			if (!window.showAlerts(xhr, status, args)) return;
			solicitudes.setWorking(); // update state
			this.viewInit(); // go init tab
		}
	}

	init() { // init modules
		this.setValidators(valid)
		solicitudes.init();

		this.#perfil.init();
		this.#paso1.init();
		this.#rutas.init();
		this.#paso3.init();
		this.#paso5.init();
		this.#resumen.init();
		this.#paso9.init();
		this.#isu.init();
		super.init(); // configure inputs
	}

	view = firmas => {
		this.#perfil.view();
		this.#rutas.view();
		this.#resumen.view();

		const fnSync = ev => this.eachInput(".ui-matricula", el => { el.value = ev.target.value; }); 
		this.initInputs().setval("#idses", irse.getId()).setCache(irse.getId()).setFirmas(firmas);
		this.onChangeInputs(".ui-matricula", fnSync).refresh(irse); // update state
	}

	getPerfil = () => this.#perfil; // module perfil
	getOrganicas = this.#perfil.getOrganicas; // table organicas
	getPaso1 = () => this.#paso1; // module paso1
	getRutas = () => this.#rutas; // module rutas
	getPaso3 = () => this.#paso3; // module paso3
	getPaso5 = () => this.#paso5; // module paso5
	getResumen = () => this.#resumen; // module resumen
	getPaso9 = () => this.#paso9; // module paso5
	getInformeISU = () => this.#isu; // module InformeISU
}

export default new IrseSolicitud();
