
import pdf from "./pdf.js";
import tiff from "./tiff.js";
import image from "./image.js";
import result from "../../../core/util/Result.js";
import types from "../../../data/mime-types.js";

class FactoryOCR {
	async read(file) {
		if (file.type === types.pdf)
			return await result.catch(pdf.read(file)); // try to extract text from PDF (no OCR)

		if ((file.type === types.tiff) || (file.type === types.tif))
			return await result.catch(tiff.read(file));

		if (file.type.startsWith("image/"))
			return await result.catch(image.read(file)); // extract text from image with OCR

		// return fail = unsupported file type exception
		return result.fail("Unsupported file type. Please select a PDF or image file.");
	}
}

export default new FactoryOCR();
