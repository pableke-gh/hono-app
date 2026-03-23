
const ID = "ChIJbbU6pCJCYw0R__n2_s6Q10c";
const NAME = "Cartagena, España";
const PAIS = "ES";

export default {
	desp: 0, mask: 4, // default for CT
	"place_id": ID, oid: ID, did: ID,
	origen: NAME, destino: NAME,
	pais1: PAIS, pais2: PAIS,
	"address_components": [
        {
            "long_name": "Cartagena",
            "short_name": "Cartagena",
            "types": [
                "locality",
                "political"
            ]
        },
        {
            "long_name": "Murcia",
            "short_name": "MU",
            "types": [
                "administrative_area_level_2",
                "political"
            ]
        },
        {
            "long_name": "Región de Murcia",
            "short_name": "MC",
            "types": [
                "administrative_area_level_1",
                "political"
            ]
        },
        {
            "long_name": "España",
            "short_name": "ES",
            "types": [
                "country",
                "political"
            ]
        }
	],
	/*"geometry": {
		"location": {
			"lat": 37.6253022,
			"lng": -0.9972219
		},
		"viewport": {
			"south": 37.5951130761385,
			"west": -1.012726866200791,
			"north": 37.63971015232394,
			"east": -0.9642879391170617
		}
	},*/
	"html_attributions": []
};
