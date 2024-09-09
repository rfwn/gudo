import { ILogObj, ILogObjMeta } from 'tslog';
import { ChatSession, GenerativeModel } from "@google/generative-ai";
import { ThreadChannel, User } from "discord.js";
import Client from "./Client";
interface IHistoryObject {
	role: 'model' | 'user';
	parts: [{ text: string }],
}

export default class Chat {
	private client: Client;
	private history: IHistoryObject[] = [];
	private user: User;
	public channel: ThreadChannel;
	private model: GenerativeModel;
	private chat: ChatSession;
	constructor(user: User, thread: ThreadChannel, client: Client, model: 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-1.0-pro' = 'gemini-1.5-flash', instructions: string = '') {
		this.user = user;
		this.channel = thread;
		this.client = client;
		this.model = this.client.generativeAI.getGenerativeModel({ model: model, systemInstruction: instructions });
		this.chat = this.model.startChat({ history: this.history })
	}

	public async textPrompt(content: string): Promise<string | (ILogObj & ILogObjMeta) | undefined> {
		let result;
		try {
			result = await this.chat.sendMessage(content);
		} catch (err) {
			this.client.logger.error(`[!] Failed sending: \n ${err.stack}.`)
			return `Failed sending a message to gemini:\n \`\`\`${err.stack}\`\`\``
		}
		if(result) {
			return result.response.text();
		}
	}

	public addHistory(content: string, role: 'user' | 'model') {
		this.history.push({
			role: role,
			parts: [{ text: content }]
		})
	}

	public async setSlug() {
		const model = this.client.generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: 'Give a short name or description (less than 100 characters) to this conversation or prompt, formatting should be in kebab-case, only send the result without extra text.' })
		const chat = model.startChat({ history: this.history })
		const response = await chat.sendMessage('give name only');
		return this.channel.setName(response.response.text())
	}
}