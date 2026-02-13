
import presto from "./Presto.js";

class Partida {
	isPrincipal = partida => (partida.mask & 1);
	setPrincipal = partida => { partida.mask |= 1; }

	isAnticipada = partida => (partida.mask & 4);
	isExcedida = partida => ((presto.isAnt() || (partida.e == "642")) && Number.isNumber(partida.ih) && ((partida.ih + .01) < partida.imp));
	isAfectada = mask => (mask & 1); // Es afectada? Si/No
}

export default new Partida();
