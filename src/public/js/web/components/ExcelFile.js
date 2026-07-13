
import alerts from "../../core/components/alerts/Alerts.js";
import FileInput from "../../core/components/forms/FileInput.js";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
//import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
//import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js";
import types from "../../data/mime-types.js";

export default class ExcelFile extends FileInput {
	connectedCallback() {
		super.connectedCallback(); // init. component
		this.previousElementSibling.addEventListener("click", () => this.click()); // trigger file input on button click

		this.addChange(async ev => {
			const file = this.files[0];
			if (!file) return; // no file selected
			if ((file.type !== types.xls) && (file.type !== types.xlsx))
				return alerts.setError("Please select a valid Excel file (.xls or .xlsx)");

			const buffer = await file.arrayBuffer();
			const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
			const firstSheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[firstSheetName];
			//console.log(worksheet);

			// Option A: Array of objects (uses first row as headers)
			const header = [ "ej", "id", "jg", "factura", "nif", "interesado", "impJg", "fJg", "desc" ];
			const range = 1; // Starts parsing from the second row (index 1)
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { header, range });
			console.log(jsonData);
			console.log(jsonData[0].ej);

			// Option B: 2D Array (includes header row)
			const arrayData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range });
			console.log(arrayData);
			console.log(arrayData[0][0]);

			// Iterate over rows
			/*arrayData.forEach((row, rowIndex) => {
				// Iterate over columns in each row
				row.forEach((cell, colIndex) => {
					console.log(`Row ${rowIndex}, Col ${colIndex}:`, cell);
				});
			});*/
		});
	}
}
