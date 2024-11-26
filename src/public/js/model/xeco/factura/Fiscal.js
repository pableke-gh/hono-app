
import fiscalidad from "../../../data/fiscal.js"

function Fiscal() {
	const self = this; //self instance

    this.getKeyFactura = (tercero, subtipo) => {
        let key = "c" + tercero.imp; //caracter => persona fisica=1, persona juridica=2, est. publico=3
        key += (tercero.int & 256) ? "ep" : "no"; // Establecimiento permanente
        const ep_es = (tercero.int & 128) || (tercero.int & 256); //Establecimiento permanente o Residente
        // Residente en la peninsula=es, ceuta-melillacanarias=np, comunitario=ue, resto del mundo=zz
        key += ep_es ? ((tercero.int & 2048) ? "es" : "np") : ((tercero.int & 2) ? "ue" : "zz");
        return key + subtipo; // complete key
    }

    this.getKeyCp = subtipo => ("cp" + subtipo);
    this.getFiscalidad = (tercero, factura) => {
        const subtipo = factura.getSubtipo(); // subtipo = tipo de ingreso de la factura
		const key = factura.isFacturable() ? self.getKeyFactura(tercero, subtipo) : self.getKeyCp(subtipo);
		return fiscalidad[key] || fiscalidad.default;
    }
}

export default new Fiscal();
