
export default {
	lang: "en", // English

	//inputs errors messages
	errForm: "Form validation failed",
	errRequired: "Required field!",
	errMinlength8: "The minimum required length is 8 characters",
	errMaxlength: "Max length exceded",
	errNif: "Wrong ID format",
	errCorreo: "Wrong Mail format",
	errDate: "Wrong date format",
	errDateLt: "Date must be before than current",
	errDateLe: "Date must be less or equals than current",
	errDateGe: "Date must be greater or equals than current",
	errDateGt: "Date must be greater than current",
	errNumber: "Wrong number format",
	errGt0: "Price must be great than 0.00 €", 
	errExceeded: "exceeded amount!", 
	errFormat: "Wrong format!",
	errReclave: "Passwords typed do not match",
	errRange: "Value out of allowed range",
	notAllowed: "Value not allowed",
	notValid: "Invalid value!",
	errReport: "Error al visualizar el informe seleccionado.",
	errDownload: "No se ha podido descargar el fichero seleccionada.",
	errDoc: "No se ha podido descargar la documentación seleccionada.",
	errAdjunto: "No se ha podido descargar adjunto seleccionado.",

	//Confirm cuestions and messages
	saveOk: "Element saved successfully!",
	remove: "Are you sure to delete this element?",
	removeAll: "Are you sure to delete all elements?",
	removeOk: "Element removed successfully!",
	cancel: "Are you sure to cancel element?",
	cancelOk: "Element canceled successfully!",
	unlink: "Are you sure to unlink those elements?",
	unlinkOk: "Elements unlinked successfully!",
	linkOk: "Elements linked successfully!",
	reactivar: "¿Confirma que desea reactivar este registro?",
	msgReactivar: "¿Confirma que desea reactivar esta solicitud?",
	reactivarOk: "Registro reactivado correctamente",
	notFound: "Element not found!",
	noResults: "No results founds",
	selectOption: "Select an option",

	msgSave: "¿Confirma que desea guardar y enviar los datos seleccionados?",
	msgSend: "¿Confirma que desea firmar y enviar esta solicitud?",
	msgFirmar: "¿Confirma que desea firmar esta solicitud?",
	msgFirmarEnviar: "¿Confirma que desea firmar y enviar esta comunicación?",
	msgRechazar: "¿Confirma que desea rechazar esta solicitud?",
	msgCancelar: "¿Confirma que desea cancelar esta solicitud?", 
	msgIntegrar: "¿Confirma que desea integrar esta solicitud en UXXI-EC?",
	msgRemove: "¿Confirma que desea eliminar esta solicitud?",
	removeCom: "¿Confirma que desea eliminar esta comunicación?",
	removeOrg: "¿Confirma que desea eliminar esta orgánica de la comunicación?",
	removeRuta: "¿Confirma que desea eliminar esta etapa de la comunicación?",

	//Labels and tags
	lblAcciones: "Acciones", lblImporte: "Importe", lblImpTotal: "Importe total",

	//Collections
	msgBool: ["No", "Yes"],
	descEstados: [
		"-", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", 
		"Error Capa SOA", "Error de Crédito Vinculante", "-", "-", "-", "-", "Subsanable", "Procesando..."
	],

	//Datepicker language
	monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
}
