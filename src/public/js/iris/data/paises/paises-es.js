
const DEFAULT = "Resto del Mundo";
const ENGLAND = "Reino unido";

const PAISES = {
	"ES": "España",
	"DE": "Alemania",
	"AD": "Andorra",
	"AO": "Angola",
	"SA": "Arabia Saudita",
	"DZ": "Argelia",
	"AR": "Argentina",
	"AU": "Australia",
	"AT": "Austria",
	"BE": "Bélgica",
	"BO": "Bolivia",
	"BA": "Bosnia-Herzegovina",
	"BR": "Brasil",
	"BG": "Bulgaria",
	"CM": "Camerún",
	"CA": "Canadá",
	"CL": "Chile",
	"CN": "China",
	"CO": "Colombia",
	"KR": "Corea",
	"CI": "Costa de Marfil",
	"CR": "Costa Rica",
	"HR": "Croacia",
	"CU": "Cuba",
	"DK": "Dinamarca",
	"DO": "República Dominicana",
	"EC": "Ecuador",
	"EG": "Egipto",
	"SV": "El Salvador",
	"AE": "Emiratos Árabes Unidos",
	"SK": "Eslovaquia",
	"US": "Estados Unidos",
	"ET": "Etiopía",
	"PH": "Filipinas",
	"FI": "Finlandia",
	"FR": "Francia",
	"GA": "Gabón",
	"GH": "Ghana",
	"GR": "Grecia",
	"GT": "Guatemala",
	"GQ": "Guinea Ecuatorial",
	"HT": "Haití",
	"HN": "Honduras",
	"HK": "Hong-Kong",
	"HU": "Hungría",
	"IN": "India",
	"ID": "Indonesia",
	"IQ": "Irak",
	"IR": "Irán",
	"IE": "Irlanda",
	"IL": "Israel",
	"IT": "Italia",
	"JM": "Jamaica",
	"JP": "Japón",
	"JO": "Jordania",
	"KE": "Kenia",
	"KW": "Kuwait",
	"LB": "Líbano",
	"LY": "Libia",
	"LU": "Luxemburgo",
	"MY": "Malasia",
	"MT": "Malta",
	"MA": "Marruecos",
	"MR": "Mauritania",
	"MX": "Méjico",
	"MZ": "Mozambique",
	"NI": "Nicaragua",
	"NG": "Nigeria",
	"NO": "Noruega",
	"NZ": "Nueva Zelanda",
	"NL": "Países Bajos",
	"PK": "Pakistán",
	"PA": "Panamá",
	"PY": "Paraguay",
	"PE": "Perú",
	"PL": "Polonia",
	"PT": "Portugal",
	"UK": ENGLAND, "GB": ENGLAND, //Reino unido   
	"CZ": "República Checa",
	"RO": "Rumanía",
	"RU": "Rusia",
	"SN": "Senegal",
	"CS": "Serbia y Montenegro",
	"SG": "Singapur",
	"SY": "Siria",
	"ZA": "Sudáfrica",
	"SE": "Suecia",
	"CH": "Suiza",
	"TH": "Tailandia",
	"TW": "Taiwan",
	"TZ": "Tanzania",
	"TN": "Túnez",
	"TR": "Turquía",
	"UY": "Uruguay",
	"VE": "Venezuela",
	"YE": "Yemen",
	"ZR": "Zaire/Congo",
	"ZW": "Zimbawe"
}

const REGIONES = {
	"ES": "España", "ES-MD": "España (Madrid)", "ES-BA": "España (Barcelona)", 
	"DE": "Alemania",
	"AD": "Andorra",
	"AO": "Angola",
	"SA": "Arabia Saudita",
	"DZ": "Argelia",
	"AR": "Argentina",
	"AU": "Australia",
	"AT": "Austria",
	"BE": "Bélgica",
	"BO": "Bolivia",
	"BA": "Bosnia-Herzegovina",
	"BR": "Brasil",
	"BG": "Bulgaria",
	"CM": "Camerún",
	"CA": "Canadá",
	"CL": "Chile",
	"CN": "China",
	"CO": "Colombia",
	"KR": "Corea",
	"CI": "Costa de Marfil",
	"CR": "Costa Rica",
	"HR": "Croacia",
	"CU": "Cuba",
	"DK": "Dinamarca",
	"DO": "República Dominicana",
	"EC": "Ecuador",
	"EG": "Egipto",
	"SV": "El Salvador",
	"AE": "Emiratos Árabes Unidos",
	"SK": "Eslovaquia",
	"US": "Estados Unidos",
	"ET": "Etiopía",
	"PH": "Filipinas",
	"FI": "Finlandia",
	"FR": "Francia",
	"GA": "Gabón",
	"GH": "Ghana",
	"GR": "Grecia",
	"GT": "Guatemala",
	"GQ": "Guinea Ecuatorial",
	"HT": "Haití",
	"HN": "Honduras",
	"HK": "Hong-Kong",
	"HU": "Hungría",
	"IN": "India",
	"ID": "Indonesia",
	"IQ": "Irak",
	"IR": "Irán",
	"IE": "Irlanda",
	"IL": "Israel",
	"IT": "Italia",
	"JM": "Jamaica",
	"JP": "Japón",
	"JO": "Jordania",
	"KE": "Kenia",
	"KW": "Kuwait",
	"LB": "Líbano",
	"LY": "Libia",
	"LU": "Luxemburgo",
	"MY": "Malasia",
	"MT": "Malta",
	"MA": "Marruecos",
	"MR": "Mauritania",
	"MX": "Méjico",
	"MZ": "Mozambique",
	"NI": "Nicaragua",
	"NG": "Nigeria",
	"NO": "Noruega",
	"NZ": "Nueva Zelanda",
	"NL": "Países Bajos",
	"PK": "Pakistán",
	"PA": "Panamá",
	"PY": "Paraguay",
	"PE": "Perú",
	"PL": "Polonia",
	"PT": "Portugal",
	"UK":  ENGLAND, "GB": ENGLAND, //Reino unido   
	"CZ": "República Checa",
	"RO": "Rumanía",
	"RU": "Rusia",
	"SN": "Senegal",
	"CS": "Serbia y Montenegro",
	"SG": "Singapur",
	"SY": "Siria",
	"ZA": "Sudáfrica",
	"SE": "Suecia",
	"CH": "Suiza",
	"TH": "Tailandia",
	"TW": "Taiwan",
	"TZ": "Tanzania",
	"TN": "Túnez",
	"TR": "Turquía",
	"UY": "Uruguay",
	"VE": "Venezuela",
	"YE": "Yemen",
	"ZR": "Zaire/Congo",
	"ZW": "Zimbawe"
}

export default {
	getPaises: () => PAISES,
	getPais: pais => PAISES[pais] || DEFAULT,

	getRegiones: () => REGIONES,
	getRegion: pais => REGIONES[pais] || DEFAULT
}
