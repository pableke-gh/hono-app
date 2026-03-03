
//pais: [dieta1, dieta2]
const DEFAULT = [46.8800, 40.870]; //Resto Mundo
const ENGLAND = [91.3500, 82.940]; //Reino unido

// BD dietas
const DIETAS = {
	"ES":    [53.340, 37.400], //España
	"ES-MD": [53.340, 37.400], //España (Madrid)
	"ES-BA": [53.340, 37.400], //España (Barcelona)
	"DE":    [68.520, 59.500], //Alemania
	"AD":    [44.470, 37.860], //Andorra
	"AO":    [66.710, 59.500], //Angola
	"SA":    [60.700, 54.090], //Arabia Saudita
	"DZ":    [51.090, 44.470], //Argelia
	"AR":    [64.910, 55.290], //Argentina
	"AU":    [657.10, 51.090], //Australia
	"AT":    [66.110, 58.900], //Austria
	"BE":    [91.350, 82.940], //Bélgica
	"BO":    [42.670, 36.660], //Bolivia
	"BA":    [57.700, 49.880], //Bosnia-Herzegovina
	"BR":    [91.350, 79.330], //Brasil
	"BG":    [44.470, 37.860], //Bulgaria
	"CM":    [91.350, 48.680], //Camerún
	"CA":    [58.300, 51.690], //Canadá
	"CL":    [57.700, 50.490], //Chile
	"CN":    [51.690, 46.280], //China
	"CO":    [90.150, 78.130], //Colombia
	"KR":    [62.510, 55.290], //Corea
	"CI":    [55.890, 49.280], //Costa de Marfil
	"CR":    [52.290, 44.470], //Costa Rica
	"HR":    [57.700, 49.880], //Croacia
	"CU":    [38.460, 33.060], //Cuba
	"DK":    [72.120, 64.910], //Dinamarca
	"DO":    [42.070, 36.660], //República Dominicana
	"EC":    [50.490, 43.270], //Ecuador
	"EG":    [44.470, 39.070], //Egipto
	"SV":    [50.490, 43.270], //El Salvador
	"AE":    [63.710, 56.500], //Emiratos Árabes Unidos
	"SK":    [49.880, 43.270], //Eslovaquia
	"US":    [77.530, 69.720], //Estados Unidos
	"ET":    [43.870, 37.860], //Etiopía
	"PH":    [45.080, 39.670], //Filipinas
	"FI":    [72.720, 65.510], //Finlandia
	"FR":    [72.720, 65.510], //Francia
	"GA":    [59.500, 52.890], //Gabón
	"GH":    [42.670, 37.260], //Ghana
	"GR":    [45.080, 39.070], //Grecia
	"GT":    [49.280, 42.670], //Guatemala
	"GQ":    [56.500, 50.490], //Guinea Ecuatorial
	"HT":    [43.870, 37.860], //Haití
	"HN":    [49.280, 42.070], //Honduras
	"HK":    [57.700, 51.690], //Hong-Kong
	"HU":    [52.890, 46.280], //Hungría
	"IN":    [44.470, 38.460], //India
	"ID":    [48.680, 42.670], //Indonesia
	"IQ":    [44.470, 39.070], //Irak
	"IR":    [51.690, 44.470], //Irán
	"IE":    [54.090, 48.080], //Irlanda
	"IL":    [63.710, 56.500], //Israel
	"IT":    [69.720, 63.110], //Italia
	"JM":    [51.690, 46.280], //Jamaica
	"JP":    [91.350, 91.350], //Japón
	"JO":    [48.680, 42.670], //Jordania
	"KE":    [45.080, 39.670], //Kenia
	"KW":    [50.490, 44.470], //Kuwait
	"LB":    [40.870, 34.860], //Líbano
	"LY":    [62.510, 54.690], //Libia
	"LU":    [63.110, 55.890], //Luxemburgo
	"MY":    [39.670, 34.260], //Malasia
	"MT":    [37.260, 31.850], //Malta
	"MA":    [45.680, 39.670], //Marruecos
	"MR":    [45.080, 39.070], //Mauritania
	"MX":    [49.880, 43.270], //Méjico
	"MZ":    [48.080, 42.670], //Mozambique
	"NI":    [61.900, 52.890], //Nicaragua
	"NG":    [51.690, 46.880], //Nigeria
	"NO":    [89.550, 80.540], //Noruega
	"NZ":    [46.280, 40.270], //Nueva Zelanda
	"NL":    [71.520, 64.310], //Países Bajos
	"PK":    [43.270, 37.260], //Pakistán
	"PA":    [42.070, 36.660], //Panamá
	"PY":    [38.460, 33.060], //Paraguay
	"PE":    [50.490, 43.270], //Perú
	"PL":    [48.680, 42.670], //Polonia
	"PT":    [51.090, 43.870], //Portugal
	"UK":    ENGLAND, "GB": ENGLAND, //Reino unido
	"CZ":    [49.880, 43.270], //República Checa
	"RO":    [44.470, 38.460], //Rumanía
	"RU":    [83.540, 73.320], //Rusia
	"SN":    [51.090, 45.080], //Senegal
	"CS":    [57.700, 49.880], //Serbia y Montenegro
	"SG":    [54.090, 48.080], //Singapur
	"SY":    [52.290, 46.280], //Siria
	"ZA":    [55.890, 48.080], //Sudáfrica
	"SE":    [82.340, 75.130], //Suecia
	"CH":    [69.120, 61.300], //Suiza
	"TH":    [45.080, 39.070], //Tailandia
	"TW":    [54.090, 48.680], //Taiwan
	"TZ":    [34.860, 30.050], //Tanzania
	"TN":    [54.090, 46.280], //Túnez
	"TR":    [45.080, 39.070], //Turquía
	"UY":    [48.680, 41.470], //Uruguay
	"VE":    [42.070, 36.060], //Venezuela
	"YE":    [49.280, 43.270], //Yemen
	"ZR":    [60.700, 54.090], //Zaire/Congo
	"ZW":    [45.080, 39.070], //Zimbawe
}

export default pais => DIETAS[pais] || DEFAULT;