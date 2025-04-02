
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

	this.getSheets = () => workbook.Sheets;
	this.getSheet = name => workbook.Sheets[name];

	this.setData = (name, data/*, fnParser*/) => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		//if (fnParser) // Iterate over all rows
			//data.forEach((row, i) => fnParser(worksheet, row, i));
		if (workbook.Sheets[name]) // replace sheet
			workbook.Sheets[name] = worksheet;
		else // append new sheet
			XLSX.utils.book_append_sheet(workbook, worksheet, name);
		return self;
	}

	this.setTitles = (name, titles) => {
		const worksheet = workbook.Sheets[name]; // sheet must exists
		XLSX.utils.sheet_add_aoa(worksheet, [titles], { origin: "A1" });
		//titles.forEach((title, column) => fnParseTitles(worksheet, title, column));
		return self;
	}

	this.download = fileName => {
		XLSX.writeFile(workbook, fileName, { compression: true });
	}
}

export default new Xlsx();
