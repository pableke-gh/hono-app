
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaGasto.js";
import rutas from "../../model/ruta/Rutas.js";

import gastos from "./gastos.js";
import transportes from "./transportes.js";
import pernoctas from "./pernoctas.js";
import form from "../../../xeco/modules/SolicitudForm.js";

export default function(tab) {
	const _eTipoGasto = form.getInput("#tipoGasto");
	const _grpGasto = tab.querySelectorAll(".grupo-gasto");

	const isInterurbano = () => (_eTipoGasto.value == "8"); //trayectos interurbanos
	const isPernocta = () => (_eTipoGasto.value == "9"); // gasto tipo pernocta 
	const isTaxi = () => (_eTipoGasto.value == "4"); // ISU y taxi
	const isDoc = () => ["201", "202", "204", "205", "206"].includes(_eTipoGasto.value);
	const isExtra = () => ["301", "302", "303", "304"].includes(_eTipoGasto.value);
	const fnChange = () => {
		if (isPernocta())
			_grpGasto.mask(0b11011);
		else if (isDoc())
			_grpGasto.mask(0b10101);
		else if (isExtra())
			_grpGasto.mask(0b10111);
		else if (isTaxi()) //ISU y taxi
			_grpGasto.mask(0b10111);
		else if (0 < +_eTipoGasto.value) // ticket
			_grpGasto.mask(0b10011);
		else
			_grpGasto.mask(0b00001);
	}

	// Init tab 5
	_eTipoGasto.onchange = fnChange; // Change event
	iris.getTextGasto = () => i18n.get(isTaxi() ? "lblDescTaxi" : "lblDescObserv"); // label text
	// set date range type inputs + upload gasto handler on change event
	form.setDateRange("#fMinGasto", "#fMaxGasto");
	form.onChangeFile("[name='fileGasto']", (ev, el, file) => {
		el.nextElementSibling.innerHTML = file.name;
		fnChange();
	});

	const fnReset = () => {
		_grpGasto.mask(0);
		_eTipoGasto.value = "";
		const start = sb.isoDate(rutas.getHoraSalida());
		const end = sb.isoDate(rutas.getHoraLlegada());
		form.setValue("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setval("#fMinGasto", start).setAttr("#fMinGasto", "min", start.substring(0, 10))
			.setval("#fMaxGasto", end).setAttr("#fMaxGasto", "max", end.substring(0, 10))
			.setChanged().refresh(iris);
	}

	// validación del tipo de gasto
	const fnValidate = data => {
		const valid = form.getValidators();
		if (isDoc()) // doc only
			return valid.size500("txtGasto", data.txtGasto, "errDoc").isOk();
		if (isExtra() || isTaxi()) // extra info (paso 8) o ISU+taxi
			return valid.size500("txtGasto", data.txtGasto, "errDoc").gt0("impGasto", data.impGasto).isOk();
		if (isInterurbano())
			return transportes.validate(data);
		if (isPernocta())
			return pernoctas.validate(data);
		return valid.isOk();
	}

	// update tabs events
	const fnAfterUpload = data => {
		fnReset(); // add gasto and update rutas
		gastos.addGasto(data.gasto, data.rutas);
	}

	const fnUrl = () => {
		if (isPernocta())
			return "/uae/iris/upload/pernocta?id=" + iris.getId();
		if (isInterurbano())
			return "/uae/iris/upload/interurbano?id=" + iris.getId();
		if (isDoc())
			return "/uae/iris/upload/doc?id=" + iris.getId();
		if (isExtra())
			return "/uae/iris/upload/extra?id=" + iris.getId();
		return "/uae/iris/upload/ticket?id=" + iris.getId();
	}
	const fnUpload = data => {
		const include = [ "rutas", "num", "impGasto", "imp2", "desc" ];
		const fd = form.getFormData(data, include); // merge data to send
		fd.exclude([ // exclude fields
			"memo", "justifi", "justifiVp", "justifiCong", "tipoSubv", "finalidad", "justifiKm",
			"iban", "cuenta", "swift", "observaciones", "urgente", "fMax", "extra", "rechazo",
			"paisEntidad", "nombreEntidad", "codigoEntidad", "acInteresado", "origen", "destino"
		]);
		return api.setFormData(fd).send(fnUrl()); // send call to server
	}
	tabs.setViewEvent(5, fnReset); // reset form on view tab 5
	tabs.setAction("uploadGasto", () => { // upload button
		const data = form.validate(fnValidate, ".ui-gasto"); // valido los datos del gasto
		if (!data) // valido los datos del gasto
			return;
		if (isInterurbano()) // es trayecto interurbano
			return tabs.showTab(12); // muestro la tabla de rutas pendientes
		fnUpload(data).then(fnAfterUpload); // upload gasto
	});
	tabs.setInitEvent(12, () => { // tabla de rutas pendientes
		const _tblRutasGasto = form.setTable("#rutas-out", ruta.getTable()); // itinerario
		tabs.setViewEvent(12, () => _tblRutasGasto.render(rutas.getRutasUnlinked()));
		tabs.setAction("rtog", () => {
			const rutas = _tblRutasGasto.getBody().$$(":checked");
			if (!rutas || !rutas.length) // no hay rutas seleccionadas
				return form.showError("errLinkRuta"); // mensaje de error
			const data = form.getData(".ui-gasto"); // datos del sub-formulario
			data.rutas = rutas.map(el => el.value).join(); // PK de las rutas seleccionadas
			fnUpload(data).then(fnAfterUpload).then(() => { tabs.setActive(5); }); // vuelvo al paso 5
		});
	});
}
