
import coll from "./Collection.js";
import i18n from "../i18n/langs.js";

// doc link: https://docs.sheetjs.com/docs/csf/cell
const isnum = val => ((typeof(val) === "number") || (val instanceof Number));
const isDate = val => ((coll.size(val) == 10) || val.endsWith("T00:00:00.0Z"));
const isDateTime = val => /^\d{4}-[01]\d-[0-3]\d/.test(val);
const fnVoid = () => {};

const LETTERS = [ // Columns names
	"A",  "B",  "C",  "D",  "E",  "F",  "G",  "H",  "I",  "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
	"AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "aW", "AX", "AY", "AZ",
	"BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ",
	"CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ",
	"DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ"
];
const HEADER_STYLES = { // style only for pro version
	alignment: { horizontal: "center", wrapText: true },
	font: { bold: true }
};

function Excel() {
	const self = this; //self instance

	this.json = (data, opts) => {
		opts = opts || {}; // Default options
		opts.titles = opts.titles || []; // Header names
		opts.columns = opts.columns || {}; // Cell handlers
		opts.file = opts.file || "myFile.xlsx"; // File name
		opts.type = opts.type || "binary"; // Export settings
		opts.bookType = opts.bookType || "xlsx"; // Export settings
		opts.cellStyles = opts.cellStyles ?? true; // Save style/theme info to the .s field

		const workBook = XLSX.utils.book_new();
		workBook.Props = {
			Author: opts.author || "UPCT",
			Title: opts.title || "Campus Virtual",
			CreatedDate: new Date()
		};

        // Header iterator
		const columns = opts.keys || Object.keys(data[0]);
		const cloned = data.map(row => coll.clone(row, columns));
		const workSheet = XLSX.utils.json_to_sheet(cloned); //XLSX.utils.sheet_add_json(workSheet, data)
		columns.forEach((name, i) => { // Row header iterator
			const cell = workSheet[LETTERS[i] + "1"]; // Header cell
			cell.v = opts.titles[i] || name.toUpperCase(); // Title
			cell.s = HEADER_STYLES; // Styles in version pro!
			cell.t = "s"; // type string
		});

        // Columns iterator
        columns.forEach((column, i) => {
			const col = LETTERS[i]; //A,B,C,...
			const fnCol = opts.columns[column] || fnVoid;
			for (let i = 0; (i < data.length); i++) { // column iterator
				const cell = workSheet[col + (i + 2)]; // Avoid header
				if (isnum(cell.v)) // Autodetect type
					cell.t = "n"; // type number => //cell.z = "#,##0.00"; // currency format
				else if (isDateTime(cell.v)) // Date ISO format
					cell.v = isDate(cell.v) ? i18n.isoDate(cell.v) : i18n.isoDateTime(cell.v);
				//else // default type string
					//cell.t = "s"; // not ignore null's
				fnCol(cell, data[i]); // avoid header
			}
        });

		XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
		XLSX.writeFile(workBook, opts.file, opts);
		return self;
    }
}

export default new Excel();
