
/*const LETTERS = [ // Columns names
	"A",  "B",  "C",  "D",  "E",  "F",  "G",  "H",  "I",  "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
	"AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "aW", "AX", "AY", "AZ",
	"BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ",
	"CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ",
	"DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ"
];*/

/*const HEADER_STYLES = { // style only for pro version!
	alignment: { horizontal: "center", vertical: "center", wrapText: true },
	font: { bold: true }
};

// Iterate over row 1 only (titles row)
const fnParseTitles = (worksheet, title, column) => {
	const ref = LETTERS[column] + "1";
	const cell = worksheet[ref];
	cell.s = HEADER_STYLES;
	cell.v = title;
}*/

function Xlsx() {
	const self = this; //self instance
	const workbook = XLSX.utils.book_new();

	const fnSave = (worksheet, name) => {
		if (workbook.Sheets[name]) // replace sheet
			workbook.Sheets[name] = worksheet;
		else // append new sheet to work book
			XLSX.utils.book_append_sheet(workbook, worksheet, name);
		return self;
	}

	this.getSheets = () => workbook.Sheets;
	this.getSheet = name => workbook.Sheets[name];

	this.setData = (name, data, fnParser) => {
		const worksheet = XLSX.utils.json_to_sheet(data, { cellDates: true });
		if (fnParser) // Iterate over all rows
			data.forEach((row, i) => fnParser(worksheet, row, i));
		return fnSave(worksheet, name);
	}

	this.setValues = (name, values, fnParser) => { // values is array of arrays
		const worksheet = XLSX.utils.aoa_to_sheet(values, { origin: "A2" }); // A1 = titles
		if (fnParser) // Iterate over all rows
			values.forEach((row, i) => fnParser(worksheet, row, i));
		return fnSave(worksheet, name);
	}

	this.setTitles = (name, titles, fnParser) => {
		const opts = { origin: "A1" }; // A1 = titles
		let worksheet = workbook.Sheets[name];
		if (worksheet) // check if sheet exists
			XLSX.utils.sheet_add_aoa(worksheet, [titles], opts);
		else { // create new workseet
			worksheet = XLSX.utils.aoa_to_sheet([titles], opts);
			fnSave(worksheet, name); // save worksheet in work book
		}
		if (fnParser) // Iterate over row 1 only (titles row)
			titles.forEach((title, column) => fnParser(worksheet, title, column));
		return self;
	}

	this.download = fileName => {
		XLSX.writeFile(workbook, fileName, { compression: true });
	}
}

export default new Xlsx();
