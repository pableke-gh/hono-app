
import i18n from "../../i18n/langs.js";

//const DEFAULT = "P,PDI-FU,COM,AyL,OTR"; // titulo = 0

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

// BD de perfiles
const PERFILES = {
	// por cuenta ajena - PAS
	"A,PAS,COM,AyL,OTR": 0, "A,PAS,COM,AyL,xOT": 0,
	"A,PAS,COM,AyL,ISU": 1, "A,PAS,COM,AyL,xSU": 1,
	"A,PAS,COM,AyL,A83": 0, "A,PAS,COM,AyL,x83": 0,
	"A,PAS,COM,AyL,ACA": 0, "A,PAS,COM,AyL,xAC": 0,

	"A,PAS,COM,AUT,OTR": 2, "A,PAS,COM,AUT,xOT": 2,
	"A,PAS,COM,AUT,ISU": 3, "A,PAS,COM,AUT,xSU": 3,
	"A,PAS,COM,AUT,A83": 2, "A,PAS,COM,AUT,x83": 2,
	"A,PAS,COM,AUT,ACA": 2, "A,PAS,COM,AUT,xAC": 2,

	"A,PAS,COM,LIQ,OTR": 4, "A,PAS,COM,LIQ,xOT": 4,
	"A,PAS,COM,LIQ,ISU": 5, "A,PAS,COM,LIQ,xSU": 5,
	"A,PAS,COM,LIQ,A83": 4, "A,PAS,COM,LIQ,x83": 4,
	"A,PAS,COM,LIQ,ACA": 4, "A,PAS,COM,LIQ,xAC": 4,

	"A,PAS,MUN,AyL,OTR": 6, "A,PAS,MUN,AyL,xOT": 6,
	"A,PAS,MUN,AyL,ISU": 7, "A,PAS,MUN,AyL,xSU": 7,
	"A,PAS,MUN,AyL,A83": 6, "A,PAS,MUN,AyL,x83": 6,
	"A,PAS,MUN,AyL,ACA": 6, "A,PAS,MUN,AyL,xAC": 6,
	"A,PAS,MES,AyL,OTR": 8,

	"A,PAS,MOV,AyL,OTR": 10, "A,PAS,MOV,AyL,xOT": 10,
	"A,PAS,MOV,AyL,ISU": 11, "A,PAS,MOV,AyL,xSU": 11,
	"A,PAS,MOV,AUT,OTR": 12, "A,PAS,MOV,AUT,xOT": 12,
	"A,PAS,MOV,AUT,ISU": 13, "A,PAS,MOV,AUT,xSU": 13,
	"A,PAS,MOV,LIQ,OTR": 14, "A,PAS,MOV,LIQ,xOT": 14,
	"A,PAS,MOV,LIQ,ISU": 15, "A,PAS,MOV,LIQ,xSU": 15,
	"A,PAS,A7J,AyL,OTR": 10,
	"A,PAS,A7J,AyL,ISU": 11,

	//por cuenta ajena - PDI-FU
	"A,PDI-FU,COM,AyL,OTR": 0, "A,PDI-FU,COM,AyL,xOT": 0,
	"A,PDI-FU,COM,AyL,ISU": 1, "A,PDI-FU,COM,AyL,xSU": 1,
	"A,PDI-FU,COM,AyL,A83": 0, "A,PDI-FU,COM,AyL,x83": 0,
	"A,PDI-FU,COM,AyL,ACA": 0, "A,PDI-FU,COM,AyL,xAC": 0,

	"A,PDI-FU,COM,AUT,OTR": 2, "A,PDI-FU,COM,AUT,xOT": 2,
	"A,PDI-FU,COM,AUT,ISU": 3, "A,PDI-FU,COM,AUT,xSU": 3,
	"A,PDI-FU,COM,AUT,A83": 2, "A,PDI-FU,COM,AUT,x83": 2,
	"A,PDI-FU,COM,AUT,ACA": 2, "A,PDI-FU,COM,AUT,xAC": 2,

	"A,PDI-FU,COM,LIQ,OTR": 4, "A,PDI-FU,COM,LIQ,xOT": 4,
	"A,PDI-FU,COM,LIQ,ISU": 5, "A,PDI-FU,COM,LIQ,xSU": 5,
	"A,PDI-FU,COM,LIQ,A83": 4, "A,PDI-FU,COM,LIQ,x83": 4,
	"A,PDI-FU,COM,LIQ,ACA": 4, "A,PDI-FU,COM,LIQ,xAC": 4,

	"A,PDI-FU,MUN,AyL,OTR": 6, "A,PDI-FU,MUN,AyL,xOT": 6,
	"A,PDI-FU,MUN,AyL,ISU": 7, "A,PDI-FU,MUN,AyL,xSU": 7,
	"A,PDI-FU,MUN,AyL,A83": 6, "A,PDI-FU,MUN,AyL,x83": 6,
	"A,PDI-FU,MUN,AyL,ACA": 6, "A,PDI-FU,MUN,AyL,xAC": 6,
	"A,PDI-FU,MES,AyL,OTR": 8,

	"A,PDI-FU,MOV,AyL,OTR": 10, "A,PDI-FU,MOV,AyL,xOT": 10,
	"A,PDI-FU,MOV,AyL,ISU": 11, "A,PDI-FU,MOV,AyL,xSU": 11,
	"A,PDI-FU,MOV,AUT,OTR": 12, "A,PDI-FU,MOV,AUT,xOT": 12,
	"A,PDI-FU,MOV,AUT,ISU": 13, "A,PDI-FU,MOV,AUT,xSU": 13,
	"A,PDI-FU,MOV,LIQ,OTR": 14, "A,PDI-FU,MOV,LIQ,xOT": 14,
	"A,PDI-FU,MOV,LIQ,ISU": 15, "A,PDI-FU,MOV,LIQ,xSU": 15,
	"A,PDI-FU,A7J,AyL,OTR": 16,
	"A,PDI-FU,A7J,AyL,ISU": 17,

	//por cuenta ajena - PDI-LA
	"A,PDI-LA,COM,AyL,OTR": 0, "A,PDI-LA,COM,AyL,xOT": 0,
	"A,PDI-LA,COM,AyL,ISU": 1, "A,PDI-LA,COM,AyL,xSU": 1,
	"A,PDI-LA,COM,AyL,A83": 0, "A,PDI-LA,COM,AyL,x83": 0,
	"A,PDI-LA,COM,AyL,ACA": 0, "A,PDI-LA,COM,AyL,xAC": 0,

	"A,PDI-LA,COM,AUT,OTR": 2, "A,PDI-LA,COM,AUT,xOT": 2,
	"A,PDI-LA,COM,AUT,ISU": 3, "A,PDI-LA,COM,AUT,xSU": 3,
	"A,PDI-LA,COM,AUT,A83": 2, "A,PDI-LA,COM,AUT,x83": 2,
	"A,PDI-LA,COM,AUT,ACA": 2, "A,PDI-LA,COM,AUT,xAC": 2,

	"A,PDI-LA,COM,LIQ,OTR": 4, "A,PDI-LA,COM,LIQ,xOT": 4,
	"A,PDI-LA,COM,LIQ,ISU": 5, "A,PDI-LA,COM,LIQ,xSU": 5,
	"A,PDI-LA,COM,LIQ,A83": 4, "A,PDI-LA,COM,LIQ,x83": 4,
	"A,PDI-LA,COM,LIQ,ACA": 4, "A,PDI-LA,COM,LIQ,xAC": 4,

	"A,PDI-LA,MUN,AyL,OTR": 6, "A,PDI-LA,MUN,AyL,xOT": 6,
	"A,PDI-LA,MUN,AyL,ISU": 7, "A,PDI-LA,MUN,AyL,xSU": 7,
	"A,PDI-LA,MUN,AyL,A83": 6, "A,PDI-LA,MUN,AyL,x83": 6,
	"A,PDI-LA,MUN,AyL,ACA": 6, "A,PDI-LA,MUN,AyL,xAC": 6,
	"A,PDI-LA,MES,AyL,OTR": 8,

	"A,PDI-LA,MOV,AyL,OTR": 10, "A,PDI-LA,MOV,AyL,xOT": 10,
	"A,PDI-LA,MOV,AyL,ISU": 11, "A,PDI-LA,MOV,AyL,xSU": 11,
	"A,PDI-LA,MOV,AUT,OTR": 12, "A,PDI-LA,MOV,AUT,xOT": 12,
	"A,PDI-LA,MOV,AUT,ISU": 13, "A,PDI-LA,MOV,AUT,xSU": 13,
	"A,PDI-LA,MOV,LIQ,OTR": 14, "A,PDI-LA,MOV,LIQ,xOT": 14,
	"A,PDI-LA,MOV,LIQ,ISU": 15, "A,PDI-LA,MOV,LIQ,xSU": 15,
	"A,PDI-LA,A7J,AyL,OTR": 16,
	"A,PDI-LA,A7J,AyL,ISU": 17,

	//por cuenta ajena - BPE
	"A,BPE,COM,AyL,OTR": 0, "A,BPE,COM,AyL,xOT": 0,
	"A,BPE,COM,AyL,ISU": 1, "A,BPE,COM,AyL,xSU": 1,
	"A,BPE,COM,AyL,A83": 0, "A,BPE,COM,AyL,x83": 0,
	"A,BPE,COM,AyL,ACA": 0, "A,BPE,COM,AyL,xAC": 0,

	"A,BPE,COM,AUT,OTR": 2, "A,BPE,COM,AUT,xOT": 2,
	"A,BPE,COM,AUT,ISU": 3, "A,BPE,COM,AUT,xSU": 3,
	"A,BPE,COM,AUT,A83": 2, "A,BPE,COM,AUT,x83": 2,
	"A,BPE,COM,AUT,ACA": 2, "A,BPE,COM,AUT,xAC": 2,

	"A,BPE,COM,LIQ,OTR": 4, "A,BPE,COM,LIQ,xOT": 4,
	"A,BPE,COM,LIQ,ISU": 5, "A,BPE,COM,LIQ,xSU": 5,
	"A,BPE,COM,LIQ,A83": 4, "A,BPE,COM,LIQ,x83": 4,
	"A,BPE,COM,LIQ,ACA": 4, "A,BPE,COM,LIQ,xAC": 4,

	"A,BPE,MUN,AyL,OTR": 6, "A,BPE,MUN,AyL,xOT": 6,
	"A,BPE,MUN,AyL,ISU": 7, "A,BPE,MUN,AyL,xSU": 7,
	"A,BPE,MUN,AyL,A83": 6, "A,BPE,MUN,AyL,x83": 6,
	"A,BPE,MUN,AyL,ACA": 6, "A,BPE,MUN,AyL,xAC": 6,
	"A,BPE,MES,AyL,OTR": 8,

	"A,BPE,MOV,AyL,OTR": 10, "A,BPE,MOV,AyL,xOT": 10,
	"A,BPE,MOV,AyL,ISU": 11, "A,BPE,MOV,AyL,xSU": 11,
	"A,BPE,MOV,AUT,OTR": 12, "A,BPE,MOV,AUT,xOT": 12,
	"A,BPE,MOV,AUT,ISU": 13, "A,BPE,MOV,AUT,xSU": 13,
	"A,BPE,MOV,LIQ,OTR": 14, "A,BPE,MOV,LIQ,xOT": 14,
	"A,BPE,MOV,LIQ,ISU": 15, "A,BPE,MOV,LIQ,xSU": 15,
	"A,BPE,A7J,AyL,OTR": 16,
	"A,BPE,A7J,AyL,ISU": 17,

	//por cuenta ajena - PIN
	"A,PIN,COM,AyL,OTR": 0, "A,PIN,COM,AyL,xOT": 0,
	"A,PIN,COM,AyL,ISU": 1, "A,PIN,COM,AyL,xSU": 1,
	"A,PIN,COM,AyL,A83": 0, "A,PIN,COM,AyL,x83": 0,
	"A,PIN,COM,AyL,ACA": 0, "A,PIN,COM,AyL,xAC": 0,

	"A,PIN,COM,AUT,OTR": 2, "A,PIN,COM,AUT,xOT": 2,
	"A,PIN,COM,AUT,ISU": 3, "A,PIN,COM,AUT,xSU": 3,
	"A,PIN,COM,AUT,A83": 2, "A,PIN,COM,AUT,x83": 2,
	"A,PIN,COM,AUT,ACA": 2, "A,PIN,COM,AUT,xAC": 2,

	"A,PIN,COM,LIQ,OTR": 4, "A,PIN,COM,LIQ,xOT": 4,
	"A,PIN,COM,LIQ,ISU": 5, "A,PIN,COM,LIQ,xSU": 5,
	"A,PIN,COM,LIQ,A83": 4, "A,PIN,COM,LIQ,x83": 4,
	"A,PIN,COM,LIQ,ACA": 4, "A,PIN,COM,LIQ,xAC": 4,

	"A,PIN,MUN,AyL,OTR": 6, "A,PIN,MUN,AyL,xOT": 6,
	"A,PIN,MUN,AyL,ISU": 7, "A,PIN,MUN,AyL,xSU": 7,
	"A,PIN,MUN,AyL,A83": 6, "A,PIN,MUN,AyL,x83": 6,
	"A,PIN,MUN,AyL,ACA": 6, "A,PIN,MUN,AyL,xAC": 6,
	"A,PIN,MES,AyL,OTR": 8,

	"A,PIN,MOV,AyL,OTR": 10, "A,PIN,MOV,AyL,xOT": 10,
	"A,PIN,MOV,AyL,ISU": 11, "A,PIN,MOV,AyL,xSU": 11,
	"A,PIN,MOV,AUT,OTR": 12, "A,PIN,MOV,AUT,xOT": 12,
	"A,PIN,MOV,AUT,ISU": 13, "A,PIN,MOV,AUT,xSU": 13,
	"A,PIN,MOV,LIQ,OTR": 14, "A,PIN,MOV,LIQ,xOT": 14,
	"A,PIN,MOV,LIQ,ISU": 15, "A,PIN,MOV,LIQ,xSU": 15,
	"A,PIN,A7J,AyL,OTR": 16,
	"A,PIN,A7J,AyL,ISU": 17,

	//por cuenta ajena - EXT
	"A,EXT,IAE+ATR,AyL,OTR": 18, "A,EXT,IAE+ATR,AyL,xOT": 18,
	"A,EXT,IAE+AFO,AyL,OTR": 19, "A,EXT,IAE+AFO,AyL,xOT": 19,
	"A,EXT,IAE+CTP,AyL,ACA": 20, "A,EXT,IAE+CTP,AyL,xAC": 20,

	"A,EXT,IAE+OCE,AyL,OTR": 21, "A,EXT,IAE+OCE,AyL,xOT": 21,
	"A,EXT,IAE+OCE,AyL,ISU": 22, "A,EXT,IAE+OCE,AyL,xSU": 22,
	"A,EXT,IAE+OCE,AyL,A83": 21, "A,EXT,IAE+OCE,AyL,x83": 21,
	"A,EXT,IAE+OCE,AyL,ACA": 21, "A,EXT,IAE+OCE,AyL,xAC": 20,

	"A,EXT,OCE,AyL,OTR": 24, "A,EXT,OCE,AyL,xOT": 24,
	"A,EXT,OCE,AyL,ISU": 25, "A,EXT,OCE,AyL,xSU": 25,
	"A,EXT,OCE,AyL,A83": 24, "A,EXT,OCE,AyL,x83": 24,
	"A,EXT,OCE,AyL,ACA": 24, "A,EXT,OCE,AyL,xAC": 24,

	"A,EXT,ATR,AyL,OTR": 26, "A,EXT,ATR,AyL,xOT": 26,
	"A,EXT,AFO,AyL,OTR": 27, "A,EXT,AFO,AyL,xOT": 27,
	"A,EXT,CTP,AyL,ACA": 23, "A,EXT,CTP,AyL,xAC": 23,
	"A,EXT,ACS,AyL,OTR": 28,

	"A,EXT,IAE,AyL,OTR": 29, "A,EXT,IAE,AyL,xOT": 29,
	"A,EXT,IAE,AyL,ISU": 30, "A,EXT,IAE,AyL,xSU": 30,
	"A,EXT,IAE,AyL,A83": 29, "A,EXT,IAE,AyL,x83": 29,
	"A,EXT,IAE,AyL,ACA": 29, "A,EXT,IAE,AyL,xAC": 29,

	"A,EXT,MUN,AyL,OTR": 31, "A,EXT,MUN,AyL,xOT": 31,
	"A,EXT,MUN,AyL,ISU": 32, "A,EXT,MUN,AyL,xSU": 32,
	"A,EXT,MUN,AyL,A83": 31, "A,EXT,MUN,AyL,x83": 31,
	"A,EXT,MUN,AyL,ACA": 31, "A,EXT,MUN,AyL,xAC": 31,

	//por cuenta ajena - ALU
	"A,ALU,MUN,AyL,OTR": 33, "A,ALU,MUN,AyL,xOT": 33,
	"A,ALU,MUN,AyL,ISU": 34, "A,ALU,MUN,AyL,xSU": 34,
	"A,ALU,MUN,AyL,A83": 33, "A,ALU,MUN,AyL,x83": 33,
	"A,ALU,MUN,AyL,ACA": 33, "A,ALU,MUN,AyL,xAC": 33,
	"A,ALU,MES,AyL,OTR": 9,

	"A,ALU,IAE+OCE,AyL,OTR": 35, "A,ALU,IAE+OCE,AyL,xOT": 35,
	"A,ALU,IAE+OCE,AyL,ISU": 36, "A,ALU,IAE+OCE,AyL,xSU": 36,
	"A,ALU,IAE+OCE,AyL,A83": 35, "A,ALU,IAE+OCE,AyL,x83": 35,
	"A,ALU,IAE+OCE,AyL,ACA": 35, "A,ALU,IAE+OCE,AyL,xAC": 35,

	"A,ALU,OCE,AyL,OTR": 37, "A,ALU,OCE,AyL,xOT": 37,
	"A,ALU,OCE,AyL,ISU": 38, "A,ALU,OCE,AyL,xSU": 38,
	"A,ALU,OCE,AyL,A83": 37, "A,ALU,OCE,AyL,x83": 37,
	"A,ALU,OCE,AyL,ACA": 37, "A,ALU,OCE,AyL,xAC": 37,

	"A,ALU,IAE,AyL,OTR": 39, "A,ALU,IAE,AyL,xOT": 39,
	"A,ALU,IAE,AyL,ISU": 40, "A,ALU,IAE,AyL,xSU": 40,
	"A,ALU,IAE,AyL,A83": 39, "A,ALU,IAE,AyL,x83": 39,
	"A,ALU,IAE,AyL,ACA": 39, "A,ALU,IAE,AyL,xAC": 39,

	//por cuenta propia - PAS
	"P,PAS,COM,AyL,OTR": 0,  "P,PAS,MUN,AyL,OTR": 6, 
	"P,PAS,COM,AyL,ISU": 1,  "P,PAS,MUN,AyL,ISU": 7, 
	"P,PAS,COM,AyL,A83": 0,  "P,PAS,MUN,AyL,A83": 6, 
	"P,PAS,COM,AyL,ACA": 0,  "P,PAS,MUN,AyL,ACA": 6, 

	//por cuenta propia - PDI-FU
	"P,PDI-FU,COM,AyL,OTR": 0, "P,PDI-FU,MUN,AyL,OTR": 6,
	"P,PDI-FU,COM,AyL,ISU": 1, "P,PDI-FU,MUN,AyL,ISU": 7,
	"P,PDI-FU,COM,AyL,A83": 0, "P,PDI-FU,MUN,AyL,A83": 6,
	"P,PDI-FU,COM,AyL,ACA": 0, "P,PDI-FU,MUN,AyL,ACA": 6,

	//por cuenta propia - PDI-LA
	"P,PDI-LA,COM,AyL,OTR": 0, "P,PDI-LA,MUN,AyL,OTR": 6,
	"P,PDI-LA,COM,AyL,ISU": 1, "P,PDI-LA,MUN,AyL,ISU": 7,
	"P,PDI-LA,COM,AyL,A83": 0, "P,PDI-LA,MUN,AyL,A83": 6,
	"P,PDI-LA,COM,AyL,ACA": 0, "P,PDI-LA,MUN,AyL,ACA": 6,

	//por cuenta propia - BPE
	"P,BPE,COM,AyL,OTR": 0, "P,BPE,MUN,AyL,OTR": 6,
	"P,BPE,COM,AyL,ISU": 1, "P,BPE,MUN,AyL,ISU": 7,
	"P,BPE,COM,AyL,A83": 0, "P,BPE,MUN,AyL,A83": 6,
	"P,BPE,COM,AyL,ACA": 0, "P,BPE,MUN,AyL,ACA": 6,

	//por cuenta propia - PIN
	"P,PIN,COM,AyL,OTR": 0, "P,PIN,MUN,AyL,OTR": 6,
	"P,PIN,COM,AyL,ISU": 1, "P,PIN,MUN,AyL,ISU": 7,
	"P,PIN,COM,AyL,A83": 0, "P,PIN,MUN,AyL,A83": 6,
	"P,PIN,COM,AyL,ACA": 0, "P,PIN,MUN,AyL,ACA": 6,
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
