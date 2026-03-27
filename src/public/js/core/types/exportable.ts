
import FormData from "../../components/forms/FormData.js";

// Interface for inputs elements
export default interface Exportable {
	getValue(): any;
	setValue(value: any): Exportable;
	load(data: any): Exportable;
	toData(data: any): Exportable;
	addFormData(fd: FormData): Exportable;
}
