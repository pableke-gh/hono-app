
import Tesseract from "https://cdn.jsdelivr.net/npm/tesseract.js@6/dist/tesseract.esm.min.js"; // load OCR library (ESM version for modern browsers)
//<script src="https://unpkg.com/tesseract.js@v6.0.0/dist/tesseract.min.js" defer></script> <!-- Load Tesseract.js v6.0.0 -->

class TesseractOCR {
	async read(stream) {
		// 1. Create a worker
		// 2. Load language (spa, eng, ger, rus, fra, etc.)
		const worker = await Tesseract.createWorker("spa");

		// 3. Recognize text from: file, Blob, Canvas, ImageData, ArrayBuffer, etc.
		const { data: { text } } = await worker.recognize(stream);

		// 4. Terminate worker to free memory
		await worker.terminate();

		// 5. Display result
		return text;
	}
}

export default new TesseractOCR();
