
import ButtonForm from "../../../core/components/forms/ButtonForm.js"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";

export default class ExcelButton extends ButtonForm {
	execute() {
		// 1. get current accordion instance
		const accordion = this.form.getAccordion();

		// 2. Define custom headers
		const headers = accordion.getHeaders();

		// 3. Create a new workbook and empty worksheet
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet([], { skipHeader: true }); // skipHeader: true in json_to_sheet ensures the JSON keys are not automatically used as column headers

		// 4. Add custom headers (array of arrays) at cell A1
		XLSX.utils.sheet_add_aoa(worksheet, [ headers ], { origin: "A1" });

		// 5. Add JSON data starting at A2 (skipping the header row)
		XLSX.utils.sheet_add_json(worksheet, accordion.getExcel(), { origin: "A2", skipHeader: true });

		// 6. Append worksheet to workbook and save
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, accordion.getName() + ".xlsx");
	}
}
