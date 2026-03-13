
class TtppEmpresa {
	eq = (linea, recibo) => (linea.cod == recibo.value);
	toLinea = recibo => ({ cod: recibo.value, desc: recibo.label, imp: recibo.imp });
}

export default new TtppEmpresa();
