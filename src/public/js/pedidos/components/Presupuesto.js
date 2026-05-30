
import alerts from "../../components/Alerts.js";
import FileInput from "../../components/inputs/FileInput.js";
import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.min.mjs";
//import { PDFParse } from "https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf-parse.es.js";

/**
 * Extract text content of selected file using chatGPT
 * and autocomplete form fields with the extracted data.
 */
export default class PresupuestoFile extends FileInput {
	//#canvas = document.createElement("canvas");

	async #ocr(stream) {
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

	async #extractText(file) {
		console.log("Extracting text from PDF:", file.name);
		// 1. Set the worker source for pdf.js (required for async processing)
		pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs";
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
						return resolve(await this.#ocr(new ImageData(new Uint8ClampedArray(imgData.data), width, height)));
					if (imgData.data instanceof Uint8ClampedArray)
						return resolve(await this.#ocr(new ImageData(imgData.data, width, height)));
					if (imgData.data?.buffer) // ArrayBuffer
						return resolve(await this.#ocr(new ImageData(imgData.data.buffer, width, height)));
					if (imgData.bitmap) {
						const canvas = new OffscreenCanvas(width, height);
						const context = canvas.getContext("2d");
						context.drawImage(imgData.bitmap, 0, 0);
						return resolve(await this.#ocr(canvas));
					}
					if (ArrayBuffer.isView(imgData.data)) {
						const buffer = new Uint8Array(imgData.data.buffer, imgData.data.byteOffset, imgData.data.byteLength);
						return resolve(await this.#ocr(new ImageData(new Uint8ClampedArray(buffer), width, height)));
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
				for (let j = 0; j < operatorList.fnArray.length; j++) {
					const ops = operatorList.fnArray[j]; // iterate over all PDF objects
					if ((ops === pdfjsLib.OPS.paintImageXObject) || (ops === pdfjsLib.OPS.paintInlineImageXObject)) {
						const imgName = operatorList.argsArray[j][0]; // get the image name from arguments
						texts.push(await resolveEmbeddedImage(page, imgName)); // resolve image data from PDF objects
					}
				}
				page.cleanup(); // Free memory
			}
		} catch(ex) {
			console.error("PDF text reader:", ex);
			alerts.showError(`Failed to extract text from: ${file.name}. Please ensure the file is not an image and try again.`);
		}
		return texts.join("\n"); // concatenate page texts with newlines
	}

	async #ocrFromImage(file) {
		console.log("Extracting text from:", file.name);
		try {
			return await this.#ocr(file); // read file as data URL and perform OCR
		} catch(ex) {
			console.error("OCR Error:", ex);
			alerts.showError(`Failed to extract text from ${file.name}. Please ensure the file is a clear image and try again.`);
		}
		return ""; // if OCR fails => empty string
	}
	async #ocrFromPdf(file) {
		console.log("Extracting text from scanned PDF by OCR:", file.name);
		// 1. Set the worker source for pdf.js (required for async processing)
		//pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
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
				ocrResult.push(await this.#ocr(canvas));
				page.cleanup(); // Free memory
			}
		} catch(ex) {
			console.error("OCR Error:", ex);
			alerts.showError(`Failed to extract text from ${file.name}. Please ensure the file is a clear image and try again.`);
		}
		return ocrResult.join("\n");
	}
	async #ocrFromTIFF(file) {
		if (typeof UTIF === "undefined") // require UTIF library for TIFF processing
			return !alerts.showError(`Failed to extract pages from the ${file.name}.`);

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
				ocrResult.push(await this.#ocr(canvas));
			}
		} catch(ex) {
			console.error("OCR Error:", ex);
			alerts.showError(`Failed to extract text from ${file.name}. Please ensure the file is a clear image and try again.`);
		}
		return ocrResult.join("\n");
	}

	async #chatGPT(contents) {
		if (!contents) return; // no text to process
		const OPENAI_API_KEY = ""; // public API key

		const response = await window.fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: "gpt-4",
				messages: [
					{
						role: "system",
						content: "You are a helpful assistant that extracts key information from budget documents."
						//content: "Eres un administrativo experto que extrae información clave de facturas, albaranes, presupuestos, etc. de proveedores."
					},
					{
						role: "user",
						content: [
							{ type: "file", filename: this.files[0].name, content: contents },
							{ type: "text", content: `Extract the following fields from this budget document:\n\n${contents}\n\nFields to extract:\n- Total Amount\n- Vendor Name\n- Due Date\n- Line Items (description, quantity, price)` }
						]
					}
				],
				max_tokens: 500
			})
		});

		const data = await response.json();
		if (response.ok)
			console.log("Extracted Data:", data.choices[0].message.content);
		else
			this.form.showError(data.error?.message || "Failed to extract data from the document. Please check the file format and try again.");
	}

	async #loadForm(data) {
		if (!data) return; // no data extracted
		// todo: call api to get proveedor from nif and preload form fields with the extracted data
		if (data.nif) { // data extracted can be incomplete or be optional
			api.init().json("/uae/pedidos/proveedor?nif=" + data.nif).then(data => {
				data.prov && this.form.getElement("proveedor").select(data.prov); // load field
			});
		}
	}

	connectedCallback() {
		super.connectedCallback();
		if (window.location.hostname.indexOf("-local.") < 1)
			return; // test only for localhost

		this.addChange(async ev => {
			const file = this.files[0];
			if (!file) return; // no file selected

			alerts.loading(); // show loading indicator
			if (file.type === "application/pdf") {
				let text = await this.#extractText(file); // try to extract text from PDF (no OCR)
				// if not enough text is extracted, try to append OCR on PDF pages
				text = (text.length < 300) ? await this.#ocrFromPdf(file) : text;
				console.log(text); // display extracted text in console
			}
			else if ((file.type === "image/tiff") || (file.type === "image/tif"))
				console.log(await this.#ocrFromTIFF(file));
			else if (file.type.startsWith("image/"))
				console.log(await this.#ocrFromImage(file)); // extract text from image with OCR
			else
				return !alerts.showError("Unsupported file type. Please select a PDF or image file.");
			this.#chatGPT(); // send extracted text to chatGPT for interpretation and field extraction
			alerts.working(); // hide loading indicator
		});
	}
}
