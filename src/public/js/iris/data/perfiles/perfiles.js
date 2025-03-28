
import i18n from "../../../i18n/langs.js";

const DEFAULT = "P,PDI-FU,COM,AyL,OTR"; // titulo = 0

// Titles for language
const TITULOS = {
	es: [
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio - Investigación Subvencionada",
		"Comunicación de Datos para Autorización y Anticipo por Comisión de Servicio",
		"Comunicación de Datos para Autorización y Anticipo por Comisión de Servicio - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Comisión de Servicio",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Comisión de Servicio - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Investigación Subvencionada",
		"Comunicación de Datos para Liquidación por Participación en Mesa Electoral",
		"Comunicación de Datos para Liquidación por Participación en Mesa Electoral - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación por Programa de Movilidad",
		"Comunicación de Datos y Documentación para Liquidación por Programa de Movilidad - Investigación Subvencionada",
		"Comunicación de Datos para Anticipo para Programa de Movilidad",
		"Comunicación de Datos para Anticipo para Programa de Movilidad - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Programa de Movilidad",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Programa de Movilidad - Investigación Subvencionada",
		"Solicitud de Liquidación de Movilidad exenta Art.7.j LIRPF",
		"Solicitud de Liquidación de Movilidad exenta Art.7.j LIRPF - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Asistencia a Tribunales - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Formación a Trabajadores - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Conferencias de Títulos Propios Similares - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Externos - Investigación Subvencionada",
		"Comunicación de Datos para Liquidación de Retribuciones por Conferencias de Títulos Propios y Similares - Externos",
		"Comunicación de Datos para Liquidación de Retribuciones por Colaboración Externa - Externos",
		"Comunicación de Datos para Liquidación de Retribuciones por Colaboración Externa - Externos - Investigación Subvencionada",
		"Comunicación de Datos para Liquidación de Asistencia a Tribunales - Externos",
		"Comunicación de Datos para Liquidación de Asistencia por Formación a Trabajadores - Externos",
		"Comunicación de Datos para Liquidación de Asistencia a Consejo Social - Externos",
		"Comunicación de Datos para Liquidación por Comisión de Servicio - Externos",
		"Comunicación de Datos para Liquidación por Comisión de Servicio - Externos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Externos",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Externos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Alumnos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Alumnos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Retribuciones por Colaboración Externa - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación de Retribuciones por Colaboración Externa - Alumnos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio - Alumnos - Investigación Subvencionada"
	],
	en: [
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio - Investigación Subvencionada",
		"Comunicación de Datos para Autorización y Anticipo por Comisión de Servicio",
		"Comunicación de Datos para Autorización y Anticipo por Comisión de Servicio - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Comisión de Servicio",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Comisión de Servicio - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Investigación Subvencionada",
		"Comunicación de Datos para Liquidación por Participación en Mesa Electoral",
		"Comunicación de Datos para Liquidación por Participación en Mesa Electoral - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación por Programa de Movilidad",
		"Comunicación de Datos y Documentación para Liquidación por Programa de Movilidad - Investigación Subvencionada",
		"Comunicación de Datos para Anticipo para Programa de Movilidad",
		"Comunicación de Datos para Anticipo para Programa de Movilidad - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Programa de Movilidad",
		"Comunicación de Datos y Documentación para Liquidación Previo Anticipo por Programa de Movilidad - Investigación Subvencionada",
		"Solicitud de Liquidación de Movilidad exenta Art.7.j LIRPF",
		"Solicitud de Liquidación de Movilidad exenta Art.7.j LIRPF - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Asistencia a Tribunales - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Formación a Trabajadores - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Conferencias de Títulos Propios Similares - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Externos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Externos - Investigación Subvencionada",
		"Comunicación de Datos para Liquidación de Retribuciones por Conferencias de Títulos Propios y Similares - Externos",
		"Comunicación de Datos para Liquidación de Retribuciones por Colaboración Externa - Externos",
		"Comunicación de Datos para Liquidación de Retribuciones por Colaboración Externa - Externos - Investigación Subvencionada",
		"Comunicación de Datos para Liquidación de Asistencia a Tribunales - Externos",
		"Comunicación de Datos para Liquidación de Asistencia por Formación a Trabajadores - Externos",
		"Comunicación de Datos para Liquidación de Asistencia a Consejo Social - Externos",
		"Comunicación de Datos para Liquidación por Comisión de Servicio - Externos",
		"Comunicación de Datos para Liquidación por Comisión de Servicio - Externos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Externos",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Externos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación por Desplazamiento Dentro del Término Municipal - Alumnos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio y Retribuciones por Colaboración Externa - Alumnos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Retribuciones por Colaboración Externa - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación de Retribuciones por Colaboración Externa - Alumnos - Investigación Subvencionada",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio - Alumnos",
		"Comunicación de Datos y Documentación para Liquidación de Comisión de Servicio - Alumnos - Investigación Subvencionada"
	]
}

const PERFILES = {
	"A,PAS,COM,AyL,OTR": 0, "A,PAS,COM,AyL,xOT": 0,
	"A,PAS,COM,AyL,ISU": 1, "A,PAS,COM,AyL,xSU": 1,
	"A,PAS,COM,AyL,A83": 0, "A,PAS,COM,AyL,x83": 0,
	"A,PAS,COM,AyL,ACA": 0, "A,PAS,COM,AyL,xAC": 0,

	"A,PAS,COM,AUT,OTR": 2, "A,PAS,COM,AUT,xOT": 2,
	"A,PAS,COM,AUT,ISU": 3, "A,PAS,COM,AUT,xSU": 3,
	"A,PAS,COM,AUT,A83": 2, "A,PAS,COM,AUT,x83": 2,
	"A,PAS,COM,AUT,ACA": 2, "A,PAS,COM,AUT,xAC": 2,
}

function Perfiles() {
	const self = this; //self instance

	this.getPerfil = (rol, colectivo, actividad, tramite, financiacion) => {
		const perfil = rol + "," + colectivo + "," + actividad + "," + tramite + "," + financiacion;
		return PERFILES[perfil] || 0; // default = 0
	}

	this.getTitulo = (rol, colectivo, actividad, tramite, financiacion) => {
		const perfil = self.getPerfil(rol, colectivo, actividad, tramite, financiacion);
		return TITULOS[i18n.getIsoLang()][perfil];
	}
}

export default new Perfiles();
