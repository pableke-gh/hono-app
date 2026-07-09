
import ocr from "./tesseract.js";
import UTIF from "https://cdn.jsdelivr.net/npm/utif@3.1.0/+esm"; // TIFF decoder / encoder
//<script src="https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js" defer></script> <!-- TIFF decoder / encoder -->

class TiffOCR {
	async read(file) {
		console.log("Extracting text from tiff image:", file.name);
		if (typeof UTIF === "undefined") // require UTIF library for TIFF processing
			throw new Error(`Failed to extract pages from the ${file.name}.`);

		const ocrResult = []; // output text parsed by OCR
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);
		try {
			const ifds = UTIF.decode(uint8Array);
			for (let i = 0; i < ifds.length; i++) {
				const ifd = ifds[i]; // current idf
				UTIF.decodeImage(uint8Array, ifd);
				const rgba = UTIF.toRGBA8(ifd);

				const imageData = new ImageData(new Uint8ClampedArray(rgba), ifd.width, ifd.height);
				const canvas = new OffscreenCanvas(ifd.width, ifd.height);
				const context = canvas.getContext("2d");
				context.putImageData(imageData, 0, 0);

				// concatenate OCR results with newlines
				ocrResult.push(await ocr.read(canvas));
			}
		} catch(ex) {
			throw new Error(`Failed to extract text from ${file.name}. Please ensure the file is a clear image and try again.`);
		}
		return ocrResult.join("\n");
	}
}

export default new TiffOCR();
