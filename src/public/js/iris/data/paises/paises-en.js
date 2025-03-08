
const DEFAULT = "Rest of the world";
const ENGLAND = "United Kingdom";

const PAISES = {
	"ES":    [53.3400, 53.34], //España
	"DE":    [91.350, 91.350], //Alemania
	"AD":    [91.350, 91.350], //Andorra
	"AO":    [91.350, 91.350], //Angola
	"SA":    [91.350, 91.350], //Arabia Saudita
	"DZ":    [91.350, 91.350], //Argelia
	"AR":    [91.350, 91.350], //Argentina
	"AU":    [91.350, 91.350], //Australia
	"AT":    [91.350, 91.350], //Austria
	"BE":    [91.350, 91.350], //Bélgica
	"BO":    [91.350, 91.350], //Bolivia
	"BA":    [91.350, 91.350], //Bosnia-Herzegovina
	"BR":    [91.350, 91.350], //Brasil
	"BG":    [91.350, 91.350], //Bulgaria
	"CM":    [91.350, 91.350], //Camerún
	"CA":    [91.350, 91.350], //Canadá
	"CL":    [91.350, 91.350], //Chile
	"CN":    [91.350, 91.350], //China
	"CO":    [91.350, 91.350], //Colombia
	"KR":    [91.350, 91.350], //Corea
	"CI":    [91.350, 91.350], //Costa de Marfil
	"CR":    [91.350, 91.350], //Costa Rica
	"HR":    [91.350, 91.350], //Croacia
	"CU":    [91.350, 91.350], //Cuba
	"DK":    [91.350, 91.350], //Dinamarca
	"DO":    [91.350, 91.350], //República Dominicana
	"EC":    [91.350, 91.350], //Ecuador
	"EG":    [91.350, 91.350], //Egipto
	"SV":    [91.350, 91.350], //El Salvador
	"AE":    [91.350, 91.350], //Emiratos Árabes Unidos
	"SK":    [91.350, 91.350], //Eslovaquia
	"US":    [91.350, 91.350], //Estados Unidos
	"ET":    [91.350, 91.350], //Etiopía
	"PH":    [91.350, 91.350], //Filipinas
	"FI":    [91.350, 91.350], //Finlandia
	"FR":    [91.350, 91.350], //Francia
	"GA":    [91.350, 91.350], //Gabón
	"GH":    [91.350, 91.350], //Ghana
	"GR":    [91.350, 91.350], //Grecia
	"GT":    [91.350, 91.350], //Guatemala
	"GQ":    [91.350, 91.350], //Guinea Ecuatorial
	"HT":    [91.350, 91.350], //Haití
	"HN":    [91.350, 91.350], //Honduras
	"HK":    [91.350, 91.350], //Hong-Kong
	"HU":    [91.350, 91.350], //Hungría
	"IN":    [91.350, 91.350], //India
	"ID":    [91.350, 91.350], //Indonesia
	"IQ":    [91.350, 91.350], //Irak
	"IR":    [91.350, 91.350], //Irán
	"IE":    [91.350, 91.350], //Irlanda
	"IL":    [91.350, 91.350], //Israel
	"IT":    [91.350, 91.350], //Italia
	"JM":    [91.350, 91.350], //Jamaica
	"JP":    [91.350, 91.350], //Japón
	"JO":    [91.350, 91.350], //Jordania
	"KE":    [91.350, 91.350], //Kenia
	"KW":    [91.350, 91.350], //Kuwait
	"LB":    [91.350, 91.350], //Líbano
	"LY":    [91.350, 91.350], //Libia
	"LU":    [91.350, 91.350], //Luxemburgo
	"MY":    [91.350, 91.350], //Malasia
	"MT":    [91.350, 91.350], //Malta
	"MA":    [91.350, 91.350], //Marruecos
	"MR":    [91.350, 91.350], //Mauritania
	"MX":    [91.350, 91.350], //Méjico
	"MZ":    [91.350, 91.350], //Mozambique
	"NI":    [91.350, 91.350], //Nicaragua
	"NG":    [91.350, 91.350], //Nigeria
	"NO":    [91.350, 91.350], //Noruega
	"NZ":    [91.350, 91.350], //Nueva Zelanda
	"NL":    [91.350, 91.350], //Países Bajos
	"PK":    [91.350, 91.350], //Pakistán
	"PA":    [91.350, 91.350], //Panamá
	"PY":    [91.350, 91.350], //Paraguay
	"PE":    [91.350, 91.350], //Perú
	"PL":    [91.350, 91.350], //Polonia
	"PT":    [91.350, 91.350], //Portugal
	"UK":    ENGLAND, "GB": ENGLAND, //Reino unido   
	"CZ":    [91.350, 91.350], //República Checa
	"RO":    [91.350, 91.350], //Rumanía
	"RU":    [91.350, 91.350], //Rusia
	"SN":    [91.350, 91.350], //Senegal
	"CS":    [91.350, 91.350], //Serbia y Montenegro
	"SG":    [91.350, 91.350], //Singapur
	"SY":    [91.350, 91.350], //Siria
	"ZA":    [91.350, 91.350], //Sudáfrica
	"SE":    [91.350, 91.350], //Suecia
	"CH":    [91.350, 91.350], //Suiza
	"TH":    [91.350, 91.350], //Tailandia
	"TW":    [91.350, 91.350], //Taiwan
	"TZ":    [91.350, 91.350], //Tanzania
	"TN":    [91.350, 91.350], //Túnez
	"TR":    [91.350, 91.350], //Turquía
	"UY":    [91.350, 91.350], //Uruguay
	"VE":    [91.350, 91.350], //Venezuela
	"YE":    [91.350, 91.350], //Yemen
	"ZR":    [91.350, 91.350], //Zaire/Congo
	"ZW":    [91.350, 91.350], //Zimbawe
}

const REGIONES = {
	"ES":    [53.3400, 53.34], //España
	"ES-MD": [53.3400, 53.34], //España (Madrid)
	"ES-BA": [53.3400, 53.34], //España (Barcelona)
	"DE":    [91.350, 91.350], //Alemania
	"AD":    [91.350, 91.350], //Andorra
	"AO":    [91.350, 91.350], //Angola
	"SA":    [91.350, 91.350], //Arabia Saudita
	"DZ":    [91.350, 91.350], //Argelia
	"AR":    [91.350, 91.350], //Argentina
	"AU":    [91.350, 91.350], //Australia
	"AT":    [91.350, 91.350], //Austria
	"BE":    [91.350, 91.350], //Bélgica
	"BO":    [91.350, 91.350], //Bolivia
	"BA":    [91.350, 91.350], //Bosnia-Herzegovina
	"BR":    [91.350, 91.350], //Brasil
	"BG":    [91.350, 91.350], //Bulgaria
	"CM":    [91.350, 91.350], //Camerún
	"CA":    [91.350, 91.350], //Canadá
	"CL":    [91.350, 91.350], //Chile
	"CN":    [91.350, 91.350], //China
	"CO":    [91.350, 91.350], //Colombia
	"KR":    [91.350, 91.350], //Corea
	"CI":    [91.350, 91.350], //Costa de Marfil
	"CR":    [91.350, 91.350], //Costa Rica
	"HR":    [91.350, 91.350], //Croacia
	"CU":    [91.350, 91.350], //Cuba
	"DK":    [91.350, 91.350], //Dinamarca
	"DO":    [91.350, 91.350], //República Dominicana
	"EC":    [91.350, 91.350], //Ecuador
	"EG":    [91.350, 91.350], //Egipto
	"SV":    [91.350, 91.350], //El Salvador
	"AE":    [91.350, 91.350], //Emiratos Árabes Unidos
	"SK":    [91.350, 91.350], //Eslovaquia
	"US":    [91.350, 91.350], //Estados Unidos
	"ET":    [91.350, 91.350], //Etiopía
	"PH":    [91.350, 91.350], //Filipinas
	"FI":    [91.350, 91.350], //Finlandia
	"FR":    [91.350, 91.350], //Francia
	"GA":    [91.350, 91.350], //Gabón
	"GH":    [91.350, 91.350], //Ghana
	"GR":    [91.350, 91.350], //Grecia
	"GT":    [91.350, 91.350], //Guatemala
	"GQ":    [91.350, 91.350], //Guinea Ecuatorial
	"HT":    [91.350, 91.350], //Haití
	"HN":    [91.350, 91.350], //Honduras
	"HK":    [91.350, 91.350], //Hong-Kong
	"HU":    [91.350, 91.350], //Hungría
	"IN":    [91.350, 91.350], //India
	"ID":    [91.350, 91.350], //Indonesia
	"IQ":    [91.350, 91.350], //Irak
	"IR":    [91.350, 91.350], //Irán
	"IE":    [91.350, 91.350], //Irlanda
	"IL":    [91.350, 91.350], //Israel
	"IT":    [91.350, 91.350], //Italia
	"JM":    [91.350, 91.350], //Jamaica
	"JP":    [91.350, 91.350], //Japón
	"JO":    [91.350, 91.350], //Jordania
	"KE":    [91.350, 91.350], //Kenia
	"KW":    [91.350, 91.350], //Kuwait
	"LB":    [91.350, 91.350], //Líbano
	"LY":    [91.350, 91.350], //Libia
	"LU":    [91.350, 91.350], //Luxemburgo
	"MY":    [91.350, 91.350], //Malasia
	"MT":    [91.350, 91.350], //Malta
	"MA":    [91.350, 91.350], //Marruecos
	"MR":    [91.350, 91.350], //Mauritania
	"MX":    [91.350, 91.350], //Méjico
	"MZ":    [91.350, 91.350], //Mozambique
	"NI":    [91.350, 91.350], //Nicaragua
	"NG":    [91.350, 91.350], //Nigeria
	"NO":    [91.350, 91.350], //Noruega
	"NZ":    [91.350, 91.350], //Nueva Zelanda
	"NL":    [91.350, 91.350], //Países Bajos
	"PK":    [91.350, 91.350], //Pakistán
	"PA":    [91.350, 91.350], //Panamá
	"PY":    [91.350, 91.350], //Paraguay
	"PE":    [91.350, 91.350], //Perú
	"PL":    [91.350, 91.350], //Polonia
	"PT":    [91.350, 91.350], //Portugal
	"UK":    ENGLAND, "GB": ENGLAND, //Reino unido   
	"CZ":    [91.350, 91.350], //República Checa
	"RO":    [91.350, 91.350], //Rumanía
	"RU":    [91.350, 91.350], //Rusia
	"SN":    [91.350, 91.350], //Senegal
	"CS":    [91.350, 91.350], //Serbia y Montenegro
	"SG":    [91.350, 91.350], //Singapur
	"SY":    [91.350, 91.350], //Siria
	"ZA":    [91.350, 91.350], //Sudáfrica
	"SE":    [91.350, 91.350], //Suecia
	"CH":    [91.350, 91.350], //Suiza
	"TH":    [91.350, 91.350], //Tailandia
	"TW":    [91.350, 91.350], //Taiwan
	"TZ":    [91.350, 91.350], //Tanzania
	"TN":    [91.350, 91.350], //Túnez
	"TR":    [91.350, 91.350], //Turquía
	"UY":    [91.350, 91.350], //Uruguay
	"VE":    [91.350, 91.350], //Venezuela
	"YE":    [91.350, 91.350], //Yemen
	"ZR":    [91.350, 91.350], //Zaire/Congo
	"ZW":    [91.350, 91.350], //Zimbawe
}

export default {
	getPais: pais => PAISES[pais] || DEFAULT,
	getRegion: pais => REGIONES[pais] || DEFAULT
}
