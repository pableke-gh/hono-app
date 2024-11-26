
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import cp from "child_process"; //system calls
import sharp from "sharp"; // Image handler
import jwt from "jsonwebtoken"; // JSON web token
import mimetypes from "../data/mime-types.json" assert { type: "json" };
import sb from "#client/components/StringBox.js";
import config from "../config.js"; // Configurations

function Util() {
	const self = this; //self instance

	this.error = (ctx, err) => {
		console.error(err); // Log error for console
		return ctx.text(err.message || err, 500);
	}
	this.upload = (user, file, index) => { // Upload single file
		if (!file || (file.size < 1) || !file.name) // Has file selected
			return Promise.resolve(null); // Not selected file
		return file.arrayBuffer().then(buffer => {
			const output = { user_id: user }; // Initialize output results
			Object.copy(output, file, [ "size", "type", "name" ]); // Initialize results
			output.path = "" + user + sb.randString(3) + Date.now() + sb.randString(3) + (index || 0) + sb.lower(path.extname(file.name));
			const filepath = path.join(config.DIR_UPLOADS, output.path);
			fs.writeFileSync(filepath, Buffer.from(buffer)); // If error => throw
			if (file.type.startsWith("image/")) { // If image => try to resize it
				const filethumb = path.join(config.DIR_THUMBS, output.path);
				const fnThen = info => { output.format = info.format; return output; }
				const fnError = err => { fs.unlink(filepath); throw err; };
				return sharp(buffer).resize(320, 340).toFile(filethumb).then(fnThen).catch(fnError);
			}
			return output;
		});
	}
	// allSettled = [ { status: 'fulfilled', value: output }, { status: 'rejected', reason: Error: an error }, ... ]
	this.uploadAll = (user, files) => Promise.allSettled(files.map((file, i) => self.upload(user, file, i)));
	this.getUrlImage = file => (config.URL_IMGS + file);
	this.getUrlThumb = file => (config.URL_THUMBS + file);
	this.getFileThumb = file => path.join(config.DIR_THUMBS, file);
	this.getFileUpload = file => path.join(config.DIR_UPLOADS, file);
	this.unload = file => {
		if (file) { // Remove all file copies
			fs.unlink(self.getFileThumb(file), globalThis.void);
			fs.unlink(self.getFileUpload(file), globalThis.void);
		}
		return self;
	}

    // Options: "-r" recursive, "-j": ignore directory info, "-": redirect to stdout
	//const zip = cp.spawn("zip", ["-rj", "-", "src/public/files/afe98b43839ed5f35684bbc308714e15.jpg", "src/public/files/32b80803a9369f0438bc1bb604b07cf5.jpg"]);
	this.zip = function(output, files) {
		const filepath = path.join(config.DIR_FILES, output);
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files)); //nuevo zip
		zip.stdout.pipe(fs.createWriteStream(filepath)); //sobrescribe el fichero
		return filepath;
	}
	this.sendZip = function(res, filename, files) {
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files));
		res.writeHead(200, {
			"Content-Type": mimetypes.zip,
			"Content-disposition": "attachment; filename=" + filename
		});
		zip.stdout.pipe(res);
	}

	this.sign = function(user) { // get token sync
		return jwt.sign(user, config.JWT_KEY, {
			expiresIn: config.JWT_EXPIRES
		});
	}
	this.verify = function(token) {
		return new Promise(function(resolve, reject) {
			jwt.verify(token, config.JWT_KEY, (err, user) => {
				err ? reject(err) : resolve(user);
			});
		});
	}
}

export default new Util();
