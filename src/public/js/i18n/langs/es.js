
export default {
	lang: "es", // Spanish

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
	errMatricula: "Debe indicar la matricual del vehiculo privado.",

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

	lblPais: "País", lblDireccion: "Dirección", lblLocalidad: "Localidad", lblCP: "Código Postal", lblProvincia: "Provincia", lblCCAA: "Comunidad Autónoma",

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

	//confirm cuestions
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
	reactivarOk: "Registro reactivado correctamente",
	notFound: "Elemento no encontrado en el sistema",
	noResults: "No se han encontrado registros asociados",
	selectOption: "Seleccione un opción",

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
	msgBool: ["No", "Si"],
	descEstados: [
		"Editable", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
	],

	//Datepicker language
	monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
	monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
	dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
	dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
	dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
}
