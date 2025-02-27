
const DEFAULT = 0b0000000000011; //default = COM/MUN 

//BD actividades
const ACTIVIDADES = {
    //por cuenta ajena - PAS
    "A,PAS,OTR": 0b1100000000111,
    "A,PAS,xOT": 0b1000000000011, 
    "A,PAS,ISU": 0b1100000000011,
    "A,PAS,xSU": 0b1000000000011, 

    //por cuenta ajena - PDI-FU
    "A,PDI-FU,OTR": 0b1100000000111,
    "A,PDI-FU,xOT": 0b1000000000011, 
    "A,PDI-FU,ISU": 0b1100000000011,
    "A,PDI-FU,xSU": 0b1000000000011, 

    //por cuenta ajena - PDI-LA
    "A,PDI-LA,OTR": 0b1100000000111,
    "A,PDI-LA,xOT": 0b1000000000011, 
    "A,PDI-LA,ISU": 0b1100000000011,
    "A,PDI-LA,xSU": 0b1000000000011, 

    //por cuenta ajena - BPE
    "A,BPE,OTR": 0b1100000000111,
    "A,BPE,xOT": 0b1000000000011, 
    "A,BPE,ISU": 0b1100000000011,
    "A,BPE,xSU": 0b1000000000011, 

    //por cuenta ajena - PIN
    "A,PIN,OTR": 0b1100000000111,
    "A,PIN,xOT": 0b1000000000011, 
    "A,PIN,ISU": 0b1100000000011,
    "A,PIN,xSU": 0b1000000000011, 

    //por cuenta ajena - EXT
    "A,EXT,OTR": 0b0011111111010,
    "A,EXT,xOT": 0b0011011111010, 
    "A,EXT,ISU": 0b0011000001010,
    "A,EXT,xSU": 0b0011000001010, 
    "A,EXT,A83": 0b0011000001010,
    "A,EXT,x83": 0b0011000001010, 
    "A,EXT,ACA": 0b0011000001010,
    "A,EXT,xAC": 0b0011000001010, 

    //por cuenta ajena - ALU
    "A,ALU,OTR": 0b0011000001110,
    "A,ALU,xOT": 0b0011000001010, 
    "A,ALU,ISU": 0b0011000001010,
    "A,ALU,xSU": 0b0011000001010, 
    "A,ALU,A83": 0b0011000001010,
    "A,ALU,x83": 0b0011000001010, 
    "A,ALU,ACA": 0b0011000001010,
    "A,ALU,xAC": 0b0011000001010
}

const PERFILES = {
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
	en: []
}

export default (rol, col, fin) => ACTIVIDADES[rol + "," + col + "," + fin] || DEFAULT;
