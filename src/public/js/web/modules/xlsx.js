
import coll from "../../components/CollectionHTML.js";
import i18n from "../../i18n/langs.js";

coll.ready(() => {

	const TITLES = ["Name", "Birthday", "Importe", "Link"];
	const data = [
		{ name: "George Washington", birthday: "1732-02-22T00:00:00.000Z", imp: 10.65, link: "https://docs.sheetjs.com/docs/" },
		{ name: "John Adams", birthday: "1735-10-19T00:00:00.000Z", imp: 1243363.45645, link: "https://docs.sheetjs.com/docs/" },
		// ... one row per President
	]

	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(data);

	data.forEach((row, i) => {
		const column = i + 2; // Titles row = 1
		worksheet["B"+ column].v = i18n.isoDate(row.birthday); // cell.t="s" = type string => iso date in string format
		worksheet["C"+ column].z = "#,##0.00"; // cell.t="n" = type number => cell.z="#,##0.00" = currency format

		// link example
		worksheet["D"+ column].l = { Target: row.link, Tooltip: "Enlace externo "}; // cell.l = type link
		worksheet["D"+ column].v = "Texto a mostrar";
	});

	XLSX.utils.book_append_sheet(workbook, worksheet, "listado isu");
	const results = XLSX.utils.sheet_add_aoa(worksheet, [TITLES], { origin: "A1" });
	console.log(results);

	XLSX.writeFile(workbook, "Informe ISU.xlsx", { compression: true });

});
