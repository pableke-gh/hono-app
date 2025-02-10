
//pais: [dieta1, dieta2]
const DEFAULT = [60.9400, 60.940]; //Resto del Mundo
const ENGLAND = [91.3500, 91.350]; //Reino Unido

// BD dietas
const DIETAS = {
	"ES":    [53.340, 53.340], //España
	"ES-MD": [53.340, 53.340], //España (Madrid)
	"ES-BA": [53.340, 53.340], //España (Barcelona)
	"DE":    [89.080, 89.080], //Alemania
	"AD":    [57.810, 57.810], //Andorra
	"AO":    [86.720, 86.720], //Angola
	"SA":    [78.910, 78.910], //Arabia Saudita
	"DZ":    [66.420, 66.420], //Argelia
	"AR":    [84.380, 84.380], //Argentina
	"AU":    [74.230, 74.230], //Australia
	"AT":    [85.940, 85.940], //Austria
	"BE":    [91.350, 91.350], //Bélgica
	"BO":    [55.470, 55.470], //Bolivia
	"BA":    [75.010, 75.010], //Bosnia-Herzegovina
	"BR":    [91.350, 91.350], //Brasil
	"BG":    [57.810, 57.810], //Bulgaria
	"CM":    [71.880, 71.880], //Camerún
	"CA":    [75.790, 75.790], //Canadá
	"CL":    [75.010, 75.010], //Chile
	"CN":    [67.200, 67.200], //China
	"CO":    [91.350, 91.350], //Colombia
	"KR":    [81.260, 81.260], //Corea
	"CI":    [72.660, 72.660], //Costa de Marfil
	"CR":    [67.980, 67.980], //Costa Rica
	"HR":    [75.010, 75.010], //Croacia
	"CU":    [50.000, 50.000], //Cuba
	"DK":    [91.350, 91.350], //Dinamarca
	"DO":    [54.690, 54.690], //República Dominicana
	"EC":    [65.640, 65.640], //Ecuador
	"EG":    [57.810, 57.810], //Egipto
	"SV":    [65.640, 65.640], //El Salvador
	"AE":    [82.820, 82.820], //Emiratos Árabes Unidos
	"SK":    [64.840, 64.840], //Eslovaquia
	"US":    [91.350, 91.350], //Estados Unidos
	"ET":    [57.030, 57.030], //Etiopía
	"PH":    [58.600, 58.600], //Filipinas
	"FI":    [91.350, 91.350], //Finlandia
	"FR":    [91.350, 91.350], //Francia
	"GA":    [77.350, 77.350], //Gabón
	"GH":    [55.470, 55.470], //Ghana
	"GR":    [58.600, 58.600], //Grecia
	"GT":    [64.060, 64.060], //Guatemala
	"GQ":    [73.450, 73.450], //Guinea Ecuatorial
	"HT":    [57.030, 57.030], //Haití
	"HN":    [64.060, 64.060], //Honduras
	"HK":    [75.010, 75.010], //Hong-Kong
	"HU":    [68.760, 68.760], //Hungría
	"IN":    [57.810, 57.810], //India
	"ID":    [63.280, 63.280], //Indonesia
	"IQ":    [57.810, 57.810], //Irak
	"IR":    [67.200, 67.200], //Irán
	"IE":    [70.320, 70.320], //Irlanda
	"IL":    [82.820, 82.820], //Israel
	"IT":    [90.640, 90.640], //Italia
	"JM":    [67.200, 67.200], //Jamaica
	"JP":    [91.350, 91.350], //Japón
	"JO":    [63.280, 63.280], //Jordania
	"KE":    [58.600, 58.600], //Kenia
	"KW":    [65.640, 65.640], //Kuwait
	"LB":    [53.130, 53.130], //Líbano
	"LY":    [81.260, 81.260], //Libia
	"LU":    [82.040, 82.040], //Luxemburgo
	"MY":    [51.570, 51.570], //Malasia
	"MT":    [48.440, 48.440], //Malta
	"MA":    [59.380, 59.380], //Marruecos
	"MR":    [58.600, 58.600], //Mauritania
	"MX":    [64.840, 64.840], //Méjico
	"MZ":    [62.500, 62.500], //Mozambique
	"NI":    [80.470, 80.470], //Nicaragua
	"NG":    [67.200, 67.200], //Nigeria
	"NO":    [91.350, 91.350], //Noruega
	"NZ":    [60.160, 60.160], //Nueva Zelanda
	"NL":    [91.350, 91.350], //Países Bajos
	"PK":    [56.250, 56.250], //Pakistán
	"PA":    [54.690, 54.690], //Panamá
	"PY":    [50.000, 50.000], //Paraguay
	"PE":    [65.640, 65.640], //Perú
	"PL":    [63.280, 63.280], //Polonia
	"PT":    [66.420, 66.420], //Portugal
	"UK":    ENGLAND, "GB": ENGLAND, //Reino unido
	"CZ":    [64.840, 64.840], //República Checa
	"RO":    [57.810, 57.810], //Rumanía
	"RU":    [91.350, 91.350], //Rusia
	"SN":    [66.420, 66.420], //Senegal
	"CS":    [75.010, 75.010], //Serbia y Montenegro
	"SG":    [70.320, 70.320], //Singapur
	"SY":    [67.980, 67.980], //Siria
	"ZA":    [72.660, 72.660], //Sudáfrica
	"SE":    [91.350, 91.350], //Suecia
	"CH":    [89.860, 89.860], //Suiza
	"TH":    [58.600, 58.600], //Tailandia
	"TW":    [70.320, 70.320], //Taiwan
	"TZ":    [45.320, 45.320], //Tanzania
	"TN":    [70.320, 70.320], //Túnez
	"TR":    [58.600, 58.600], //Turquía
	"UY":    [63.280, 63.280], //Uruguay
	"VE":    [54.690, 54.690], //Venezuela
	"YE":    [64.060, 64.060], //Yemen
	"ZR":    [78.910, 78.910], //Zaire/Congo
	"ZW":    [58.600, 58.600], //Zimbawe
}

export default pais => DIETAS[pais] || DEFAULT;
