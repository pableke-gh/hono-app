
import coll from "../../components/Collection.js";
import sb from "../../components/StringBox.js";

function Organica() {
	this.getFinanciacion = organicas => {
		let result = "OTR"; //default fin.
		if (coll.isEmpty(organicas))
			return result; // default value
		const ORG_300518 = "300518";
		organicas.forEach(org => {
			result = (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8)) ? "ISU" : result; //apli=642
			result = (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16) && (result != "ISU")) ? "A83" : result; //apli=643
			result = ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920")) && (result == "OTR")) ? "ACA" : result; //TTPP o Master
		});
		if (organicas.length > 1) {
			if (result == "ISU") return "xSU"; 
			if (result == "A83") return "x83"; 
			if (result == "ACA") return "xAC"; 
			return "xOT";
		}
		return result;
	}
}

export default new Organica();
