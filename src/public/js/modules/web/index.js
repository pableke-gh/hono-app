
import api from "../../components/Api.js";
import Form from "../../components/Form.js";
import nav from "../../components/Navigation.js";
import sb from "../../components/StringBox.js";
import excel from "../../components/Excel.js";
import menus from "../../data/menus.js";

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
    formPokemon.submit(ev => ev.preventDefault()); // ajax submit
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
    options.setItems(animales);

    /********************* EXCEL *********************/
    document.getElementById("xlsx").addEventListener("click", ev => {
        excel.json(menus, {
            keys: [ "id", "tipo", "nombre", "titulo", "orden", "mask", "creado", "padre" ], // column order
            columns: {
                titulo: (cell, row) => { cell.l = { Target:row.enlace, Tooltip:"Find us @ SheetJS.com!" }; },
                orden: cell => { cell.t = "n" }, // type number
                creado: cell => { cell.t = "d"; } // type date
            }
        });
    });

    // Register handler for navigation
    nav.setScript("index-js", fnIndex);
}

// Register event on page load and export default handler
nav.ready(fnIndex);
export default fnIndex;
