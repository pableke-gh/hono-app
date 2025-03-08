
export default {
	lang: "en", // English

	//PRESTO
	descTipos: [
		"Transferencia de Crédito", "Fondo de Cobertura GENCOM", "Liquidación de Contrato de Art. 83 LOU", "Generación de Crédito FA", 
		"Anticipos sobre Recaudación A83, TTPP y Cátedras", "Fondo de Cobertura", "Generación de Crédito GENCOM", "Ampliación FC"
	],
	//PRESTO

	//IRIS
	errItinerario: "Error al cumplimentar los datos del itinerario.",
	errItinerarioPaises: "Los paises de origen y de destino de las etapas no son consecutivos.",
	errItinerarioFechas: "Las fechas de salida y de llegada de las etapas no son consecutivas.",
	errItinerarioCiudad: "La ciudad de origen y de destino deben de ser distintas.",
	errMulticomision: "No puede solicitar multicomisiones para esta comunicación.",
	errTransporte: "Medio de Transporte incorrecto.",
	errMatricula: "Debe indicar la matricula del vehiculo privado.",
	msgRutasEmpty: "Aún no has añadido ninguna ETAPA a esta Comunicación.",
	msgGastosEmpty: "Aún no has añadido ningún DOCUMENTO a esta Comunicación.",
	msgTransportesEmpty: "No hay facturas / tickets asociadas a esta Comunicación.",
	msgPernoctasEmpty: "No hay pernoctas asociadas a esta Comunicación.",
	msgDietasEmpty: "No hay dietas / manutenciones asociadas a esta Comunicación.",

	docObligatoria: "Otra documentación acreditativa (Art. 61 NEP)",
	docMovilidad: "Documentación acreditativa del programa de movilidad",
	docOpcional: "Otra documentación (opcional)",

	errPerfil: "No ha seleccionado un perfil válido.",
	errOrganicas: "No se han encontrado orgánicas asociadas a la comunicación.",
	errObjeto: "Debe indicar el objeto de la actividad.",
	errOrigen: "¡No ha seleccionado correctamente la ciudad de origen!",
	errDestino: "¡No ha seleccionado correctamente la ciudad de destino!",
	errMinRutas: "El mínimo de trayectos a introducir es: 1 de ida y 1 de vuelta.",
	errFechasRuta: "¡La fecha de salida o de llegada, no es válida!",
	errFechaFutura: "¡Las fechas del itinerario deben ser anteriores a la fecha actual!",
	errFechasOrden: "¡La fecha de llegada debe ser posterior a la de salida!",
	errMainRuta: "Es necesario marcar un destino del itinerario como principal.",
	errLinkRuta: "Debe seleccionar al menos 1 etapa.",
	errJustifiSubv: "Debe indicar la relación entre la actividad y el proyecto subvencionado.",
	errJustifiVp: "Debe justificar la razón por la que usó de su vehiculo propio.",
	errJustifiKm: "Debe indicar una justificación para la diferencia de kilometraje de la comunicación.",
	errJustifiExtra: "Debe indicar una justificación para la indemnización extraordinaria.",
	errEntidadOrigen: "Debe indicar una entidad de origen para la subvención.",
	errCongreso: "Debe justificar la fecha de inicio/fin del congreso respoecto a la del viaje.",
	errEstimaciones: "Debe asociar al menos una estimación a la comunicación.",
	errFechasAloja: "No ha seleccionadas correctamente el periodo de fechas del alojamiento.",
	errRangoAloja: "El periodo de fechas del gasto de alojamiento, esta fuera del rango de la solicitud.",
	errDoc: "Debe asociar la documentación obligatoria",

	errImputacion: "Error al generar la imputación asocuada a la comunicación.",
	errMaxDietas: "Importe máximo para dietas excedido.",
	errMaxAloja: "Importe máximo por alojamiento excedido.",
	errMaxTrans: "Importe máximo por transporte excedido.",
	errMaxAsist: "Importe máximo por asistencios excedido.",
	errImpBruto: "El importe a imputar no coincide con el bruto de la comunicación.",
	errTipo: "No ha seleccionado correctamente el tipo de operación.",
	errTipoGasto: "Debe seleccionar un tipo de gasto.",
	errIban: "Debe indicar un IBAN válido.",
	errSwift: "Debe indicar un swift válido.",

	errExtra: "Debe indicar un motivo para la urgencia de esta comunicación",
	errFechaMax: "Debe indicar una fecha maxima de resolución para esta comunicación.",

	lblPorAqui: "¡Por Aquí!",
	lblPaso: "Paso", lblDe: "de", lblA: "a",
	firstDay: "Primer día", medDay: "Días Intermedios", lastDay: "Último día",
	lblDescObserv: "Descripción / observaciones:", lblDescTaxi: "Itinerario (para justificación del proyecto):",

	lblPais: "Country", lblDireccion: "Address", lblLocalidad: "Locality", lblCP: "Postal Code", lblProvincia: "Province", lblCCAA: "Administrative area",  

	// IRIS Collections
	despMun: [ "Vehículo Propio", "Transportes Públicos" ],
	despMaps: [ "Vehículo Propio", "Avión", "Tren", "Vehículo Alquiler", "Vehículo Ajeno", "Taxi Interurbano", "Bús Interurbano", "Barco", "Otros" ],
	gastosTiketIsu: [ "Peaje", "Aparcamiento", "Metro", "Taxi", "Autobús Urbano", "Tranvía", "Otros" ],
	gastosTiket: [ "Tickets de transporte (peaje, aparcamiento, etc.)" ],
	tiposDesp: ["", "Vehículo Propio", "Vehiculo de Alquiler", "Vehiculo Ajeno", "Taxi Interurbano", "Autobús Interurbano", "Tren", "Barco", "Avión", "Otros", "Transportes Públicos"],
	tiposEstimaciones: ["-", "Estimación gastos por dietas", "Estimación gastos de alojamiento", "Estimación gastos de transporte"],
	tiposMultiorganica: ["-", "Dietas", "Alojamiento", "Transporte", "Asistencias"],
	//IRIS

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

	//confirm cuestions
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
	reactivarOk: "Registro reactivado correctamente",
	notFound: "Element not found!",
	noResults: "No results founds",
	selectOption: "Select an option",

	msgSend: "¿Confirma que desea firmar y enviar esta solicitud?",
	msgFirmar: "¿Confirma que desea firmar esta solicitud?",
	msgFirmarEnviar: "¿Confirma que desea firmar y enviar esta comunicación?",
	msgRechazar: "¿Confirma que desea rechazar esta solicitud?",
	msgIntegrar: "¿Confirma que desea integrar esta solicitud en UXXI-EC?",
	msgRemove: "¿Confirma que desea eliminar esta solicitud?",
	removeCom: "¿Confirma que desea eliminar esta comunicación?",
	removeOrg: "¿Confirma que desea eliminar esta orgánica de la comunicación?",
	removeRuta: "¿Confirma que desea eliminar esta etapa de la comunicación?",

	//Collections
	msgBool: ["No", "Yes"],
	descEstados: [
		"Editable", "Accepted", "Reject", "Executed", "Integrated", "In Process", "Editable", "Cancel", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
	],

	//Datepicker language
	monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
}
