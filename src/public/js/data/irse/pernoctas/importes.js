
import eut from "./eut.js";
import rd from "./rd.js";
import upct from "./upct.js"; 

function Dietas() {
	//const self = this; //self instance
	const fnPernocta = (dieta, grupo) => dieta[grupo - 1];
	this.getImporte = (tipo, pais, grupo) => {
		if (tipo == 1) // rd 
			return fnPernocta(rd(pais), grupo); 
		if (tipo == 2) // eut
			return fnPernocta(eut(pais), grupo);
		return fnPernocta(upct(pais), grupo);
	}
}

export default new Dietas();
