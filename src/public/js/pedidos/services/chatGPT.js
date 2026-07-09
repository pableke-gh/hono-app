import { type } from "os";

class ChatGPT {
	async request(contents) {
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
						content: "Eres un administrativo experto que extrae información clave de facturas, albaranes, presupuestos, etc."
					},
					{
						role: "user",
						content: [
							{
								type: "text",
								content: "Extrae en formato JSON los datos del proveedor relativos al nif, email, fecha de emisión, nº de factura/pedido, porcentaje de iva, importe total y descripción del servicio. Las claves del objeto JSON deben llamarse: 'nif', 'email', 'fecha', 'num_factura', 'iva', 'total', 'desc'. La factura a procesar es la siguiente: " + contents
							}
						]
					}
				],
				max_tokens: 500
			})
		});

		const data = await response.json();
		if (response.ok)
			return data.choices[0].message.content;
		throw new Error(data.error?.message);
	}
}

export default new ChatGPT();
