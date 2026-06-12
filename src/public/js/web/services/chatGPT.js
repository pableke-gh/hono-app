
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
			return data.choices[0].message.content;
		throw new Error(data.error?.message);
	}
}

export default new ChatGPT();
