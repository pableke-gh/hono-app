
//pais: [pernocta1, pernocta2]
const DEFAULT = [127.410, 108.780]; //Resto Mundo
const ENGLAND = [183.910, 156.860]; //Reino unido

// BD pernoctas
const PERNOCTAS = {
	"ES":    [102.560, 65.9700], //España
	"ES-MD": [102.560, 65.9700], //España (Madrid)
	"ES-BA": [102.560, 65.9700], //España (Barcelona)
	"DE":    [155.660, 132.820], //Alemania
	"AD":    [54.6900, 46.8800], //Andorra
	"AO":    [158.670, 135.230], //Angola
	"SA":    [86.5500, 73.9200], //Arabia Saudita
	"DZ":    [119.000, 101.570], //Argelia
	"AR":    [130.420, 111.190], //Argentina
	"AU":    [94.9600, 81.1400], //Australia
	"AT":    [112.390, 95.5600], //Austria
	"BE":    [174.290, 148.450], //Bélgica
	"BO":    [60.1000, 51.0900], //Bolivia
	"BA":    [85.3400, 72.7200], //Bosnia-Herzegovina
	"BR":    [150.250, 128.020], //Brasil
	"BG":    [62.5100, 53.4900], //Bulgaria
	"CM":    [103.370, 88.3500], //Camerún
	"CA":    [110.590, 94.3600], //Canadá
	"CL":    [120.200, 102.170], //Chile
	"CN":    [184.140, 71.5200], //China
	"CO":    [145.440, 123.810], //Colombia
	"KR":    [120.200, 102.170], //Corea
	"CI":    [72.1200, 61.3000], //Costa de Marfil
	"CR":    [76.9300, 65.5100], //Costa Rica
	"HR":    [85.3400, 72.7200], //Croacia
	"CU":    [66.1100, 56.5000], //Cuba
	"DK":    [144.240, 122.610], //Dinamarca
	"DO":    [75.1300, 64.3100], //República Dominicana
	"EC":    [75.7300, 64.9100], //Ecuador
	"EG":    [106.980, 91.3500], //Egipto
	"SV":    [77.5300, 66.1100], //El Salvador
	"AE":    [119.000, 101.570], //Emiratos Árabes Unidos
	"SK":    [88.9500, 75.7300], //Eslovaquia
	"US":    [168.280, 143.040], //Estados Unidos
	"ET":    [140.040, 119.600], //Etiopía
	"PH":    [84.1400, 71.5200], //Filipinas
	"FI":    [134.630, 114.790], //Finlandia
	"FR":    [144.240, 122.610], //Francia
	"GA":    [117.800, 100.370], //Gabón
	"GH":    [78.1300, 66.7100], //Ghana
	"GR":    [81.1400, 69.1200], //Grecia
	"GT":    [105.180, 89.5500], //Guatemala
	"GQ":    [102.770, 87.7500], //Guinea Ecuatorial
	"HT":    [52.8900, 45.0800], //Haití
	"HN":    [81.7400, 69.7200], //Honduras
	"HK":    [142.440, 121.400], //Hong-Kong
	"HU":    [135.230, 115.390], //Hungría
	"IN":    [117.200, 99.7700], //India
	"ID":    [120.200, 102.170], //Indonesia
	"IQ":    [77.5300, 66.1100], //Irak
	"IR":    [94.3600, 80.5400], //Irán
	"IE":    [109.380, 93.1600], //Irlanda
	"IL":    [108.780, 92.5600], //Israel
	"IT":    [153.860, 131.020], //Italia
	"JM":    [90.1500, 76.9300], //Jamaica
	"JP":    [187.520, 159.870], //Japón
	"JO":    [109.380, 93.1600], //Jordania
	"KE":    [96.7600, 82.3400], //Kenia
	"KW":    [144.240, 122.610], //Kuwait
	"LB":    [135.230, 115.390], //Líbano
	"LY":    [119.600, 102.170], //Libia
	"LU":    [159.270, 135.830], //Luxemburgo
	"MY":    [108.180, 91.9500], //Malasia
	"MT":    [54.0900, 46.2800], //Malta
	"MA":    [116.600, 99.1700], //Marruecos
	"MR":    [57.7000, 49.2800], //Mauritania
	"MX":    [96.1600, 81.7400], //Méjico
	"MZ":    [78.7300, 67.3100], //Mozambique
	"NI":    [110.590, 94.3600], //Nicaragua
	"NG":    [138.230, 117.800], //Nigeria
	"NO":    [156.260, 132.820], //Noruega
	"NZ":    [76.9300, 65.5100], //Nueva Zelanda
	"NL":    [149.050, 126.810], //Países Bajos
	"PK":    [68.5200, 58.3000], //Pakistán
	"PA":    [75.7300, 64.9100], //Panamá
	"PY":    [53.4900, 45.6800], //Paraguay
	"PE":    [93.7600, 79.9300], //Perú
	"PL":    [117.200, 99.7700], //Polonia
	"PT":    [114.190, 97.3600], //Portugal
	"UK":    ENGLAND, "GB": ENGLAND, //Reino unido
	"CZ":    [119.000, 101.570], //República Checa
	"RO":    [149.050, 126.810], //Rumanía
	"RU":    [267.450, 227.780], //Rusia
	"SN":    [79.3300, 67.9100], //Senegal
	"CS":    [115.390, 98.5700], //Serbia y Montenegro
	"SG":    [99.7700, 85.3400], //Singapur
	"SY":    [97.9600, 83.5400], //Siria
	"ZA":    [75.1300, 64.3100], //Sudáfrica
	"SE":    [173.090, 147.250], //Suecia
	"CH":    [174.290, 148.450], //Suiza
	"TH":    [81.1400, 69.1200], //Tailandia
	"TW":    [96.1600, 81.7400], //Taiwan
	"TZ":    [90.1500, 76.9300], //Tanzania
	"TN":    [60.7000, 51.6900], //Túnez
	"TR":    [72.1200, 61.3000], //Turquía
	"UY":    [67.3100, 57.7000], //Uruguay
	"VE":    [91.3500, 78.1300], //Venezuela
	"YE":    [156.260, 132.820], //Yemen
	"ZR":    [119.000, 101.570], //Zaire/Congo
	"ZW":    [90.1500, 76.9300], //Zimbawe
}

export default pais => PERNOCTAS[pais] || DEFAULT;