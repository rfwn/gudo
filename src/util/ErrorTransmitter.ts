import { IErrorObject, ILogObj } from "tslog";
import { WebhookClient, EmbedBuilder } from "discord.js";
const WEBHOOK_URL = "ERROR_CHANNEL_WEBHOOK_URL";

class ErrorTransmitter {

	constructor() {
		// this.handleWarn = this.handleWarn.bind(this);
		// this.handleError = this.handleError.bind(this);

	}

	public async _sendWebhook(webhookUrl: string, embed: EmbedBuilder): Promise<any> {
		const webhookClient = new WebhookClient({ url: webhookUrl });
		return webhookClient.send({
			embeds: [embed]
		});
	}

	public async handleLog(logObj: ILogObj) {
		
	}

	// public async handleWarn(error: IErrorObject): Promise<any> {
	// 	const embed = new EmbedBuilder()
	// 		.setTitle("Warning on " + error.filePath + " " + error.lineNumber + ":" + error.columnNumber)
	// 		.setColor(0xFFD700)
	// 		.setDescription(`\`\`\`${error.argumentsArray.join("\n")}\`\`\``)
	// 		.setTimestamp(error.date);
	// 	await this._sendWebhook(WEBHOOK_URL, embed);
	// }
	// public async handleError(error: ILogObj): Promise<any> {
	// 	let stack: Array<string> = [];
	// 	if (error.argumentsArray instanceof Array) {
	// 		if (error.argumentsArray[0].stack) {
	// 			stack = error.argumentsArray[0].stack.slice(0, 5).map((stackItem: { typeName: string; methodName: string | undefined; fileName: string; lineNumber: number; columnNumber: number; }) => {
	// 				return `\tat ${stackItem.typeName}.${stackItem.methodName ? stackItem.methodName : "<anonymous>"} (${stackItem.fileName}:${stackItem.lineNumber}:${stackItem.columnNumber})`;
	// 			})

	// 			const embed = new EmbedBuilder()
	// 				.setTitle("Error on " + error.filePath + " " + error.lineNumber + ":" + error.columnNumber)
	// 				.setColor(0xFF0000)
	// 				.setDescription(`\`\`\`\n[${error.argumentsArray[0].name}] ${error.argumentsArray[0].message}\n${stack.join('\n')}\`\`\``)
	// 				.setTimestamp(error.date);
	// 			await this._sendWebhook(WEBHOOK_URL, embed);
	// 		} else {
	// 			const embed = new EmbedBuilder()
	// 				.setTitle("Error on " + error.filePath + " " + error.lineNumber + ":" + error.columnNumber)
	// 				.setColor(0xFF0000)
	// 				.setDescription(`\`\`\`\n${error.argumentsArray[0]}\`\`\``)
	// 				.setTimestamp(error.date);
	// 			await this._sendWebhook(WEBHOOK_URL, embed);
	// 		}
	// 	}
	// }
}


export default new ErrorTransmitter();