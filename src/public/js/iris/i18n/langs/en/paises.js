
const DEFAULT = "Rest of the world";
const ENGLAND = "United Kingdom";

const PAISES = {
	"ES": "Spain", //España
	"DE": "Germany", //Alemania
	"AD": "Andorra", //Andorra
	"AO": "Angola", //Angola
	"SA": "Saudi Arabia", //Arabia Saudita
	"DZ": "Algeria", //Argelia
	"AR": "Argentina", //Argentina
	"AU": "Australia", //Australia
	"AT": "Austria", //Austria
	"BE": "Belgium", //Bélgica
	"BO": "Bolivia", //Bolivia
	"BA": "Bosnia-Herzegovina", //Bosnia-Herzegovina
	"BR": "Brazil", //Brasil
	"BG": "Bulgaria", //Bulgaria
	"CM": "Cameroon", //Camerún
	"CA": "Canada", //Canadá
	"CL": "Chile", //Chile
	"CN": "China", //China
	"CO": "Colombia", //Colombia
	"KR": "Korea", //Corea
	"CI": "Côte d'Ivoire", //Costa de Marfil
	"CR": "Costa Rica", //Costa Rica
	"HR": "Croatia", //Croacia
	"CU": "Cuba", //Cuba
	"DK": "Denmark", //Dinamarca
	"DO": "Dominican Republic", //República Dominicana
	"EC": "Ecuador", //Ecuador
	"EG": "Egypt", //Egipto
	"SV": "El Salvador", //El Salvador
	"AE": "United Arab Emirates", //Emiratos Árabes Unidos
	"SK": "Slovakia", //Eslovaquia
	"US": "United States", //Estados Unidos
	"ET": "Ethiopia", //Etiopía
	"PH": "Philippines", //Filipinas
	"FI": "Finland", //Finlandia
	"FR": "France", //Francia
	"GA": "Gabon", //Gabón
	"GH": "Ghana", //Ghana
	"GR": "Greece", //Grecia
	"GT": "Guatemala", //Guatemala
	"GQ": "Equatorial Guinea", //Guinea Ecuatorial
	"HT": "Haiti", //Haití
	"HN": "Honduras", //Honduras
	"HK": "Hong Kong", //Hong-Kong
	"HU": "Hungary", //Hungría
	"IN": "India", //India
	"ID": "Indonesia", //Indonesia
	"IQ": "Iraq", //Irak
	"IR": "Iran", //Irán
	"IE": "Ireland", //Irlanda
	"IL": "Israel", //Israel
	"IT": "Italy", //Italia
	"JM": "Jamaica", //Jamaica
	"JP": "Japan", //Japón
	"JO": "Jordan", //Jordania
	"KE": "Kenya", //Kenia
	"KW": "Kuwait", //Kuwait
	"LB": "Lebanon", //Líbano
	"LY": "Libya", //Libia
	"LU": "Luxembourg", //Luxemburgo
	"MY": "Malaysia", //Malasia
	"MT": "Malta", //Malta
	"MA": "Morocco", //Marruecos
	"MR": "Mauritania", //Mauritania
	"MX": "Mexico", //Méjico
	"MZ": "Mozambique", //Mozambique
	"NI": "Nicaragua", //Nicaragua
	"NG": "Nigeria", //Nigeria
	"NO": "Norway", //Noruega
	"NZ": "New Zealand", //Nueva Zelanda
	"NL": "Netherlands", //Países Bajos
	"PK": "Pakistan", //Pakistán
	"PA": "Panama", //Panamá
	"PY": "Paraguay", //Paraguay
	"PE": "Peru", //Perú
	"PL": "Poland", //Polonia
	"PT": "Portugal", //Portugal
	"UK": ENGLAND, "GB": ENGLAND, //Reino unido   
	"CZ": "Czech Republic", //República Checa
	"RO": "Romania", //Rumanía
	"RU": "Russia", //Rusia
	"SN": "Senegal", //Senegal
	"CS": "Serbia and Montenegro", //Serbia y Montenegro
	"SG": "Singapore", //Singapur
	"SY": "Syria", //Siria
	"ZA": "South Africa", //Sudáfrica
	"SE": "Sweden", //Suecia
	"CH": "Switzerland", //Suiza
	"TH": "Thailand", //Tailandia
	"TW": "Taiwan", //Taiwan
	"TZ": "Tanzania", //Tanzania
	"TN": "Tunisia", //Túnez
	"TR": "Turkey", //Turquía
	"UY": "Uruguay", //Uruguay
	"VE": "Venezuela", //Venezuela
	"YE": "Yemen", //Yemen
	"ZR": "Zaire/Congo", //Zaire/Congo
	"ZW": "Zimbabwe" //Zimbawe
}

export default {
	getPaises: () => PAISES,
	getPais: pais => PAISES[pais] || DEFAULT,
}
