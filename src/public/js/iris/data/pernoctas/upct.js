
//pais: [pernocta1, pernocta2]
const DEFAULT = [165.630, 165.630]; //Resto del Mundo
const ENGLAND = [239.080, 239.080]; //Reino Unido

// BD pernoctas
const PERNOCTAS = {
	"ES":    [100.000, 100.000], //España
	"ES-MD": [140.000, 140.000], //España (Madrid)
	"ES-BA": [140.000, 140.000], //España (Barcelona)
	"DE":    [202.360, 202.360], //Alemania
	"AD":    [71.1000, 71.1000], //Andorra
	"AO":    [206.270, 206.270], //Angola
	"SA":    [112.520, 112.520], //Arabia Saudita
	"DZ":    [154.700, 154.700], //Argelia
	"AR":    [169.550, 169.550], //Argentina
	"AU":    [123.450, 123.450], //Australia
	"AT":    [146.110, 146.110], //Austria
	"BE":    [226.580, 226.580], //Bélgica
	"BO":    [78.1300, 78.1300], //Bolivia
	"BA":    [110.940, 110.940], //Bosnia-Herzegovina
	"BR":    [195.330, 195.330], //Brasil
	"BG":    [81.2600, 81.2600], //Bulgaria
	"CM":    [134.380, 134.380], //Camerún
	"CA":    [143.770, 143.770], //Canadá
	"CL":    [156.260, 156.260], //Chile
	"CN":    [109.380, 109.380], //China
	"CO":    [189.070, 189.070], //Colombia
	"KR":    [156.260, 156.260], //Corea
	"CI":    [93.7600, 93.7600], //Costa de Marfil
	"CR":    [100.010, 100.010], //Costa Rica
	"HR":    [110.940, 110.940], //Croacia
	"CU":    [85.9400, 85.9400], //Cuba
	"DK":    [187.510, 187.510], //Dinamarca
	"DO":    [97.6700, 97.6700], //República Dominicana
	"EC":    [98.4500, 98.4500], //Ecuador
	"EG":    [139.070, 139.070], //Egipto
	"SV":    [100.790, 100.790], //El Salvador
	"AE":    [154.700, 154.700], //Emiratos Árabes Unidos
	"SK":    [115.640, 115.640], //Eslovaquia
	"US":    [218.760, 218.760], //Estados Unidos
	"ET":    [182.050, 182.050], //Etiopía
	"PH":    [109.380, 109.380], //Filipinas
	"FI":    [175.020, 175.020], //Finlandia
	"FR":    [187.510, 187.510], //Francia
	"GA":    [153.140, 153.140], //Gabón
	"GH":    [101.570, 101.570], //Ghana
	"GR":    [105.480, 105.480], //Grecia
	"GT":    [136.730, 136.730], //Guatemala
	"GQ":    [133.600, 133.600], //Guinea Ecuatorial
	"HT":    [68.7600, 68.7600], //Haití
	"HN":    [106.260, 106.260], //Honduras
	"HK":    [185.170, 185.170], //Hong-Kong
	"HU":    [175.800, 175.800], //Hungría
	"IN":    [152.360, 152.360], //India
	"ID":    [156.260, 156.260], //Indonesia
	"IQ":    [100.790, 100.790], //Irak
	"IR":    [122.670, 122.670], //Irán
	"IE":    [142.190, 142.190], //Irlanda
	"IL":    [141.410, 141.410], //Israel
	"IT":    [200.020, 200.020], //Italia
	"JM":    [117.200, 117.200], //Jamaica
	"JP":    [243.780, 243.780], //Japón
	"JO":    [142.190, 142.190], //Jordania
	"KE":    [125.790, 125.790], //Kenia
	"KW":    [187.510, 187.510], //Kuwait
	"LB":    [175.800, 175.800], //Líbano
	"LY":    [155.480, 155.480], //Libia
	"LU":    [207.050, 207.050], //Luxemburgo
	"MY":    [140.630, 140.630], //Malasia
	"MT":    [70.3200, 70.3200], //Malta
	"MA":    [151.580, 151.580], //Marruecos
	"MR":    [75.0100, 75.0100], //Mauritania
	"MX":    [125.010, 125.010], //Méjico
	"MZ":    [102.350, 102.350], //Mozambique
	"NI":    [143.770, 143.770], //Nicaragua
	"NG":    [179.700, 179.700], //Nigeria
	"NO":    [203.140, 203.140], //Noruega
	"NZ":    [100.010, 100.010], //Nueva Zelanda
	"NL":    [193.770, 193.770], //Países Bajos
	"PK":    [89.0800, 89.0800], //Pakistán
	"PA":    [98.4500, 98.4500], //Panamá
	"PY":    [69.5400, 69.5400], //Paraguay
	"PE":    [121.890, 121.890], //Perú
	"PL":    [152.360, 152.360], //Polonia
	"PT":    [148.450, 148.450], //Portugal
	"UK":    ENGLAND, "GB": ENGLAND, //Reino unido
	"CZ":    [154.700, 154.700], //República Checa
	"RO":    [193.770, 193.770], //Rumanía
	"RU":    [347.690, 347.690], //Rusia
	"SN":    [103.130, 103.130], //Senegal
	"CS":    [150.010, 150.010], //Serbia y Montenegro
	"SG":    [129.700, 129.700], //Singapur
	"SY":    [127.350, 127.350], //Siria
	"ZA":    [97.6700, 97.6700], //Sudáfrica
	"SE":    [225.020, 225.020], //Suecia
	"CH":    [226.580, 226.580], //Suiza
	"TH":    [105.480, 105.480], //Tailandia
	"TW":    [125.010, 125.010], //Taiwan
	"TZ":    [117.200, 117.200], //Tanzania
	"TN":    [78.9100, 78.9100], //Túnez
	"TR":    [93.7600, 93.7600], //Turquía
	"UY":    [87.5000, 87.5000], //Uruguay
	"VE":    [118.760, 118.760], //Venezuela
	"YE":    [203.140, 203.140], //Yemen
	"ZR":    [154.700, 154.700], //Zaire/Congo
	"ZW":    [117.200, 117.200], //Zimbawe
}

export default pais => PERNOCTAS[pais] || DEFAULT;
