
import api from "../components/Api.js";
import Form from "../components/forms/Form.js";
import nav from "../components/Navigation.js";
import sb from "../components/types/StringBox.js";
import i18n from "../i18n/langs.js";

//import maps from "./modules/maps.js";
import xlsx from "../services/xlsx.js";

function fnIndex() {
    // Tab1 = Pokemon API Tests
    const info = document.getElementById("info-pokemon");
    const fnSelect = data => {
        info.innerHTML = `<div>
                <h3>Pokemon ${data.name}</h3>
                <ul>
                    <li><b>Nombre:</b> ${data.name}</li>
                    <li><b>Tipo:</b> ${data.types[0].type.name}</li>
                    <li><b>Especie:</b> ${data.species.name}</li>
                    <li><b>HP:</b> ${data.stats[0].base_stat}</li>
                    <li><b>Ataque:</b> ${data.stats[1].base_stat}</li>
                    <li><b>Defensa:</b> ${data.stats[3].base_stat}</li>
                </ul>
            </div>
            <img src="${data.sprites.front_default}" alt="${data.name}">`;
        info.show();
        console.log(data);
    }

    const formPokemon = new Form("#form-pokemon"); // instance
    formPokemon.onSubmit(ev => ev.preventDefault()); // ajax submit
    formPokemon.setAutocomplete("#ac-pokemon", {
        source: (term, acPokemon) => {
            const fnFilter = pokemon => sb.ilike(pokemon.name, term);
            api.init()
                .json("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
                .then(data => acPokemon.render(data.results.filter(fnFilter)));
        },
        render: item => item.name,
        select: item => { api.json(`https://pokeapi.co/api/v2/pokemon/${item.name}`).then(fnSelect); return item.name; },
        onReset: () => info.hide()
    });

    /* Multi select options */
    const options = formPokemon.setMultiSelectCheckbox(".multi-options", { name: "animales" });
    const animales = [ { value: 1, label: "Perro" }, { value: 2, label: "Gato" }, { value: 3, label: "Girafa" }, { value: 4, label: "Leon" }, { value: 5, label: "Tiburón" } ];
    options.setData(animales).setValues([1, 3, 5]); // set values to check

    /********************* EXCEL *********************/
	$1('[href="#download"]').setClick(ev => {
		const sheet = "listado-isu";
		const TITLES = ["Name", "Birthday", "Importe", "Link"];
		const DATA = [
			{ name: "George Washington", birthday: "1732-02-22T00:00:00.000Z", imp: 10.65, link: "https://docs.sheetjs.com/docs/" },
			{ name: "John Adams", birthday: "1735-10-19T00:00:00.000Z", imp: 1243363.45645, link: "https://docs.sheetjs.com/docs/" },
			// ... one row per President
		];

		xlsx.setData(sheet, DATA).setTitles(sheet, TITLES);
		const worksheet = xlsx.getSheet(sheet);
		DATA.forEach((data, i) => { // row parser
			const row = i + 2; // Titles row = 1
			worksheet["B"+ row].v = i18n.isoDate(data.birthday); // cell.t="s" = type string => iso date in string format
			worksheet["C"+ row].z = "#,##0.00"; // cell.t="n" = type number => cell.z="#,##0.00" = currency format
	
			// link example
			const cellLink = worksheet["D"+ row]; // cell type link
			cellLink.l = { Target: data.link, Tooltip: "Enlace externo "}; // cell.l = type link
			cellLink.v = "Texto a mostrar";
		});
		console.log(worksheet);
		xlsx.download("Informe ISU.xlsx");
		ev.preventDefault();
	});

	//tabs.setInitEvent("maps", maps.init);
}

// Register event on page load and export default handler
nav.ready(fnIndex);
export default fnIndex;
