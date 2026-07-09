
import ocr from "./tesseract.js";

class ImageOCR {
	async read(file) {
		console.log("Extracting text from image:", file.name);
		try {
			return await ocr.read(file); // read file as data URL and perform OCR
		} catch(ex) {
			throw new Error(`Failed to extract text from ${file.name}. Please ensure the file is a clear image and try again.`);
		}
	}
}

export default new ImageOCR();
