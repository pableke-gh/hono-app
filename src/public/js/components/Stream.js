
import B64 from "../data/base64.js";
import mt from "../data/mime-types.js";

function Stream() {
	const self = this; //self instance
	const link = document.createElement("a");
	
	/*this.toByteArray = strBase64 => {
		const binaryString = window.atob(strBase64);
  		const size = binaryString.length;
  		const bytes = new Uint8Array(size);
		for (let i = 0; i < size; ++i)
    		bytes[i] = binaryString.charCodeAt(i);
		return bytes;
	}*/

	this.download = (data, name) => { link.href = data; link.download = name; link.click(); }
	this.downloadPdf = (data, name) => self.download(B64.pdf + data, name || "download.pdf");
	this.downloadZip = (data, name) => self.download(B64.zip + data, name || "download.zip");
	this.zip = (data, name) => self.downloadZip(data, name); // download zip file

	this.redir = (url, target) => { url && window.open(url, target || "_blank"); };
	this.blob = (data, type) => self.redir(URL.createObjectURL(new Blob([new Uint8Array(data)], { type })));
	this.pdf = data => self.blob(data, mt.pdf); // open a new pdf tab
	this.html = (data, title) => {
		const wnd = window.open("about:blank", "_blank");
		wnd.document.write(data); // parse all html
		wnd.document.title = title || "";
		wnd.document.close(); // end write
	}
}

export default new Stream();
