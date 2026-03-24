
import dt from "../../../components/types/DateBox.js";
import tabs from "../../../components/Tabs.js";
import Validators from "../../../core/i18n/validators.js";

import rutas from "../../model/Rutas.js";
import gasto from "../../model/Gasto.js";
import form from "../../modules/irse.js";

class IrseValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation
	rechazar() { return super.rechazar(form.getData()); } // specific implementation

	perfil() {
		const ok = form.getElement("organica").validate();
		return form.getElement("interesado").validate() && ok;
	}

	/** validaciones ISU **/
	congreso(f1, f2) {
		const fIniCong = dt.trunc(dt.addDays(dt.toDate(f1), -1)); // fecha inicio del congreso
		const fFinCong = dt.trunc(dt.addDays(dt.toDate(f2), 2)); // fecha fin del congreso
		return ((fIniCong && dt.lt(rutas.salida(), fIniCong)) || (fFinCong && dt.lt(fFinCong, rutas.llegada())));
	}
	paso3() {
		const data = form.getData(); // start validation
		this.size500("justifi", data.justifi, "errJustifiSubv");
		if (rutas.getNumRutasVp())
			this.size500("justifiVp", data.justifiVp, "errJustifiVp");
		if (data.congreso == "0") // no es congreso
			return this.close(data);
		if (this.congreso(data.fIniCong, data.fFinCong)) // valido los datos del congreso
			this.size500("justifiCong", data.justifiCong, "errCongreso");
		if (data.congreso == "4")
			this.gt0("impInsc", data.impInsc);
		return this.close(data);
	}
	/** validaciones ISU **/

	upload() {
		const data = form.getData();
		if (gasto.isTipoDoc(data.tipoGasto))
			return this.size250("txtGasto", data.txtGasto, "errDoc").close(data);
		if (this.gt0("impGasto", data.impGasto, "errGt0").isError())
			return this.fail(); // required inputs error
		if (gasto.isTipoTaxi(data.tipoGasto)) //ISU y taxi
			return this.size250("txtGasto", data.txtGasto).close(data);
		if (gasto.isTipoExtra(data.tipoGasto))
			return this.size250("txtGasto", data.txtGasto, "errJustifiExtra").close(data);
		if (gasto.isTipoInterurbano(data.tipoGasto))
			return !tabs.showTab(12); //factura sin trayectos asociados => tab-12
		if (gasto.isTipoPernocta(data.tipoGasto) && (!data.fAloMin || !data.fAloMax))
			return this.addRequired("fAloMin", "errFechasAloja").fail();
		return this.success(data);
	}

	pernoctas() {
		const data = form.getData();
		this.gt0("impGasto", data.impGasto).isDate("fAloMin", data.fAloMin).isDate("fAloMax", data.fAloMax);
		if (data.fAloMin > data.fAloMax)
			return this.addRequired("fAloMin", "errFechasAloja").fail(); // stop validations

		const f1 = new Date(data.fAloMin); // T00:00:00.000Z
		const f2 = new Date(data.fAloMax); // T00:00:00.000Z
		data.num = dt.diffDays(f2, f1); // número de noches (fechas truncadas)

		const tipo = form.getOrganicas().getTipoDieta();
		const grupo = form.getPaso1().getGrupoDieta();
		const idPais1 = rutas.getPaisPernocta(f1);
		while (dt.lt(f1, f2)) { // range date iterator
			if (rutas.getPaisPernocta(f1) != idPais1)
				return this.addRequired("fMinGasto", "errPais").fail();
			f1.addDays(1); // incremento un día
		}
		data.imp2 = this.getImpNoche(tipo, idPais1, grupo);
		data.desc = i18n.getRegion(idPais1);
		return this.close(data);
	}

	resumen(resume) {
		const data = form.getData();
		resume.justifi && this.size500("justifiKm", data.justifiKm, "errJustifiKm");
		return this.close(data);
	}

	paso9() {
		const data = form.getData();
		this.size50("iban", data.iban, "errIban");
		if (!data.cuentas) {
			if (data.paises != "ES")
				this.size20("swift", data.swift, "errSwift").size50("banco", data.banco, "errRequired");
			else
				this.size20("entidades", data.entidades);
		}
		if (data.urgente == "2")
			this.size500("extra", data.extra, "errExtra").geToday("fMax", data.fMax, "errFechaMax");
		return this.close(data);
	}
}

export default new IrseValidators();
