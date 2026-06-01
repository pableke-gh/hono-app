
import pdf from "./pdf.js";
import tiff from "./tiff.js";
import image from "./image.js";

class FactoryOCR {
	async read(file) {
		if (file.type === "application/pdf")
			return await pdf.read(file); // try to extract text from PDF (no OCR)

		if ((file.type === "image/tiff") || (file.type === "image/tif"))
			return await tiff.read(file);

		if (file.type.startsWith("image/"))
			return await image.read(file); // extract text from image with OCR

		// throw unsupported file type exception
		throw new Error("Unsupported file type. Please select a PDF or image file.");
	}
}

export default new FactoryOCR();
