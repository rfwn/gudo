import Client from './Client';
import { ClientEvents } from 'discord.js';

class Event {

	public readonly name: keyof ClientEvents;
	public readonly client: Client;
	private readonly _event;

	constructor(client: Client, name: keyof ClientEvents) {
		this.name = name;
		this.client = client;
		this._event = this.safeRun.bind(this);
	}

	private async safeRun(...args: any) {
		try {
			return await this.run(...args, this.client);
		} catch (error) {
			console.log(error)
			this.client.logger.error(new Error(`Event ${this.name} failed to execute.`))
		}
	}

	public async run(..._args: any): Promise<any> { }

	public listen() {
		return this.client.on(this.name, this._event);
	}

	public turnOff() {
		return this.client.off(this.name, this._event);
	}
}

export default Event;