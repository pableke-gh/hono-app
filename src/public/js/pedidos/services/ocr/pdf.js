
import ocr from "./tesseract.js";
import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.min.mjs";
//import { PDFParse } from "https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf-parse.es.js"; // helper examples

class PdfOCR {
	async #ocrFromScannedPdf(file) {
		console.log("Extracting text from scanned PDF by OCR:", file.name);
		const ocrResult = []; // output text parsed by OCR

		try {
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const viewport = page.getViewport({ scale: 1.5 });
				const canvas = new OffscreenCanvas(viewport.width, viewport.height);
				const context = canvas.getContext("2d");

				// render currrent PDF page in canvas
				await page.render({ canvasContext: context, viewport }).promise;

				// concatenate OCR results with newlines
				ocrResult.push(await ocr.read(canvas));
				page.cleanup(); // Free memory
			}
		} catch(ex) {
			throw new Error(`Failed to extract text from ${file.name}.`);
		}
		return ocrResult.join("\n");
	}

	async #extractText(file) {
		console.log("Extracting text from PDF:", file.name);
		const texts = []; // page texts array

		const resolveEmbeddedImage = (page, name) => {
			return new Promise((resolve, reject) => {
				// check if image is in common objects (shared across pages) or page-specific objects
				const pdfObjects = page.commonObjs.has(name) ? page.commonObjs : page.objs;
				pdfObjects.get(name, async imgData => {
					if (!imgData) // no data found for the image object
						return reject(new Error(`Image object ${name} not found`));
					const { width, height } = imgData; // extract image info
					if (!width || (width < 80) || !height || (height < 80)) { // min size for ORC
						console.warn(`Image object ${name} has invalid dimensions: ${width}x${height}`);
						return resolve(""); // is not an error => empty text
					}

					if (imgData.data instanceof Uint8Array)
						return resolve(await ocr.read(new ImageData(new Uint8ClampedArray(imgData.data), width, height)));
					if (imgData.data instanceof Uint8ClampedArray)
						return resolve(await ocr.read(new ImageData(imgData.data, width, height)));
					if (imgData.data?.buffer) // ArrayBuffer
						return resolve(await ocr.read(new ImageData(imgData.data.buffer, width, height)));
					if (imgData.bitmap) {
						const canvas = new OffscreenCanvas(width, height);
						const context = canvas.getContext("2d");
						context.drawImage(imgData.bitmap, 0, 0);
						return resolve(await ocr.read(canvas));
					}
					if (ArrayBuffer.isView(imgData.data)) {
						const buffer = new Uint8Array(imgData.data.buffer, imgData.data.byteOffset, imgData.data.byteLength);
						return resolve(await ocr.read(new ImageData(new Uint8ClampedArray(buffer), width, height)));
					}

					reject(new Error(`Image object ${name}: data field is empty or invalid. Available fields: ${Object.keys(imgData).join(", ")}`));
				});
			});
		}

		try {
			const arrayBuffer = await file.arrayBuffer(); // read data as arraay buffer
			//const url = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";
			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i); // get i page
				const textContent = await page.getTextContent(); // extract text content of the page
				texts.push(textContent.items.map(s => s.str.trim()).join(" ")); // concatenate text items with spaces and newlines

				const operatorList = await page.getOperatorList(); // get operator list to check for images (potential OCR)
				for (let j = 0; j < operatorList.fnArray.length; j++) { // iterate over operator list to find images object
					const ops = operatorList.fnArray[j]; // iterate over all PDF objects
					if ((ops === pdfjsLib.OPS.paintImageXObject) || (ops === pdfjsLib.OPS.paintInlineImageXObject)) {
						const imgName = operatorList.argsArray[j][0]; // get the image name from arguments
						texts.push(await resolveEmbeddedImage(page, imgName)); // resolve image data from PDF objects
					}
				}
				page.cleanup(); // Free memory
			}
		} catch(ex) {
			throw new Error(`Failed to extract text from ${file.name}.`);
		}
		return texts.join("\n"); // concatenate page texts with newlines
	}

	async read(file) {
		// 1. Set the worker source for pdf.js (required for async processing)
		pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs";

		const text = await this.#extractText(file); // try to extract text from PDF (no OCR)
		// if not enough text is extracted, try to append OCR on PDF pages
		return (text.length < 300) ? await this.#ocrFromScannedPdf(file) : text;
	}
}

export default new PdfOCR();
