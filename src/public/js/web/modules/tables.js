
import Table from "../../components/Table.js";
import nav from "../../components/Navigation.js";
import menus from "../data/menus.js";

function fnTable() {
    const table = new Table($1("table"));
    table.set("onRender", (data, status, resume) => {
        return `<tr class="tb-data">
            <td class="text-center hide-xs" data-cell="Nº">${status.count}</td>
            <td data-cell="Nombre"><a href="#" class="link">${data.nombre}</a></td>
            <td data-cell="Título">${data.titulo}</td>
            <td data-cell="Icono" class="text-center">${data.icono || ""}</td>
            <td data-cell="Acciones" class="text-center no-print">
				<div><a href="#remove" class="fas fa-times action text-red text-xl resize" title="Desasociar partida"></a></div>
			</td>
        </tr>`;
    });
    table.set("onFooter", resume => `<tr><td colspan="${resume.columns}">Filas: ${resume.size}</td></tr>`);
    table.render(menus.filter(node => (node.tipo == 1)));
}

$1("a[href='#pdf']").onclick = ev => {
	// Step 1: Select the HTML element (or build template)
	const main = $1("main").cloneNode(true);
	main.querySelectorAll(".no-print").forEach(el => el.remove());
	const element = main; //document.documentElement;

	// Step 2: Configure the conversion options
	const options = {
		margin: .25,
		filename: 'my-document.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2 },
		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
	};

	// Step 3: Convert and save the PDF
	const worker = html2pdf();
	worker.set(options).from(element).save();
	ev.preventDefault();
};

// Register event on page load and export default handler
nav.ready(fnTable);
export default fnTable;
