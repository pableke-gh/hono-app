
import dt from "../../components/types/DateBox.js";
import rutas from "./Rutas.js";
import dieta from "./Dieta.js";

class Dietas {
	build(tipo, grupo) {
		const dietas = []; // nueva lista de dietas
		// La letra "Z" al final de una fecha en formato ISO 8601 en JS indica que la hora está en UTC (Tiempo Universal Coordinado)
		const fDieta = new Date(rutas.getFechaSalida() + "T00:00:00.0"); // fecha sin ajuste de hora (sin Z => sin +1h)
		const fMax = new Date(rutas.getFechaLlegada() + "T00:00:00.0"); // fecha sin ajuste de hora (sin Z => sin +1h)

		const fnSetDieta = data => { // añado la nueva dieta a la lista de gastos
			dieta.setRegion(data, rutas.getPaisPernocta(fDieta)).setImporte(data, tipo, grupo); // region + importe dieta
			data.f1 = data.f2 = dt.toPlainDate(fDieta); // fecha en formato plano
			dietas.push(data); // añado una nueva dieta al array
			fDieta.addDays(1); // incremento un día
			return data;
		}
		const fnAddDieta = data => {
			dieta.addDia(data); // añadir un día más de dieta
			data.f2 = dt.toPlainDate(fDieta); // fecha en formato plano
			fDieta.addDays(1); // incremento un día
		}
		const fnCreateDiaIntermedio = () => fnSetDieta(dieta.createDiaIntermedio());

		// primer día
		if (dt.lt(fDieta, fMax) || dt.inDay(fDieta, fMax)) {
			const row = fnSetDieta(dieta.createDiaInicial());
			if (rutas.isMismoDia()) { // rutas de 1 dia
				if (rutas.isMedioDia())
					dieta.setMediaDieta(row);
				else
					dieta.setSinDieta(row);
			}
			else { // rutas de varios dias
				if (rutas.isSalidaTardia())
					dieta.setSinDieta(row);
				else if (!rutas.isSalidaTemprana())
					dieta.setMediaDieta(row);
			}
		}

		// primer día intermedio
		let prev = dt.lt(fDieta, fMax) ? fnCreateDiaIntermedio() : null;

		// resto de días intermedios
		while (dt.lt(fDieta, fMax)) {
			const pais = rutas.getPaisPernocta(fDieta);
			if (pais == prev.cod) // cambio de país
				fnAddDieta(prev); // añado un día más a la dieta anterior
			else
				prev = fnCreateDiaIntermedio();
		}

		// ultimo día
		if (dt.inDay(fDieta, fMax)) {
			const row = fnSetDieta(dieta.createDiaFinal());
			if (rutas.isLlegadaTemprana())
				dieta.setSinDieta(row);
			else
				dieta.setMediaDieta(row);
		}

		return dietas;
	}
}

export default new Dietas();
