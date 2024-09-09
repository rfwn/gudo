import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import Logger from '../util/Logger';
import config from '../config';
import { WebhookService } from '../services/WebhookService';
import EventRegistry from '../registry/EventRegistry';
import Event from './Event';
import Command from './Command';
import CommandRegistry from '../registry/CommandRegistry';
import ContextMenuRegistry from '../registry/ContextMenuRegistry';
import initdb from '../database/init';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from './Chat';

class Valence extends Client {
	public readonly logger: typeof Logger;
	public readonly webhookManager: WebhookService;
	public readonly config: any;
	public readonly database: any;
	public readonly eventRegistry: EventRegistry;
	public readonly commandRegistry: CommandRegistry;
	public readonly contextRegistry: ContextMenuRegistry;
	public generativeAI: GoogleGenerativeAI;
	public events: Map<string, Event>;
	public commands: Map<string, Command>;
	public contexts: Map<string, Command>;
	public chats: Map<string, Chat>
	constructor() {

		super({
			partials: [
				Partials.Message, Partials.User, Partials.Channel, Partials.Reaction, Partials.GuildScheduledEvent
			],
			intents: [
				GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites,
				GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping,
				GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks,
				GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent
			],
			presence: {
				status: 'online',
				activities: [{
					name: 'things going on fire',
					type: ActivityType.Watching,
				}],
			},
			allowedMentions: { parse: ["users"] },
		});
		this.config = config;
		this.logger = Logger;
		this.webhookManager = new WebhookService(this);
		this.database = initdb;
		this.events = new Map();
		this.eventRegistry = new EventRegistry(this);
		this.commands = new Map();
		this.commandRegistry = new CommandRegistry(this);
		this.contexts = new Map();
		this.contextRegistry = new ContextMenuRegistry(this);
		this.chats = new Map();
		this.generativeAI = new GoogleGenerativeAI(this.config.apiKey)
		this.eventRegistry.loadEvents().then(() => {
			this.commandRegistry.loadCommands().then(() => {
				this.contextRegistry.loadContexts()
			})

		})
	}
}

export default Valence;