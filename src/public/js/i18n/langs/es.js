
export default {
	lang: "es", // Spanish

	//inputs errors messages
	errForm: "Error al validar los campos del formulario",
	errRequired: "¡Campo obligatorio!",
	errMinlength8: "La longitud mínima requerida es de 8 caracteres",
	errMaxlength: "Longitud máxima excedida",
	errNif: "Formato de NIF / CIF incorrecto",
	errCorreo: "Formato de E-Mail incorrecto",
	errDate: "Formato de fecha incorrecto",
	errDateLt: "La fecha debe ser anterior a la actual",
	errDateLe: "La fecha debe ser menor o igual a la actual",
	errDateGe: "La fecha debe ser mayor o igual a la actual",
	errDateGt: "La fecha debe ser mayor a la actual",
	errNumber: "Valor no numérico",
	errGt0: "El importe debe ser mayor de 0,00 €", 
	errExceeded: "Importe excedido", 
	errFormat: "¡Formato incorrecto!",
	errReclave: "Las claves introducidas no coinciden",
	errRange: "Valor fuera del rango permitido",
	notAllowed: "Valor no permitido",
	notValid: "Valor Incorrecto",
	errReport: "Error al visualizar el informe seleccionado.",
	errDownload: "No se ha podido descargar el fichero seleccionada.",
	errDoc: "No se ha podido descargar la documentación seleccionada.",
	errAdjunto: "No se ha podido descargar adjunto seleccionado.",

	//Confirm cuestions and messages
	saveOk: "Datos actualizados correctamente",
	remove: "¿Confirma que desea eliminar este registro?",
	removeAll: "¿Confirma que desea eliminar todos los elementos?",
	removeOk: "Registro eliminado correctamente.",
	cancel: "¿Confirma que desea cancelar este registro?",
	cancelOk: "Elemento cancelado correctamente.",
	unlink: "¿Confirma que desea desasociar el registro seleccionado?",
	unlinkOk: "Registro desasociado correctamente",
	linkOk: "Registros asociados correctamente.",
	reactivar: "¿Confirma que desea reactivar este registro?",
	msgReactivar: "¿Confirma que desea reactivar esta solicitud?",
	reactivarOk: "Registro reactivado correctamente",
	notFound: "Elemento no encontrado en el sistema",
	noResults: "No se han encontrado registros asociados",
	selectOptions: "Seleccione las opciones...",
	selectOption: "Seleccione un opción",

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
	msgBool: ["No", "Si"],
	descEstados: [
		"-", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", 
		"Error Capa SOA", "Error de Crédito Vinculante", "-", "-", "-", "-", "Subsanable", "Procesando..."
	],

	//Datepicker language
	monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
	monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
	dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
	dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
	dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
}
